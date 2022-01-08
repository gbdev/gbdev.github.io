---
head:
  - - meta
    - name: og:title
      content: Dead C Scroll tutorial
  - - meta
    - name: og:description
      content: An assembly tutorial for Game Boy showing how the scroll registers can be exploited to create some nice and interesting effects.
---

# Dead C Scroll

Written by Bob.

---

An assembly tutorial for Game Boy showing how the scroll registers can be exploited to create some nice and interesting effects.

Files related to this tutorial can be found [here](https://github.com/gbdev/gbdev.github.io/tree/dev/list/.vuepress/public/deadcscroll).

## Introducing the registers

### SCY ($FF42)/SCX ($FF43)

The `SCY`/`SCX` registers have a simple purpose: specify the coordinate of the screen's top-left pixel (or view, if you prefer) somewhere on the 256x256 pixel background map. This is really handy for certain kinds of games like platformers or top-down racing games (though there are LOTS of other kinds of games that benefit from this) where the view is the 'camera' and its position is set once per frame.

When you don't require scrolling, and when your cart boots, `SCY`/`SCX` is typically set to 0,0. When a screen is displayed, it appears normally even though you only set the values once. This is because as the screen draws, the PPU automatically adds the value in `LY` ($FF44) to the value in `SCY` in order to know what row of pixels to draw.

```:no-line-numbers
SCY value (set once)
│
│      screen
│     ┌───────┐
└─$00 │Line 0 │  VRAM row $00 ($00+$00) is displayed
      │Line 1 │  VRAM row $01 ($00+$01) is displayed
      │Line 2 │  VRAM row $02 ($00+$02) is displayed
      │Line 3 │  VRAM row $03 ($00+$03) is displayed
      │Line 4 │  VRAM row $04 ($00+$04) is displayed
      │...    │  ...
      │       │
      └───────┘
```
If `SCY` = $20 (for example):
```:no-line-numbers
SCY value (set once)
│
│      screen
│     ┌───────┐
└─$20 │Line 0 │  VRAM row $20 ($20+$00) is displayed
      │Line 1 │  VRAM row $21 ($20+$01) is displayed
      │Line 2 │  VRAM row $22 ($20+$02) is displayed
      │Line 3 │  VRAM row $23 ($20+$03) is displayed
      │Line 4 │  VRAM row $24 ($20+$04) is displayed
      │...    │  ...
      │       │
      └───────┘
```

You can take advantage of how the PPU renders the screen by setting these registers *as the screen draws*. If you do this, you can create some interesting 'raster' effects that are presented here.

As an example, let's say you wanted to triple line 0 and show it for line 0, line 1, and line 2, and then continue with line 3. You would write to the `SCY` register like so:
```:no-line-numbers
SCY value (set once per line)
│
│      screen
│     ┌───────┐
├─$00 │Line 0 │  VRAM row $00 ($00+$00) is displayed
├─$FF │Line 1 │  VRAM row $00 ($FF+$01) is displayed
├─$FE │Line 2 │  VRAM row $00 ($FE+$02) is displayed
├─$00 │Line 3 │  VRAM row $03 ($00+$03) is displayed
├─$00 │Line 4 │  VRAM row $04 ($00+$04) is displayed
├─... │...    │  ...
      │       │
      └───────┘
```

When setting values for `SCY`, you need to remember that `LY` always (and automatically) increments, so you have to account for that in your new `SCY` value. You can write anything to `SCX`; that's not affected by the hardware so you don't have to adjust the value like you need to for `SCY`.

> Note: The scroll registers only affect background rendering. They do not change how objects are displayed.

## Implementation

There are three main states that drive the display on the Game Boy: the Horizontal Blank (HBlank), the Vertical Blank (VBlank), and drawing. The HBlank starts when a line of pixels is completely drawn. There is an opportunity to do some work\* before the next line of pixels starts drawing, and there is one HBlank for every line, all the way down the screen.

> \**The exact amount of time you have depends on several things; most notably how many objects are being drawn on that line. The [PanDocs](https://gbdev.io/pandocs/#pixel-fifo) has a detailed explanation of the timing. (Indeed, read that entire document because it's great!)*

When all of the lines are completely drawn, the VBlank starts. This interval is always 10 lines high so there is much more time to do some work compared to the HBlank. The VBlank is only secondary to this system though; the focus is the HBlank since we want to change the screen as it draws. The problem that needs to be solved is reliably knowing what value to set for a specific line.

As previously mentioned, there is a small amount of time that HBlanks give you to do work. This means that the handler has to be as fast as possible. On a limited system like the Game Boy, that usually equates to judicious use of table lookups and buffers.

There are two key elements to make this system very stable and very fast:
1. A double-buffering system that holds the data that feeds the HBlank handler
2. How the buffers are arranged

### Double Buffering

The idea of the double-buffer is that while one buffer is being used by the hardware to draw the screen, you modify (fill) values in the other. When the screen is done drawing, you switch buffers so the one you were just modifying is being used for drawing and you start modifying the other.

While the Draw Buffer (A) is used to render the screen, you change values in the Fill Buffer (B).
```:no-line-numbers
┌───────┐   ┌───────┐
│Draw   │   │Fill   │
│Buffer │   │Buffer │
│       │   │       │
│       │   │       │
│       │   │       │
│       │   │       │
│A      │   │B      │
└───────┘   └───────┘
```

When the screen is done being drawn (and you know this because the VBlank interrupt would have triggered or the value in `LY` changed to 144), you switch the buffers.
```:no-line-numbers
┌───────┐   ┌───────┐
│Fill   │   │Draw   │
│Buffer │   │Buffer │
│       │   │       │
│       │   │       │
│       │   │       │
│       │   │       │
│A      │   │B      │
└───────┘   └───────┘
```

Here, "switch buffers" means to switch the *purpose* of each buffer. It doesn't mean to copy buffers. Remember, we need this to be as fast as possible so to change buffers, you simply change pointers:
```:no-line-numbers
Draw-->┌───────┐   Fill-->┌───────┐
Ptr    │Buffer │   Ptr    │Buffer │
       │A      │          │B      │
       │       │          │       │
       │       │          │       │
       │       │          │       │
       │       │          │       │
       │       │          │       │
       └───────┘          └───────┘
```
Becomes:
```:no-line-numbers
Fill-->┌───────┐   Draw-->┌───────┐
Ptr    │Buffer │   Ptr    │Buffer │
       │A      │          │B      │
       │       │          │       │
       │       │          │       │
       │       │          │       │
       │       │          │       │
       │       │          │       │
       └───────┘          └───────┘
```

#### Buffer Size

The size of each buffer (indeed, any buffer) depends on two things:
- how many elements are needed
- how much data is needed per element

We know that the buffers exist to support the HBlank handler, so the number of elements in the buffer are however many times the HBlank can trigger. We said earlier that the HBlank starts at the end of every screen line, so the number of elements is at least that many. However, remember *when* the HBlank starts: at the *end* of every line. What do we do if we need to change the 0th line (before *any* line has started drawing)? Well, we need to change that value *before* line 0 starts, which means it has to be done in the VBlank. And **that** means we need one more element. In short, we need the height of the screen plus one (144+1=145) elements in each buffer.

This tutorial is only concerned with the scroll registers, so it only needs to store 2 values per line: one for `SCY` and one for `SCX`. (You can store more data per line, of course, but this tutorial doesn't require it.)

In summary: each buffer is 145 2-byte elements (290 bytes), and we need two of them, so the total buffer memory size is 580 bytes.

#### Location in Memory

Assume for a moment that you put the buffers physically next to each other in memory. For example, Buffer A is at `$C000` and Buffer B is at `$C122` (the buffer size is 290 bytes). We said earlier that in order to swap buffers, we just swap pointers, so the code that does that might look like this:

```asm
; assume the pointers are next to each other in memory
wDrawBuffer: DS 2 ; buffer currently being drawn
wFillBuffer: DS 2 ; buffer currently being modified

; swap the contents of each pointer (28 cycles)
ld  hl,wDrawBuffer
ld  a,[hl+]
ld  b,[hl]
ld  c,a     ; bc = contents of wDrawBuffer
inc hl
ld  a,[hl+] ; a = LOW(contents of wFillBuffer)
ld  d,[hl]  ; d = HIGH(contents of wFillBuffer)
ld  hl,wDrawBuffer
ld  [hl+],a
ld  [hl],d
inc hl
ld  a,c
ld  [hl+],a
ld  [hl],b
```
To use a pointer, that code looks like this:
```asm
; use a pointer (8 cycles)
ld  hl,wFillBuffer
ld  a,[hl+]
ld  h,[hl]
ld  l,a  ; hl = contents of wFillBuffer ($C000 or $C122)
```

You could certainly implement the system like this, but there is a way to gain some efficiency when swapping buffers and even with the actual pointers themselves.

Consider this: other than the memory locations, the buffers are identical. Since we're only really concerned with pointers, *where* the buffers reside in memory doesn't really matter. This can be exploited (and optimized!)

We can keep Buffer A at `$C000`. The buffer size is `$122` bytes, but instead of putting Buffer B at `$C122`, what if we put it at `$C200`? This would make the pointer values `$C000` and `$C200`. Literally a 1-bit difference. This, too, can be exploited! Both pointers end in `$00` so we don't need to store those, which saves 2 bytes. This leaves us with two 1-byte 'pointers': `$C0` and `$C2`.

To swap the pointers, literally just one bit has to be toggled:
```asm
; swap the contents of each 'pointer' (11 cycles)
ldh a,[hFillBuffer]
ldh [hDrawBuffer],a
xor $02
ldh [hFillBuffer],a
```
And to use a pointer, we only need to do this:
```asm
; use a 'pointer' (6 cycles)
ldh a,[hFillBuffer]
ld  h,a
ld  l,0  ; hl = contents of hFillBuffer ($C000 or $C200)
```

You'll notice that the name of the pointers have changed. This is because they were moved into HRAM. (Also notice that they don't have to be next to each other in memory.) They were moved to HRAM for a couple of reasons: it allows an optimization in the swapping code (11 cycles vs 28), and it makes the use code slightly faster. There are only 2 bytes used now so that is a better candidate for moving to HRAM than 4 bytes.

### VBlank

In this system, code in the VBlank is responsible for two things:
- swapping the pointers
- setting the data for line 0

We've already seen what swapping the pointers looks like, but how is the data set for line 0? We need to emulate an HBlank handler running for "line -1" by getting the start of the new draw buffer and setting the scroll registers with the first data pair:

```asm
ldh a,[hDrawBuffer]
ld  h,a
ld  l,0

; set the scroll registers
ld  a,[hl+]
ldh [rSCY],a
ld  a,[hl+]
ldh [rSCX],a
```
It's convenient that the scroll register addresses are next to each other. The data in the buffer is in the same order so as you can see in the code fragment above, this makes writing simple.

### HBlank Handler

In an HBlank handler, **every cycle counts**! So don't do any work in there unless it's absolutely necessary. This is a good target for hyper-optimizations -- especially if you are changing VRAM (like palettes) -- so one should design around that optimization.

```asm
HBlankHandler::
  push  af
  push  hl

  ; obtain the pointer to the data pair
  ldh a,[rLY]
  inc a
  add a,a ; double the offset since each line uses 2 bytes
  ld  l,a
  ldh a,[hDrawBuffer]
  adc 0
  ld  h,a  ; hl now points to somewhere in the draw buffer

  ; set the scroll registers
  ld  a,[hl+]
  ldh [rSCY],a
  ld  a,[hl+]
  ldh [rSCX],a

  pop hl
  pop af
  reti
```

Notice that we can take advantage of the fact that there is only 2 bytes per line. We can use `LY` directly and quickly turn it into pointer. (Thanks to rondnelson99 for pointing this out!)

### Use the fill buffer

And there you have it. An automatic and stable way to take advantage of the HBlank to do whatever your imagination wants to do!

All you need to do is set the fill buffer while the draw buffer is being displayed (you have an entire frame's worth of time to do this) and the system does the rest!

## Effects

### X (Horizontal) Sine

This effect uses a sine table to shift each line in a pleasant way. There are 3 states to this effect:
- The image is stable and a progression line moves up the screen starting each line on its way
- The table cycles a few times
- The image stability is restored with the progression line moving up the screen

The values in the table can dramatically change the effect. For example, if the sine cycle was short enough, you could simulate a smoke effect (for example). Try it out!

Also, you could create a 'glitch' effect during a cut-scene, perhaps in a sci-fi game to simulate a slightly dirty transmission.

![X Sine](/deadcscroll/gif//xsine.gif)

### Y (Vertical) Sine

This effect is structured very similar to X Sine, in that there is a table of sine values driven by 3 states. The only difference is that `SCY` is changed instead of `SCX`.

This is a really good way to simulate water reflections.

![Y Sine](/deadcscroll/gif//ysine.gif)

### X and Y Sine

This is simply a combination of the X Sine and Y Sine effects so you can see how different it looks compared to just the X or Y changing.

Instead of a full-screen image like this tutorial uses, imagine if you had a repeating image in VRAM (bigger than the screen) that looked like water ripples. This would move just like water!

![XY Sine](/deadcscroll/gif//xysine.gif)

### Smear On

This is like a flood fill effect used as an appearance transition. It's quite simple in that it repeats the lines to achieve the 'smear' effect and is perhaps more interesting than a fade in.

The specific image used in the tutorial is light along the bottom so it looks better if the screen was already light before the effect starts. You would change this to suit your image.

![Smear On](/deadcscroll/gif//smearon.gif)

### Smear Off

This is a disappearance transition and the reverse of Smear On. Due to the specific image that was used (i.e. it is light along the bottom), it looks better in this tutorial to have the effect reveal a light screen instead of dark. Again, you would change this to suit your image.

![Smear Off](/deadcscroll/gif//smearoff.gif)

### Roll On

This effect simulates an image unrolling onto the screen. This might be useful for fantasy RPGs to transition to a map screen or perhaps a message written on a scroll. The image unrolls over a dark screen because the top of the image is mostly dark so it looks better to keep it dark than the contrast of using a light screen.

![Roll On](/deadcscroll/gif//rollon.gif)

### Roll Off

This effect simulates an image rolling off screen. This might be useful for fantasy RPGs to transition away from a map or scroll screen. This reveals a dark screen because the first thing you see in the roll is dark (because that's what's in VRAM below the screen). Keeping it dark made the transition more seamless.

![Roll Off](/deadcscroll/gif//rolloff.gif)

The roll effects look complicated but the implementation is probably one of the simpler ones. The key to make this look good is the values in the table. The roll size is 32 pixels, but you can change this to whatever size you want, provided the table values support it. This [SpecBas demo](https://www.youtube.com/watch?v=j04TKI9WKfo) was used as a reference to obtain those values.

## How to build

A GNU makefile is included. You will have to tailor it for your development environment but it builds cleanly with [RGBDS](https://github.com/gbdev/rgbds) 0.4.2. The only dependency is [`hardware.inc`](https://github.com/gbdev/hardware.inc). All of the effects are shown [here](https://github.com/BlitterObjectBob/ScrollexY#effects) so you don't have to build first to see them.

## Notes about the code

To reduce dependencies, everything is in one .asm file. It's structured in a logical way and there are comments where applicable.

The effects are called "parts" by the code and each part has an `Init` and `Process` routine. The sequence is controlled by a table of `Init` pointers and driven by the `ProcessPartTransition` routine. Each `Init` is responsible for setting up the data for the effect (part) and to set the `Process` function pointer via the `SetProcessFunc` macro. When the effect is done, the `Process` routine calls the `SetChangePartFlag` to tell the tutorial driver to move to the next part.

There are non-effect parts present to get the effect sequence looking good when the parts are played one after the other. These are "delay" parts of various flavors:
- `ShowDelay`: this shows the screen normally for a few seconds
- `LightDelay`: this shows a light-colored blank screen for a few seconds
- `DarkDelay`: this shows a dark-colored blank screen for a few seconds

The `Delay` parts share code because they're only present to make the ROM look nice, but the effects parts were developed in a way to be isolated from one another. This was done to make extraction easier. Because of this, you will see similar code present across several parts, for example, the various Sine effects.

One quirk you might notice when looking at VRAM is that the tile map is placed at 0,4 instead of 0,0. This was done to get the roll/unroll to handle the top of the screen correctly. The effects look best when they smoothly (dis)appear off-screen and if the image was placed at 0,0, the code to handle that would be distracting to how to implement the core of the effect.

Another topic worth mentioning is the row of light tiles that are under the image in VRAM. This was necessary to allow `LightDelay` to exist. Those light tiles don't *have* to be right under the image, that's just where it was placed for this tutorial. It could be moved well out of the way so it doesn't affect the effects that show that part of VRAM (Y Sine, Roll On, Roll Off).

If you run the ROM in [BGB](https://bgb.bircd.org/) and have the Debug Messages window open, you will see the various parts announce themselves when they are initialized.

## Exercises for the reader

You can do more things than just change the scroll registers. For example, you can change the palette. Can you do this to make the roll/unroll effect look better? Here's an [example of scroll register and palette changes](https://www.youtube.com/watch?v=_-GTCao5cxs).

This [appearance effect](https://www.youtube.com/watch?v=leTk0uRnE_g&t=91s) from Sword of Sodan (Amiga) is really cool! (And you might recognize one of the opening effects if you scrub to the beginning.)

Another raster effect you could do is a 'twist' like the one in the [Wired demo](https://www.youtube.com/watch?v=WlMl8XKCb1Y&t=63s).

You can use this system to make a racing game similar to [F-1 World Grand Prix II](https://www.youtube.com/watch?v=yvbQD2pbJes) or [Wacky Races](https://www.youtube.com/watch?v=1kXiU_odMMM&t=110s). How might you achieve this?

## PRs are welcome!

Other effects can be done, such as flipping the entire image about the X axis to look like its tumbling. What other effects can you create?

## Acknowledgements

Thanks go to Baŝto for use of the [Dead Boy](https://opengameart.org/content/dead-boy) image and [ISSOtm](https://github.com/ISSOtm) for peer review!

## License

This was released for educational purposes and so is placed in the Public Domain. See [LICENSE](./LICENSE) for more details.
