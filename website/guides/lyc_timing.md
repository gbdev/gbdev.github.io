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

Written by [Ron Nelson](https://github.com/rondnelson99/) and [ISSOtm](https://eldred.fr)

---

Raster effects are probably the greatest assets that retro game consoles have.
The fact that the PPU generates the image right as it is displayed allows many special effects to be created by modifying the rendering parameters while the image is being drawn.
Here is an example:

<figure>

![Example of raster effect](/deadcscroll/gif/xysine.gif)

</figure>

However, unlike some consoles like the SNES, the Game Boy contains no hardware dedicated to raster effects, so the task falls squarely on the CPU.
This causes raster FX code to interact with the rest of the program in complex ways, particularly when it comes to [accessing VRAM](https://gbdev.io/pandocs/Accessing_VRAM_and_OAM).

In this article, we will explore different techniques for handling raster effects, and discuss their pros and cons with the help of some diagrams.

::: warning PRIOR KNOWLEDGE ASSUMED

This article is not a friendly introduction to programming raster effects, and assumes you are already comfortable with Game Boy programming.
To learn more about how to achieve neat raster effects like the above, check out [DeadCScroll](deadcscroll.md) first, which the above GIF is actually from!

Additionally, since the operations discussed here are *extremely* timing-sensitive, discussions will revolve around assembly instructions.
You can learn how to program for the Game Boy in assembly in [GB ASM Tutorial](https://eldred.fr/gb-asm-tutorial).

:::

::: tip TERMINOLOGY

We'll reference a few terms throughout this tutorial; here are brief explanations of them:

- **SoC**: [System-on-a-Chip](https://en.wikipedia.org/wiki/System_on_a_chip), a single chip that includes most (or all!) components of a system. The Game Boy's functionality is almost entirely contained within a single chip, confusingly labelled "DMG-CPU" or similar. (Contrast this with, for example, the SNES, where there is one chip for the CPU, two for the PPU, and many more.)
- **CPU**: Central Processing Unit, the part of the SoC that executes code and configures everything else.
- **PPU**: Pixel Processing Unit, the part of the SoC that is responsible for sending pixels to the LCD and generating them.
- **Rasterization**: the process of turning... something (for example, a collection of textured polygons; or, on the GB, tiles and tilemaps) into an array of pixels. "Raster" is sort of a contraction of that term.
- **Scanline**: a row of pixels; it's called a "scan"-line because the lines get drawn one by one, pixel by pixel, as if the PPU was "scanning" along the screen.
- **Register**: in general, a small piece of memory, usually linked to some hardware component.
- **PPU mode**: The PPU can be in one of four modes at a given time, depending on what it's doing. [Please refer to Pan Docs](https://gbdev.io/pandocs/STAT) to learn what each mode corresponds to  and how they are scheduled—they interact very tightly with raster effects.
- **Interrupt**: an event that gets generated. Typically, this causes a "handler" to be `call`ed, which is a special routine dedicated to reacting to a given interrupt.
- **"Main thread"**: any code that is executed outside of interrupt handlers.

:::

## Introduction

The easiest way to implement raster effects is to use the `LYC` register with the STAT interrupt.

Here is what the Pan Docs have to say about this register's simple function:

> [**FF45 - LYC (LY Compare) (R/W)**](https://gbdev.io/pandocs/Scrolling#ff45---lyc-ly-compare-rw)
>
> The Game Boy permanently compares the value of the LYC and LY registers.
> When both values are identical, the “LYC=LY” flag in the STAT register is set, and (if enabled) a STAT interrupt is requested.

So then, the outline for setting up a raster effect is as follows:

1. Register an interrupt by setting `LYC` to the desired scanline
2. When that scanline begins, the STAT interrupt handler will automatically be called
3. Perform your chosen effect by modifying PPU registers
4. Exit the handler with `reti`

::: tip ALTERNATIVES

There are other ways to perform raster FX, such as busy-waiting in the "main thread", but as this article's title suggests, we won't discuss them here.

A major pro of `LYC`-interrupt-based raster effects is that they can be made self-contained, and thus largely independent of whatever the "main thread" is doing.
This, in turn, simplifies the mental complexity of the code (decoupling), copes better with lag frames, and more.

Many of the points brought forth later, particularly regarding cycle counting, are still relevant with these alternatives, so this is still worth reading!

:::

These four steps sound simple enough on their own, but there are numerous caveats we will discuss.
Strap in!

- Most raster effects are implemented by modifying registers *between* scanlines.
  Thus, you will want to write the register either during Mode 2 (of the same scanline), or Mode 0 (of the previous one)—anything but Mode 3, really.  
  Unfortunately, `LY=LYC` interrupts are requested at the beginning of a scanline, so during the very short Mode 2, leaving too little time to perform but the most basic of effects.
- Writing to the register during HBlank instead implies triggering the interrupt on the scanline *above* the effect, as well as idling for most of the scanline. So, if I wanted to enable sprites on scanline 16, I'd write 15 to `LYC`.
- Mode 3's length is variable, so syncing to HBlank is difficult and time-consuming.
- The interrupt handler's execution may be delayed by a few cycles, which makes it difficult to reliably sync to the PPU.
- If the "main thread" is itself trying to sync with the PPU (typically by polling `STAT` in a loop), our interrupt may throw off its timing.

Sounds good?
Then let's get started!

## Timing

First, let's look at the timing of the rendering itself, [courtesy of the Pan Docs](https://gbdev.io/pandocs/pixel_fifo):

<inline-svg src="/images/ppu_modes_timing.svg" viewBox="0 0 700 307" style="--fg: var(--c-text);" />

Here are some key points:
- A "dot" is one period of the PPU's 4 MiHz clock, i.e. 0.25 µs.
- A "cycle" is the main unit of time in the CPU, which is equal to 1 µs, or 4 dots. (The Game Boy Color CPU can enter a "double-speed" mode which halves the length of cycles, but not of dots. For the sake of simplicity, we won't consider the differences it involves here.)
- Each scanline takes exactly 456 dots, or 114 cycles.
- Mode 2 also takes a constant amount of time (20 cycles)
- HBlank's length varies wildly, and will often be nearly as long as or longer than the drawing phase.
- HBlank and OAM scan are mostly interchangeable, and long as you're not writing to OAM.
- The worst-case HBlank's length is not a multiple of 4 dots, so we will round down to 21 cycles.

Let's consider a simple STAT handler, which disables OBJs if called at line 128, and enables them otherwise:

@[code asm](lyc_timing/simple_handler.asm)

::: tip

This is not an especially well-written `STAT` handler, but the actual is outside the scope of this tutorial.
If that's what you're looking for, check out [DeadCScroll](deadcscroll) by Blitter Object.
It triggers the STAT interrupt on HBlanks rather than `LYC`, but the fundamentals are the same.

Note that, for simplicity's sake, DeadCScroll does not consider the problems described further below, so be wary of combining that tutorial's STAT handler unmodified with `STAT`-based VRAM accesses in the main thread.

:::

Let's assume that the interrupt fires at, say, scanline 42.
Equipped with [the GB instruction table](https://gbdev.io/gb-opcodes/optables) (see its legend at the bottom), we can plot how many cycles each operation takes, in relation with the PPU's mode:

<Timeline :offset="0" asmFile="lyc_timing/simple_handler.asm">
    <CPUOp op="interrupt" />
    <CPUOp :line="2" />
    <CPUOp :line="3" immediate />
    <CPUOp :line="4" immediate />
    <CPUOp :line="5" />
    <CPUOp :line="8" immediate />
    <CPUOp :line="9" immediate />
    <CPUOp :line="10" immediate io legend="Write to LCDC" />
    <CPUOp :line="11" />
    <CPUOp :line="12" />
</Timeline>

The first 5 cycles do not have an instruction: indeed, calling an interrupt handler is not instantaneous, and the CPU is temporarily busy pushing the program counter (`PC`) to the stack, disabling interrupts, etc.
Then, the actual interrupt handler begins execution.

We can immediately spot a problem: the cycle during which `LCDC` is written to falls in the middle of rendering!
(With only a handful of exceptions, instructions that access memory do so on their very last cycle.)
This is usually undesirable, and could lead to graphical glitches like an OBJ being partially cut off until we write to `LCDC`.

Another problem, less obvious but oh so painful, is how the interrupt handler might interact with the "main thread"'s operation.

### The VRAM access [race condition](https://en.wikipedia.org/wiki/Race_condition)

Accessing VRAM [is not possible during Mode 3](https://gbdev.io/pandocs/Accessing_VRAM_and_OAM).
Thus, when we want to access VRAM, precautions must be taken; the most common is to use the following loop:

@[code asm](lyc_timing/stat_loop.asm)

This loop checks whether `[STAT] & 2` is zero, and exits when it does.
Looking at [documentation for `STAT`](https://gbdev.io/pandocs/STAT#ff41---stat-lcd-status-rw), we can see that the lowest 2 bits report the PPU's mode, and that `[STAT] & 2` is zero for Mode 0 and Mode 1, but not Mode 2 or Mode 3.
So, essentially, this loop waits for Mode 0 or Mode 1, which are both safe to write to VRAM—but it can't be that simple.

<Timeline :offset="111" asmFile="lyc_timing/stat_loop.asm">
    <CPUOp :line="2" immediate io legend="Read from STAT" />
    <CPUOp :line="3" immediate />
    <CPUOp :line="4" />
    <CPUOp op="critical" />
    <CPUOp op="condensed" :cycles="2" />
</Timeline>

Pictured above is the "worst case" for this loop.
As you can see, on the cycle that `STAT` is read, the PPU is still in Mode 0; however, checking for it takes a few cycles, during which we enter Mode 2!

Now, thankfully, Mode 2 is *also* safe for accessing VRAM—but only 16 cycles of it remain.
This is why this loop is said to guarantee 16 "VRAM-safe" cycles: any access performed 17 cycles or more after it would break in this worst case.

Now, what would happen if our interrupt was requested in the middle of this?

<Timeline :offset="111" asmFile="lyc_timing/simple_handler.asm">
    <CPUOp instr="ldh a, [rSTAT]" immediate io legend="Read from STAT" />
    <CPUOp op="interrupt" />
    <CPUOp :line="2" />
    <CPUOp :line="3" immediate />
    <CPUOp :line="4" immediate />
    <CPUOp :line="5" />
    <CPUOp :line="8" immediate />
    <CPUOp :line="9" immediate />
    <CPUOp :line="10" immediate />
    <CPUOp :line="11" />
    <CPUOp :line="12" />
    <CPUOp instr="and STATF_BUSY" immediate />
    <CPUOp instr="jr nz, .waitVRAM" />
    <CPUOp op="critical" />
</Timeline>

Oh no!
The main thread is now trying to access VRAM right in the middle of Mode 3!
This could lead to all sorts of visual bugs.

### A solution?

The solution is not too complicated, at least on paper.
We should be able to use the same `STAT`-checking loop (or at least, a variation of it) inside of the handler.
It works in the main thread, so it should work here as well, right?

Remember that many `STAT` handlers will be much more complicated than the simple example above, so let's draw a diagram with an imaginary handler that would take significantly more time:

<Timeline :offset="111">
    <CPUOp instr="ldh a, [rSTAT]" immediate io legend="Read from STAT" />
    <CPUOp op="interrupt" />
    <CPUOp op="condensed" :cycles="92" />
    <CPUOp instr="ldh a, [rSTAT]" immediate />
    <CPUOp instr="and STATF_BUSY" immediate />
    <CPUOp instr="jr nz, .handlerWait" />
    <CPUOp instr="(Write to LCDC)" op="ldhl" immediate />
    <CPUOp instr="pop hl" />
    <CPUOp instr="pop af" />
    <CPUOp instr="reti" />
    <CPUOp instr="and STATF_BUSY" immediate />
    <CPUOp instr="jr nz, .waitVRAM" />
    <CPUOp op="critical" />
</Timeline>

::: tip

All the instructions between the "Interrupt dispatch" and "Return from interrupt" blocks are the interrupt handler, the rest is in the "main thread".

:::

The `STAT` loop does fix the register being written to during Mode 3; however, once again, the 16 cycles that "main thread" expects to be VRAM-safe overlap with Mode 3.
The problem here is that the write, `pop` and `reti` all take some of those cycles, and the "main thread" is using the value it read from `STAT` during the previous scanline—but that value is now stale.

### Possible fixes

Using what we have learned so far, we can boil down the problem to three factors:

1. Our handler can trigger in the middle of this sequence of events
2. Our handler preserves the stale value read from `STAT` earlier
3. Our handler returns during a time where accessing VRAM is unsafe

It would be enough to get rid of *any* of these, so let's enumerate our options.

#### Dealing with it

It's entirely possible to accept the loss of some of those cycles.
This amounts to assuming less than the usual 16 cycles after such loops.
For example, putting a `STAT`-polling loop just before the last `pop af` and `reti` would have these two eat up 7 cycles, so we are down to 9.

This will quickly become impractical, requiring syncing to the LCD much more often in the main thread.

#### Handler timing

A simple way to prevent those pesky handlers from throwing off our timing is to disable them, with the `di` instruction.
Unfortunately, it can't quite be so simple, as using `di` for this brings its own share of problems.

The most important one is that disabling the handlers like this *delays* their execution!
`STAT` handlers designed to write to hardware regs during HBlank may start doing so during rendering instead; timer interrupts won't trigger as regularly now; and so on.

Using `di` is valid in some cases, but typically not when `STAT` interrupts are involved, due to their fairly strict timing requirements.

An oddly common alternative is to perform all VRAM updates in VBlank handler.
(The reason why it's common especially in early GB games is likely being a carry-over from the NES, where the lack of HBlanks essentially mandates such a setup anyway.)
While this can work, such as for *Metroid II*, it requires significant complexity from having to keep deferring graphical updates.

#### Stale `STAT` read

There is not much that can be done about this one.
The interrupt handler *must* preserve registers, and ...

TOCTTOU

#### Return timing

This is the solution that the rest of this article will explore, as we will see that it makes the least painful compromises out of most use cases.

So, the real solution is to fully exit before the end of HBlank.
There are two ways to do this.
One is to wait for the Drawing phase before waiting for HBlank.
This effectively catches the very start of HBlank, leaving plenty of time to exit.
Here's how the earlier example might look using this method:

@[code asm](lyc_timing/ret_hblank_handler.asm)

See how this method never interferes with VRAM accesses in the main thread, even with the worst possible timing and the shortest of HBlanks:

<Timeline :offset="111" :hblank-length="21" asmFile="lyc_timing/ret_hblank_handler.asm">
    <CPUOp instr="ldh a, [rSTAT]" immediate />
    <CPUOp op="interrupt" />
    <CPUOp :line="2" />
    <CPUOp :line="3" />
    <CPUOp :line="4" immediate />
    <CPUOp :line="5" immediate />
    <CPUOp :line="6" />
    <CPUOp :line="9" immediate />
    <CPUOp :line="10" immediate />
    <CPUOp :line="11" taken />
    <CPUOp :line="18" op="ld-imm16" />
    <CPUOp :line="20" immediate io legend="STAT is tested" />
    <CPUOp :line="21" />
    <CPUOp :line="23" immediate io legend="STAT is tested" />
    <CPUOp :line="24" taken />
    <CPUOp op="condensed" :cycles="42" />
    <CPUOp :line="23" immediate io legend="STAT is tested" />
    <CPUOp :line="24" taken />
    <CPUOp :line="23" immediate io legend="STAT is tested" />
    <CPUOp :line="24" taken />
    <CPUOp :line="23" immediate io legend="STAT is tested" />
    <CPUOp :line="24" />
    <CPUOp :line="26" immediate />
    <CPUOp :line="27" />
    <CPUOp :line="28" />
    <CPUOp :line="29" />
    <CPUOp instr="and STATF_BUSY" immediate />
    <CPUOp instr="jr nz, .waitVRAM" />
    <CPUOp op="condensed" :cycles="16" class="critical" legend="VRAM accesses" />
</Timeline>

Phew! This just barely works.
There are only two cycles to spare! If there were multiple registers that needed updating, you might run into trouble.
Normally, These really short HBlanks are the worst-case scenario that you always fear.
However, in practice, HBlanks are normally much longer, often even longer than the drawing phase.
Using this method, that can actually have unfortunate consequences:

<Timeline :offset="111" :hblank-length="51" asmFile="lyc_timing/ret_hblank_handler.asm">
    <CPUOp instr="ldh a, [rSTAT]" immediate />
    <CPUOp op="interrupt" />
    <CPUOp :line="2" />
    <CPUOp :line="3" />
    <CPUOp op="condensed" :cycles="46" />
    <CPUOp :line="18" op="ld-imm16" />
    <CPUOp :line="20" immediate io legend="STAT is tested" />
    <CPUOp :line="21" taken />
    <CPUOp op="condensed" :cycles="48" />
    <CPUOp :line="20" immediate io legend="STAT is tested" />
    <CPUOp :line="21" />
    <CPUOp :line="23" immediate io legend="STAT is tested" />
    <CPUOp :line="24" taken />
    <CPUOp op="condensed" :cycles="48" />
    <CPUOp :line="23" immediate io legend="STAT is tested" />
    <CPUOp :line="24" />
    <CPUOp :line="26" immediate />
    <CPUOp :line="27" />
    <CPUOp :line="28" />
    <CPUOp :line="29" />
    <CPUOp instr="and STATF_BUSY" immediate />
    <CPUOp instr="jr nz, .waitVRAM" />
    <CPUOp op="condensed" :cycles="16" class="critical" legend="VRAM accesses" />
</Timeline>

This time, when all the processing was done, there was still plenty of time left in the scanline to safely exit.
However, since HBlank was so long, the routine missed the check for the drawing window and wasted an entire scanline waiting for that Drawing -> HBlank transition before it exited.
Not only does this waste precious CPU time, but it also limits how often raster FX can be used throughout the frame.
This method still works fine though, and can be an easy approach if you use Raster FX sparingly.

I'm a bit of a perfectionist, so I usually like to strive for the absolute best method.
In a perfect world, we would precisely know whether we have enough HBlank left to safely exit.
There actually is a way to do that though! You just need to count exactly how long your routine takes, and make sure it always exits during HBlank.
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

<Timeline :offset="111">
    <CPUOp instr="ldh a, [rSTAT]" immediate io legend="STAT read" />
    <CPUOp op="interrupt" />
    <CPUOp op="condensed" :cycles="105" />
    <CPUOp instr="reti" />
    <CPUOp instr="and STATF_BUSY" immediate />
    <CPUOp instr="jr nz, .waitVRAM" />
    <CPUOp op="condensed" :cycles="16" class="critical" legend="VRAM accesses" />
</Timeline>

Wow! That's a lot of cycles! Here, the routine takes exactly one scanline to complete, so the main thread does its writes at the same moment on the next scanline, with no idea what happened! If you count up all the cyan cycles, you'll see that there are 105 of them, and 109 if you count the `reti`.
This extra time makes it possible to write to two or three registers safely, rather than just one.
If you don't need all that time, you can make it shorter as well:

<Timeline :offset="107" :hblank-length="21">
    <CPUOp instr="ldh a, [rSTAT]" immediate io legend="STAT read" />
    <CPUOp instr="and STATF_BUSY" immediate />
    <CPUOp instr="jr nz, .waitVRAM" />
    <CPUOp op="interrupt" />
    <CPUOp op="condensed" :cycles="84" />
    <CPUOp instr="reti" />
    <CPUOp op="condensed" :cycles="16" class="critical" legend="VRAM accesses" />
</Timeline>

This time, I put the `and` and `jr` before the interrupt, so that when it resumes, it's all ready to start writing to VRAM.
This interrupt routine is 87 cycles long, including the `reti`.
This won't often prove especially useful though, because you never take any time during HBlank to actually do any register writes.
However, you could use this if your routine has a case where it realizes that nothing actually needs to be written, and you can exit earlier.

From those two diagrams, you'll see that the 22 cycles of worst-case HBlank is the time you can use to write to any PPU registers, pop your registers back, and then exit with `reti`.
These 22 cycles are cycle 88 through cycle 109, inclusive.

What if I told you that you could actually have your handler take only 86 cycles? Well, you can!

<Timeline :offset="107" :hblank-length="21">
    <CPUOp instr="ldh a, [rSTAT]" immediate io legend="STAT read" />
    <CPUOp instr="and STATF_BUSY" immediate />
    <CPUOp instr="jr nz, .waitVRAM" />
    <CPUOp op="interrupt" />
    <CPUOp op="condensed" :cycles="83" />
    <CPUOp instr="reti" />
    <CPUOp op="condensed" :cycles="16" class="critical" legend="VRAM accesses" />
</Timeline>

This seems bad, since the first cycle of the red bar, where the main thread may try to access VRAM, is potentially during the Drawing phase! This is also fine though.
All instructions that access memory, whether through an immediate address or using a register pair as a pointer, take multiple cycles to complete.
That's because the first cycle of every instruction is used to fetch the operation code itself.
The memory access that the instruction performs is always in the 2nd, 3rd or 4th cycle of the instruction.
In this situation, the 2nd cycle of the VRAM-accessible time is in HBlank, so this won't actually cause any problems.

## But Wait!

The interrupt latency I showed earlier doesn't actually tell the full story.
Before it even starts to service the interrupt, the system waits for the current instruction to finish.
This is how that might look with the longest allowable routine:

<Timeline :offset="106" :hblank-length="51">
    <CPUOp instr="ldh a, [rSTAT]" immediate io legend="STAT read" />
    <CPUOp instr="and STATF_BUSY" immediate />
    <CPUOp instr="jr nz, .waitVRAM" />
    <CPUOp instr="call SomeFunc" />
    <CPUOp op="interrupt" />
    <CPUOp op="condensed" :cycles="105" />
    <CPUOp instr="reti" />
    <CPUOp op="condensed" :cycles="10" class="critical" legend="VRAM accesses" />
</Timeline>

Here, the first green block shows the system waiting 5 cycles for a `call` instruction to finish. `call` is the longest instruction at 6 cycles, so if the interrupt is requested just after it begins, the system will wait 5 cycles for it to complete.
This seems bad, since the routine exited after the end of HBlank.
However, this is actually fine! Those waiting cycles were not wasted; they were still 5 cycles of work that the main thread got done.
So in the end, the main thread still gets its 20 cycles of VRAM-accessible time.

## Pros and Cons

Thus far, I have presented two very different methods for making safe `LYC` handlers, and each have their pros and cons.

## Double-Busy-Loop

**Pros**
- does not require all code to be constant-time
- does not require tedious cycle-counting
- may exit very early if the routine finishes quickly

**Cons**
- does not provide enough HBlank time to safely write multiple registers
- if the routine takes too long, it may miss mode 3 and waste an entire scanline before exiting

## Cycle-counting

**Pros**
- leaves more time for more complex logic in the routine
- allows enough time during blanking to write to up to three registers
- never takes longer than one scanline

**Cons**
- requires all code to be constant-time
- requires tedious cycle-counting
- always takes close to an entire scanline, even if HBlank starts much sooner

This suggests that the double-busy-loop method is good for extremely simple `LYC` routines that only need to write to one register, or routines that for some reason cannot be cycle-counted.
If you need more time for calculations and more time to write to those registers, you can cycle-count your routine.

But what if you could combine both these methods? Enter the **Hybrid Cycle-Counted Handler™**, a technique I came up with while writing this document.

## Combining Approaches

The goal of this method is to combine the maximum HBlank time that cycle-counting delivers, while still exiting early when HBlank is longer.
Here is an example.
If you've read [DeadCScroll](deadcscroll), you'll recognise this as that tutorial's `STAT` Handler, modified to start at Mode 2 rather than HBlank, and be safe towards VRAM accesses in the main thread.

@[code asm](lyc_timing/hybrid_handler.asm)

Once the handler finishes its logic, the handler delays cycles until it reaches the window then HBlank might start.
With a 5-cycle offset due to a `call`, and the longest possible HBlank, the earliest HBlank might start is cycle 54, so that's the first attempt to read `STAT`.
It keeps checking `STAT` until even in the worst-case scenario, it knows that HBlank will start.
Then, it uses that time to write the scroll registers and exit.
This way, it can still exit early, as long as the HBlank length permits.
This routine takes 104 cycles in the worst-case scenario, but may take as few as 79 if HBlank comes sooner.

The reason that the double-busy-loop method requires checking for Mode 3 but this method does not is that the double-busy-loop method is not cycle-counted, so you might be at the very end of HBlank which is problematic.
Since this method is cycle-counted, you know that if HBlank has begun, you are at or near the start of it.

If we make a similar list of pros and cons for this method, this is what it might look like:

## Hybrid cycle-counting

**Pros**
- may exit very early if HBlank is longer
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

<script>
import { h } from 'vue';

// HACK: we import all of the ASM files here because imports must be static and at top-level
import stat_loop          from '@/../guides/lyc_timing/stat_loop.asm';
import simple_handler     from '@/../guides/lyc_timing/simple_handler.asm';
import ret_hblank_handler from '@/../guides/lyc_timing/ret_hblank_handler.asm';
import hybrid_handler     from '@/../guides/lyc_timing/hybrid_handler.asm';
const instrs = string => string.split(/\r?\n/).map(line => line.split(';')[0].trim());
const ASM_FILES = {
    'lyc_timing/stat_loop.asm':          instrs(stat_loop),
    'lyc_timing/simple_handler.asm':     instrs(simple_handler),
    'lyc_timing/ret_hblank_handler.asm': instrs(ret_hblank_handler),
    'lyc_timing/hybrid_handler.asm':     instrs(hybrid_handler),
};

const SCANLINE_LEN = 114, MIN_HBL_LEN = 21, MAX_HBL_LEN = 51;

const Timeline = {
    props: {
        offset: {
            type: Number,
            required: true,
            validator(value) {
                return value >= 0 && value <= SCANLINE_LEN;
            },
        },
        hblankLength: {
            type: Number,
            default: MIN_HBL_LEN,
            validator(value) {
                return value >= MIN_HBL_LEN && value <= MAX_HBL_LEN;
            },
        },
        asmFile: String,
    },

    render() {
        const MODE_CHANGES = [20, SCANLINE_LEN - this.$props.hblankLength, SCANLINE_LEN];

        const asmFileName = this.$props.asmFile;
        let asmFile;
        if (asmFileName) {
            asmFile = ASM_FILES[asmFileName];
            if (asmFile === undefined) {
                throw new SyntaxError(`Unknown ASM file "${asmFileName}" (did you forget to register it in \`ASM_FILES\`?)`)
            }
        }
        let slots = this.$slots.default(); // The slots we'll be working on (shorthand)

        let opsLegend = {}; // Operations with a legend will be registered in this dict
        let cycles = []; // One entry per row in the table

        let curScanlineCycle = this.$props.offset; // The position inside the current scanline
        let curInstrCycles = 0; // How many cycles are left of the current instruction
        for (let slotIdx = 0; slotIdx < slots.length || curInstrCycles !== 0; ) {
            // Determine this cycle's PPU background color (depending on PPU mode)
            let modeAt = scanlineCycle => {
                if (curScanlineCycle < MODE_CHANGES[0]) {
                    return 2;
                } else if (curScanlineCycle < MODE_CHANGES[1]) {
                    return 3;
                } else {
                    return 0;
                }
            };
            const ppuColorClass = 'ppu-mode' + modeAt(curScanlineCycle);

            let children = [h('td', { class: ppuColorClass }, '' + curScanlineCycle)];

            // Check if a new instruction begins on this cycle
            // If so, push a <td> for this instruction
            if (curInstrCycles == 0) {
                const slotProps = slots[slotIdx].props;
                const instrInfo = (function () {
                    try {
                        return CPUOp.info(slotProps, asmFile);
                    } catch (e) {
                        if (e instanceof SyntaxError && asmFileName && slotProps.line !== undefined) {
                            e.message += ` (at ${asmFileName}:${slotProps.line})`;
                        }
                        throw e;
                    }
                })();
                const instrName = instrInfo.instr;

                let className = 'cpu-' + (instrInfo.class || 'op');
                if (slotProps.io !== undefined) {
                    className += ' cpu-io';
                }

                let props = {
                    rowspan: instrInfo.cycles,
                    class: className,
                    condensed: slotProps.op === 'condensed',
                };
                let contents = props.condensed ? h('b', {}, '(...)') : instrName && h('code', {}, instrName);

                children.push(h('td', props, contents));

                // If this instruction has a legend, register it
                if (instrInfo.legend) {
                    // Anything with a legend is guaranteed to have a class name
                    opsLegend[className] = {
                        order: Object.keys(opsLegend).length,
                        legend: instrInfo.legend,
                    };
                }

                curInstrCycles = instrInfo.cycles; // Register the new instruction's length
                ++slotIdx; // Go to the next instruction
            }

            cycles.push(h('tr', {}, children));

            curScanlineCycle++;
            if (curScanlineCycle == SCANLINE_LEN) curScanlineCycle = 0; // Next scanline, please!
            curInstrCycles--;

            if (children[1] && children[1].props.condensed) {
                // Special handling for the "condensed" pseudo-instruction
                let instr = children[1];

                // Ensure that skips generate no more than 3 rows
                if (instr.props.rowspan > 3) {
                    // Push a row with a cycle count of "..."
                    // The third row will be generated on the next loop iteration

                    let curColor = () => `var(--ppu-mode${modeAt(curScanlineCycle)})`;

                    // That row's background will be a gradient of the different modes that it goes through.
                    // So for that, we need to compute at which points transitions occur
                    const skippedCycles = instr.props.rowspan - 2; // We don't condense the first nor last rows
                    let cyclesRemaining = skippedCycles;
                    let gradColors = []; // Begin with the current mode's color
                    let i = MODE_CHANGES.findIndex(cycle => cycle > curScanlineCycle);
                    // Iterate through all mode changes in the period
                    while (MODE_CHANGES[i] - curScanlineCycle < cyclesRemaining) {
                        // Register the color before the change
                        const oldColor = curColor();

                        cyclesRemaining -= MODE_CHANGES[i] - curScanlineCycle; // Subtract that distance
                        curScanlineCycle = MODE_CHANGES[i] % SCANLINE_LEN; // Go to the mode change point (and wrap around)
                        i = (i + 1) % MODE_CHANGES.length; // Check out the following mode next

                        // Register the color change
                        const percentage = 100 - parseInt(cyclesRemaining * 100 / skippedCycles);
                        gradColors.push(`${oldColor} ${percentage}%, ${curColor()} ${percentage}%`);
                    }
                    curScanlineCycle = (curScanlineCycle + cyclesRemaining) % SCANLINE_LEN;
                    const style = gradColors.length
                        ? { 'background-image': `linear-gradient(${gradColors.join(', ')})` }
                        : { 'background-color': curColor() };

                    cycles.push(h('tr', {}, h('td', { style }, h('b', {}, '...'))));

                    // Refresh the instruction cell's rowspan and "remaining rows to generate" counts
                    instr.props.rowspan = 3;
                    curInstrCycles = 1; // Only 1 row left to generate (the last one)
                }
            }
        }

        const headings = h('tr', {}, [
            h('th', {}, ['Scanline', h('br'), 'cycle']), // Force a line break to narrow the column
            h('th', {}, 'Instruction'),
        ]);
        return h('figure', { class: 'timeline-figure' }, [
            h('div', { class: 'timeline-legend' }, [
                h('h3', {}, 'Legend'),

                h('table', {}, [
                    h('tr', {}, h('th', { colspan: 2 }, 'PPU Mode')),
                    ...[
                        { id: 2, name: 'OAM scan' },
                        { id: 3, name: 'Drawing' },
                        { id: 0, name: 'HBlank' },
                    ].map(mode => h('tr', {}, [
                        h('td', { class: 'ppu-mode' + mode.id }, '' + mode.id),
                        h('td', {}, mode.name),
                    ])),
                ]),

                h('table', {}, [
                    h('tr', {}, h('th', { colspan: 2 }, 'CPU operation')),
                    ...Object.entries(opsLegend)
                             .sort(([_lc, l], [_rc, r]) => l.order - r.order) // Sort the legend by class names
                             .map(([className, {legend}]) => h('tr', {}, [
                        h('td', { class: className }),
                        h('td', {}, legend),
                    ])),
                ]),
            ]),
            h('table', {}, [
                h('thead', {}, headings),
                h('tfoot', {}, headings),
                h('tbody', { class: 'timeline' }, cycles),
            ]),
        ]);
    },
};

const CPUOp = {
    props: {
        // Either of these is required, and the latter requires the Timeline to pass an `asmFile`
        op: String,
        line: {
            type: Number,
            validator(value) {
                return value > 0; // We count from 1
            },
        },

        immediate: Boolean,
        io: Boolean,
        taken: Boolean,
        'class': String,
        legend: String,
        cycles: Number,
    },

    info(props, asmFile) {
        // If requesting a line from an ASM file, force the instruction from it
        if (props.line !== undefined) {
            if (asmFile === undefined) {
                throw new SyntaxError("ASM line requested, but no ASM file was provided!");
            }
            props.instr = asmFile[props.line - 1];
        }
        // If a specific instr has been given but `op` has not, deduce it
        if (props.instr !== undefined && props.op === undefined) {
            props.op = props.instr.split(/\s/)[0];
        }

        let info = (function() {
            // Here is an index of returned properties; be advised that some override others!
            //
            // class:
            //   If truthy, the class that will be applied (prefixed with "cpu-") to "Instruction" cells (and the legend).
            //   Avoid specifying directly, as then you should specify `legend` as well, which overrides this.
            //   Can be overridden from the props, which then supersedes `legend`'s own override.
            //
            // cycles:
            //   How many cycles this operation is long.
            //
            // fixed:
            //   If truthy, the instruction cannot be tagged "immediate".
            //   Note: some operations have an explicit `fixed: false`; this means they aren't really immediate, but can take an extra cycle for another reason (e.g. accessing `[hl]`)
            //
            // jump:
            //   If truthy, the instruction can be tagged "taken", but not "immediate".
            //
            // instr:
            //   If truthy, the string that will be placed raw (no Markdown) in the "Instruction" column in a <code> span.
            //   Can be overridden from the props.
            //
            // legend:
            //   If truthy, the string that will be printed.
            //   Additionally, if truthy (including if overridden by the props), `class` will be set to the operation's name, except if the operation does IO.
            //   Can be overridden from the props.
            //
            // line:
            //   If set, and an ASM file was specified in the `Timeline`, `instr` will be set to the corresponding line.
            //   Line numbers count from 1 for consistency with code blocks.
            //
            // op:
            //   The operation's name, which determines its intrinsic properties.
            //   Can be overridden from the props.
            //   If not specified, will be deduced from the `instr` prop if that was specified or deduced.
            switch (props.op) {
                case 'and':
                    return { cycles:  1, instr: 'and' };
                case 'bit':
                    return { cycles:  2, instr: 'bit', fixed: false };
                case 'call':
                    return { cycles:  6, instr: 'call', class: 'call', fixed: true }; // An untaken "call" takes 3 cycles, not 5
                case 'cp':
                    return { cycles:  1, instr: 'cp' };
                case 'critical':
                    return { cycles: 16, legend: 'VRAM accesses', fixed: true };
                case 'interrupt':
                    return { cycles:  5, legend: 'Interrupt dispatch', fixed: true };
                case 'jr':
                    return { cycles:  2, instr: 'jr', jump: true };
                case 'ld-imm16':
                    return { cycles:  3, instr: 'ld', fixed: true };
                case 'ldh':
                    return { cycles:  2, instr: 'ldh' };
                case 'ldhl':
                    return { cycles:  2 };
                case 'or':
                    return { cycles:  1, instr: 'or' };
                case 'pop':
                    return { cycles:  3, instr: 'pop', fixed: true };
                case 'push':
                    return { cycles:  4, instr: 'push', fixed: true };
                case 'reti':
                    return { cycles:  4, instr: 'reti', legend: 'Return from interrupt', fixed: true };
                case 'set':
                    return { cycles:  2, instr: 'set', fixed: false };

                case 'condensed':
                    let cycles = props.cycles;
                    if (typeof cycles !== 'number' || !isFinite(cycles)) {
                        throw new SyntaxError('"Skip" CPU op requires a numeric cycle count');
                    }
                    return { cycles, class: 'condensed', class: 'op' };

                default:
                    throw new SyntaxError(`Unknown instruction type "${props.op}"`);
            };
        })();

        // If a line was requested, override the instruction with it
        if (props.instr) {
            info.instr = props.instr;
        }

        // Immediate instructions and taken jumps take one extra cycle
        // FIXME: Normally Vue would correctly type these as Booleans as per `props` above, but it doesn't...
        if (props.immediate !== undefined) {
            if (info.fixed || info.jump) {
                throw new SyntaxError(`CPU op ${props.op} cannot be immediate!`)
            }
            info.cycles++;
        }
        if (props.taken !== undefined) {
            if (!info.jump) {
                throw new SyntaxError(`CPU op ${props.op} is not a jump, it cannot be taken!`);
            }
            info.cycles++;
        }

        // Override the legend if explicitly provided
        if (props.legend) {
            info.legend = props.legend;
        }
        // If the operation has a legend, add its name as a class; unless the operation merely does IO
        if (info.legend && props.io === undefined) {
            info.class = props.op;
        }
        // Override the class if explicitly provided
        if (props.class) {
            info.class = props.class;
        }

        return info;
    },
};

import InlineSvg from 'vue-inline-svg';

export default {
    components: {
        Timeline,
        CPUOp,

        InlineSvg,
    },
}
</script>
<style>
.timeline-figure {
    display: flex;
    flex-flow: row-reverse wrap;
    align-items: center;
    justify-content: space-around;

    /* These are also used for the "condensed" rows' gradients */
    --ppu-mode2: #ffd96680;
    --ppu-mode3: #ff800080;
    --ppu-mode0: #97d07780;
}

.timeline tr { background-color: transparent; }
.timeline td { padding-top: 0; padding-bottom: 0; }

.ppu-mode2 { background-color: var(--ppu-mode2); }
.ppu-mode3 { background-color: var(--ppu-mode3); }
.ppu-mode0 { background-color: var(--ppu-mode0); }

.cpu-op         { background-color: #56b4e980; }
.cpu-call       { background-color: #00ff0080; }
.cpu-critical   { background-color: #cc79a780; }
.cpu-interrupt  { background-color: #009e7380; }
.cpu-reti       { background-color: #0072b280; }
.cpu-io               { background-image: linear-gradient(to top, #f0e442, #f0e442); }
.cpu-io[rowspan="2"]  { background-image: linear-gradient(to top, #f0e442 50%, #00000000 50%); }
.cpu-io[rowspan="3"]  { background-image: linear-gradient(to top, #f0e442 33%, #00000000 33%); }
</style>
