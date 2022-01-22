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

![Example of raster effect](/deadcscroll/gif/xysine.gif)

However, unlike some consoles like the SNES, raster effects on the Game Boy have to be performed by the CPU.
The easiest way to implement raster effects is with the `LYC` register at $FF45.
Here's how the Pan Docs explain this register's simple function:

> [**FF45 - LYC (LY Compare) (R/W)**](https://gbdev.io/pandocs/Scrolling.html#ff45---lyc-ly-compare-rw)
>
> The Game Boy permanently compares the value of the LYC and LY registers.
> When both values are identical, the “LYC=LY” flag in the STAT register is set, and (if enabled) a STAT interrupt is requested.

So, the basic setup for raster FX is as follows:

1. Request an interrupt by setting `LYC` to the appropriate scanline
2. The system will start your interrupt routine when that scanline begins
3. Perform your chosen effect by modifying PPU registers
4. Exit with `reti`

This seems simple enough, but unfortunately, this process comes with significant caveats.
So, here are some things to keep in mind:

All but the most complex of raster effects are registers that you change between scanlines.
For that reason, you want to perform your register write while the screen is not being drawn, so during HBlank or OAM search.
You may know that `LYC` interrupts are requested at the start of a scanline, which happens to be Mode 2 (OAM search).
However, because of Mode 2's short duration combined with unreliability of interrupt timing, you will not reliably have enough time to perform your write.
Therefore, you have to wait for the next HBlank to perform your register write.
You also need to compensate for this by requesting an interrupt on the line before the one on which you wish to perform your effect.
For instance, if I want to enable sprites at line 16 when my upper status bar finishes drawing, I would write 15 to `LYC`.

Like I mentioned above, the time at which your handler will begin execution will be delayed by an inconsistent amount, which makes it difficult to determine when the beginning of HBlank will come.
You'll see why this is and how this can be avoided later.

The final problem is perhaps the biggest one.
It's common practice in Gameboy Development to use a `STAT` check to write to VRAM between scanlines.
The typical way of doing this is to read `STAT`, and then reap up to 16 cycles of guaranteed VRAM access time.
This method is great for copying small bits of data quickly, and uses little CPU time.
However, if an `LYC` interrupt fires during one of those VRAM accesses, you can potentially take some of its VRAM-safe time and cause VRAM writes from the main thread to fail.
However, this can be avoided with some careful planning.

## Timing, With Diagrams and Stuff

First, let's look at the timing of the rendering itself, [courtesy of the Pan Docs](https://gbdev.io/pandocs/pixel_fifo):

<inline-svg src="/images/ppu_modes_timing.svg" viewBox="0 0 700 307" style="--fg: var(--c-text);" />

Note that:
- Each full scanline takes exactly 456 dots (114 cycles)
- Mode 2 also takes a constant amount of time (20 cycles)
- HBlank length varies wildly, and will often be nearly as long as or longer than the drawing phase
- HBlank and OAM scan are mostly interchangeable, and long as you're not doing OAM pokes during HBlank
- The worst-case HBlank takes a number of dots that is not divisible by 4. However, as far as I'm aware, this still behaves like 88 dots in practice.

Now, I will have a bunch of diagrams showing the timing of various situations.
Each row represents exactly one scanline, and the columns show the individual cycles.
Consider zooming in to better see these cycles.
First, let's consider a simple `LYC` routine.
It will disable sprites if called for line 128, but otherwise, it will enable them.

@[code asm](lyc_timing/simple_handler.asm)

Note that this may not be an especially well-written `LYC` routine, but the actual logic of the routine itself is outside the scope of this tutorial.
If that's what you're looking for, check out [DeadCScroll](deadcscroll) by Blitter Object.
It uses the HBlank interrupt rather than the `LYC` interrupt, but it should still teach you some fundamentals.
However, that tutorial does not attempt to solve the problems described below, so be wary of combining that tutorial's STAT routine with STAT-based VRAM accesses in the main thread.

Here's how the timing of all this might look:

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

The 5 yellow cycles mark the time it takes for the system to prepare the interrupt.
During this time, it has to push the program counter to the stack, disable interrupts, etc.
Then, the actual interrupt routine can start.

Right now, there are a few problems here.
The first is that the actual register write that the routine performs happens during the drawing phase.
This is most likely undesirable, and could lead to graphical glitches like a partial sprite being displayed before it is cut off when sprites are disabled.

The other problem is what might be happening during the main thread:

<Timeline :offset="111">
    <CPUOp instr="ldh a, [rSTAT]" immediate io legend="Read from STAT" />
    <CPUOp instr="and STATF_BUSY" immediate />
    <CPUOp instr="jr nz, .waitVRAM" />
    <CPUOp op="critical" />
</Timeline>

This is the worst-case scenario for a `STAT`-based VRAM access.
Here, the main thread reads `STAT` on the very last cycle of HBlank.
After the brief processing of the value it read, the main loop may use the 16 guaranteed cycles of OAM scan to access VRAM.
This just barely works out.
But what happens if an interrupt is requested on that next cycle?

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

Oh no! The main thread is trying to access VRAM right in the middle of the drawing phase! This could lead to all sorts of glitches.

The solution is not too complicated, at least on paper.
We just need to do all our register writes, and exit, during HBlank.
This seems easy enough, since if you've made it this far, you already know how to utilize the blanking periods to access VRAM.
So what happens if you use that method?

<Timeline :offset="111" asmFile="lyc_timing/simple_handler.asm">
    <CPUOp instr="ldh a, [rSTAT]" immediate io legend="Read from STAT" />
    <CPUOp op="interrupt" />
    <CPUOp op="condensed" :cycles="98" />
    <CPUOp instr="bit STATB_BUSY, [hl]" immediate />
    <CPUOp instr="jr nz, .waitVRAM" />
    <CPUOp :line="10" immediate />
    <CPUOp :line="11" />
    <CPUOp :line="12" />
    <CPUOp instr="and STATF_BUSY" immediate />
    <CPUOp instr="jr nz, .waitVRAM" />
    <CPUOp op="critical" />
</Timeline>

Here, the long blue strip represents the time spent within the interrupt routine.
Remember that many `STAT` routines will be much more complicated than the simple example above.

Once again, the VRAM access time overlaps with the Drawing phase.
The problem here is that the register write, `pop` and `reti` all take some of those guaranteed cycles when it is possible to access VRAM.
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
import simple_handler     from '@/../guides/lyc_timing/simple_handler.asm';
import ret_hblank_handler from '@/../guides/lyc_timing/ret_hblank_handler.asm';
import hybrid_handler     from '@/../guides/lyc_timing/hybrid_handler.asm';
const instrs = string => string.split(/\r?\n/).map(line => line.substring(line.indexOf(';')).trim());
const ASM_FILES = {
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

        let asmFile = this.$props.asmFile && ASM_FILES[this.$props.asmFile];
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
                const instrInfo = CPUOp.info(slotProps, asmFile);
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
                    opsLegend[className] = instrInfo.legend;
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
                             .sort(([l], [r]) => l < r) // Sort the legend by class names
                             .map(([className, legend]) => h('tr', {}, [
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
