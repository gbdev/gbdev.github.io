---
head:
  - - meta
    - name: og:title
      content: Timing of LYC STAT Handlers
  - - meta
    - name: og:description
      content: Guide on how to implement raster effects is with the rLYC register.
---

# The Timing of LYC STAT Handlers

Written by [Ron Nelson](https://github.com/rondnelson99/)

---

Raster effects are probably the greatest asset that retro game consoles have.
The fact that the PPU generates the image right as it is displayed allows many special effects to be created by modifying the drawing parameters while the image is being drawn.
However, unlike some consoles like the SNES, raster effects on the Game Boy have to be performed by the CPU.
The easiest way to implement raster effects is with the rLYC register at $FF45.
Here's how the Pan Docs explain this register's simple function:

> [**FF45 - LYC (LY Compare) (R/W)**](https://gbdev.io/pandocs/Scrolling.html#ff45---lyc-ly-compare-rw)
>
> The Game Boy permanently compares the value of the LYC and LY registers.
> When both values are identical, the “LYC=LY” flag in the STAT register is set, and (if enabled) a STAT interrupt is requested.

So, the basic setup for raster FX is as follows:

1. Request an interrupt by setting rLYC to the appropriate scanline
2. The system will start your interrupt routine when that scanline begins
3. Perform your chosen effect by modifying PPU registers
4. Exit with reti

This seems simple enough, but unfortunately, this process comes with significant caveats.
So, here are some things to keep in mind:

All but the most complex of raster effects are registers that you change between scanlines.
For that reason, you want to perform your register write while the screen is not being drawn, so during Hblank or OAM search.
You may know that LYC interrupts are requested at the start of a scanline, which happens to be Mode 2 (OAM search).
However, because of Mode 2's short duration combined with unreliability of interrupt timing, you will not reliably have enough time to perform your write.
Therefore, you have to wait for the next Hblank to perform your register write.
You also need to compensate for this by requesting an interrupt on the line before the one on which you wish to perform your effect.
For instance, if I want to enable sprites at line 16 when my upper status bar finishes drawing, I would write 15 to rLYC.

Like I mentioned above, the time at which your handler will begin execution will be delayed by an inconsistent amount, which makes it difficult to determine when the beginning of Hblank will come.
You'll see why this is and how this can be avoided later.

The final problem is perhaps the biggest one.
It's common practice in Gameboy Development to use a STAT check to write to VRAM between scanlines.
The typical way of doing this is to read STAT, and then reap up to 16 cycles of guaranteed VRAM access time.
This method is great for copying small bits of data quickly, and uses little CPU time.
However, if an LYC interrupt fires during one of those VRAM accesses, you can potentially take some of its VRAM-safe time and cause VRAM writes from the main thread to fail.
However, this can be avoided with some careful planning.

## Timing, With Diagrams and Stuff

First, let's look at the timing of the rendering itself, courtesy of the Pan Docs:

**![](/images/pandocs_timing.png)**

Note that:
- Each full scanline takes exactly 456 dots (114 cycles)
- Mode 2 also takes a constant amount of time (20 cycles)
- Hblank length varies wildly, and will often be nearly as long as or longer than the drawing phase
- Hblank and OAM scan are mostly interchangeable, and long as you're not doing OAM pokes during Hblank
- The worst-case Hblank takes a number of dots that is not divisible by 4. However, as far as I'm aware, this still behaves like 88 dots in practice.

Now, I will have a bunch of diagrams showing the timing of various situations.
Each row represents exactly one scanline, and the columns show the individual cycles.
Consider zooming in to better see these cycles.
First, let's consider a simple LYC routine.
It will disable sprites if called for line 128, but otherwise, it will enable them.

```asm
LYC::
	push af
	ldh a, [rLY]
	cp 128 - 1
	jr z, .disableSprites

	; enable sprites
	ldh a, [rLCDC]
	set LCDCB_OBJON, a
	ldh [rLCDC], a
	pop af
	reti

.disableSprites
	ldh a, [rLCDC]
	res LCDCB_OBJON, a
	ldh [rLCDC], a
	pop af
	reti
```

Note that this may not be an especially well-written LYC routine, but the actual logic of the routine itself is outside the scope of this tutorial.
If that's what you're looking for, check out [DeadCScroll](https://github.com/gb-archive/DeadCScroll) by Blitter Object.
It uses the Hblank interrupt rather than the LYC interrupt, but it should still teach you some fundamentals.
However, that tutorial does not attempt to solve the problems described below, so be wary of combining that tutorial's STAT routine with STAT-based VRAM accesses in the main thread.

Here's how the timing of all this might look:

![](/images/first_example.png)

The 5 yellow cycles mark the time it takes for the system to prepare the interrupt.
During this time, it has to push the program counter to the stack, disable interrupts, etc.
Then, the actual interrupt routine can start.

Right now, there are a few problems here.
The first is that the actual register write that the routine performs happens during the drawing phase.
This is most likely undesirable, and could lead to graphical glitches like a partial sprite being displayed before it is cut off when sprites are disabled.

The other problem is what might be happening during the main thread:

![](/images/main_thread.png)

This is the worst-case scenario for a STAT-based VRAM access.
Here, the main thread reads rSTAT on the very last cycle of Hblank.
After the brief processing of the value it read, the main loop may use the 16 guaranteed cycles of OAM scan to access VRAM.
This just barely works out.
But what happens if an interrupt is requested on that next cycle?

![](/images/problem.png)

Oh no! The main thread is trying to access VRAM right in the middle of the drawing phase! This could lead to all sorts of glitches.

The solution is not too complicated, at least on paper.
We just need to do all our register writes, and exit, during Hblank.
This seems easy enough, since if you've made it this far, you already know how to utilize the blanking periods to access VRAM.
So what happens if you use that method?

![](/images/bad_fix.png)

Here, the long blue strip represents the time spent within the interrupt routine.
Remember that many STAT routines will be much more complicated than the simple example above.

Once again, the VRAM access time overlaps with the Drawing phase.
The problem here is that the register write, pop and reti all take some of those guaranteed cycles when it is possible to access VRAM.
So, the real solution is to fully exit before the end of Hblank.
There are two ways to do this.
One is to wait for the Drawing phase before waiting for Hblank.
This effectively catches the very start of Hblank, leaving plenty of time to exit.
Here's how the earlier example might look using this method:

```asm
LYC::
	push af
	push hl
	ldh a, [rLY]
	cp 128 - 1
jr z, .disableSprites

	; enable sprites
	ldh a, [rLCDC]
	set LCDCB_OBJON, a
	jr .finish

.disableSprites
	ldh a, [rLCDC]
	res LCDCB_OBJON, a

.finish
	ld hl, rSTAT
	.waitNotBlank
	bit STATB_BUSY, [hl]
	jr z, .waitNotBlank
	.waitBlank
	bit STATB_BUSY, [hl]
	jr nz, .waitBlank

	ldh [rLCDC], a
	pop hl
	pop af
	reti
```

See how this method never interferes with VRAM accesses in the main thread, even with the worst possible timing and the shortest of Hblanks:

![](/images/double_spinloop.png)

Phew! This just barely works.
There are only two cycles to spare! If there were multiple registers that needed updating, you might run into trouble.
Normally, These really short Hblanks are the worst-case scenario that you always fear.
However, in practice, Hblanks are normally much longer, often even longer than the drawing phase.
Using this method, that can actually have unfortunate consequences:

![](/images/wasted_scanline.png)

This time, when all the processing was done, there was still plenty of time left in the scanline to safely exit.
However, since Hblank was so long, the routine missed the check for the drawing window and wasted an entire scanline waiting for that Drawing -> Hblank transition before it exited.
Not only does this waste precious CPU time, but it also limits how often raster FX can be used throughout the frame.
This method still works fine though, and can be an easy approach if you use Raster FX sparingly.

I'm a bit of a perfectionist, so I usually like to strive for the absolute best method.
In a perfect world, we would precisely know whether we have enough Hblank left to safely exit.
There actually is a way to do that though! You just need to count exactly how long your routine takes, and make sure it always exits during Hblank.
This comes with some caveats though.
Most routines, if they haven't been specifically designed for this method, will take a variable amount of time.
The main things you need to avoid are `if` statements and loops.
Specifically, if statements of this form are problematic:

```asm
	; test a condition here...

jr nc, .skip ; skip the next part unless Carry is set

	; do something here, only if the previous operation set Carry

.skip
	; continue on with the program.
```

The problem here is that the code following this pattern may be run after a variable number of cycles have passed.
If you need to use an if statement, always make it an if/else statement so that you can waste cycles in the `else` portion and take the same number of cycles.

So now that you're ready to count the cycles of your handler, how long do you need to make the routine? Let's look at some more diagrams to figure this out!

![](/images/long_cycle_count.png)

Wow! That's a lot of cycles! Here, the routine takes exactly one scanline to complete, so the main thread does its writes at the same moment on the next scanline, with no idea what happened! If you count up all the cyan cycles, you'll see that there are 105 of them, and 109 if you count the `reti`.
This extra time makes it possible to write to two or three registers safely, rather than just one.
If you don't need all that time, you can make it shorter as well:

![](/images/short_cycle_count.png)

This time, I put the `and` and `jr` before the interrupt, so that when it resumes, it's all ready to start writing to VRAM.
This interrupt routine is 87 cycles long, including the `reti`.
This won't often prove especially useful though, because you never take any time during Hblank to actually do any register writes.
However, you could use this if your routine has a case where it realizes that nothing actually needs to be written, and you can exit earlier.

From those two diagrams, you'll see that the 22 cycles of worst-case Hblank is the time you can use to write to any PPU registers, pop your registers back, and then exit with reti.
These 22 cycles are cycle 88 through cycle 109, inclusive.

What if I told you that you could actually have your handler take only 86 cycles? Well, you can!

![](/images/86_cycle_count.png)

This seems bad, since the first cycle of the red bar, where the main thread may try to access VRAM, is potentially during the Drawing phase! This is also fine though.
All instructions that access memory, whether through an immediate address or using a register pair as a pointer, take multiple cycles to complete.
That's because the first cycle of every instruction is used to fetch the operation code itself.
The memory access that the instruction performs is always in the 2nd, 3rd or 4th cycle of the instruction.
In this situation, the 2nd cycle of the VRAM-accessible time is in Hblank, so this won't actually cause any problems.

## But Wait!

The interrupt latency I showed earlier doesn't actually tell the full story.
Before it even starts to service the interrupt, the system waits for the current instruction to finish.
This is how that might look with the longest allowable routine:

![](/images/call_offset.png)

Here, the first green block shows the system waiting 5 cycles for a `call` instruction to finish. `call` is the longest instruction at 6 cycles, so if the interrupt is requested just after it begins, the system will wait 5 cycles for it to complete.
This seems bad, since the routine exited after the end of Hblank.
However, this is actually fine! Those waiting cycles were not wasted; they were still 5 cycles of work that the main thread got done.
So in the end, the main thread still gets its 20 cycles of VRAM-accessible time.

## Pros and Cons

Thus far, I have presented two very different methods for making safe LYC handlers, and each have their pros and cons.

## Double-Busy-Loop

**Pros**
- does not require all code to be constant-time
- does not require tedious cycle-counting
- may exit very early if the routine finishes quickly

**Cons**
- does not provide enough Hblank time to safely write multiple registers
- if the routine takes too long, it may miss mode 3 and waste an entire scanline before exiting

## Cycle-counting

**Pros**
- leaves more time for more complex logic in the routine
- allows enough time during blanking to write to up to three registers
- never takes longer than one scanline

**Cons**
- requires all code to be constant-time
- requires tedious cycle-counting
- always takes close to an entire scanline, even if Hblank starts much sooner

This suggests that the double-busy-loop method is good for extremely simple LYC routines that only need to write to one register, or routines that for some reason cannot be cycle-counted.
If you need more time for calculations and more time to write to those registers, you can cycle-count your routine.

But what if you could combine both these methods? Enter the **Hybrid Cycle-Counted Handler™**, a technique I came up with while writing this document.

## Combining Approaches

The goal of this method is to combine the maximum Hblank time that cycle-counting delivers, while still exiting early when Hblank is longer.
Here is an example.
If you've read [DeadCScroll](https://github.com/gb-archive/DeadCScroll), you'll recognise this as that tutorial's STAT Handler, modified to start at Mode 2 rather than Hblank, and be safe towards VRAM accesses in the main thread.

```asm
push af ; 4
push hl ; 8

; obtain the pointer to the data pair
ldh a,[rLY] ; 11
inc a ; 12
add a,a ; 13 ; double the offset since each line uses 2 bytes
ld l,a ; 14
ldh a,[hDrawBuffer] ; 17
adc 0 ; 19
ld h,a ; 20 ; hl now points to somewhere in the draw buffer

call UnconditionalRet ;just waste 31 cycles while we wait for Hblank to maybe start
call UnconditionalRet
call UnconditionalRet
nop ; 51

; now start trying to look for Hblank to exit early

ldh a, [rSTAT]
and STATF_BUSY
jr z, .setAndExit ; 58

ldh a, [rSTAT]
and STATF_BUSY
jr z, .setAndExit ; 65

ldh a, [rSTAT]
and STATF_BUSY
jr z, .setAndExit ; 72

ldh a, [rSTAT]
and STATF_BUSY
jr z, .setAndExit ; 79

nop ;waste 4 more cycles since there isn't time for another check
nop
nop
nop ; 83

.setAndExit
; set the scroll registers
ld a,[hl+] ; 85
ldh [rSCY],a ; 88
ld a,[hl+] ; 90
ldh [rSCX],a ; 93

pop hl ; 97
pop af ; 100
reti ; 104
```

Once the handler finishes its logic, the handler delays cycles until it reaches the window then Hblank might start.
With a 5-cycle offset due to a `call`, and the longest possible Hblank, the earliest Hblank might start is cycle 54, so that's the first attempt to read rSTAT.
It keeps checking rSTAT until even in the worst-case scenario, it knows that Hblank will start.
Then, it uses that time to write the scroll registers and exit.
This way, it can still exit early, as long as the Hblank length permits.
This routine takes 104 cycles in the worst-case scenario, but may take as few as 79 if Hblank comes sooner.

The reason that the double-busy-loop method requires checking for Mode 3 but this method does not is that the double-busy-loop method is not cycle-counted, so you might be at the very end of Hblank which is problematic.
Since this method is cycle-counted, you know that if Hblank has begun, you are at or near the start of it.

If we make a similar list of pros and cons for this method, this is what it might look like:

## Hybrid cycle-counting

**Pros**
- may exit very early if Hblank is longer
- allows enough time during blanking to write to up to three registers
- never takes longer than one scanline

**Cons**
- requires all code to be constant-time
- requires tedious cycle-counting

This method can work well in many circumstances, and is especially suited to frequent effects that modify multiple registers and need to exit quickly to avoid taking too much CPU time.
This method can even work reasonably well when used on every scanline through the Mode 2 interrupt.

All three of these methods can generate great-looking effects, but I think the third one is an especially attractive option.

Congrats! You made it to the end of the tutorial! I bet you're tired of reading it, and I'm tired of writing it too.
So thanks for reading, see you next time!
