---
head:
  - - meta
    - name: og:title
      content: DMA Hijacking on Game Boy
  - - meta
    - name: og:description
      content: A technique that allows you to run custom code in most GB/SGB/CGB games, provided you have an ACE exploit.
---

# DMA Hijacking

Written by [ISSOtm](https://github.com/ISSOtm).

::: tip TARGET AUDIENCE

Unlike most resources here, this guide is not very useful to developers or even ROM hackers, but rather to glitch-hunters and exploit developers.

:::

## What is it?

*OAM DMA hijacking* is a simple technique that allows you to run custom code in most GB/SGB/CGB games, provided you have an ACE exploit.

One would be quick to point out that if you have an ACE exploit, you can already execute custom code.
So then, what is the point?
It's that code ran through DMA Hijacking will be run *on every game frame* (for most games, at least).

## How is it done?

If you are familiar enough with [OAM](https://gbdev.io/pandocs/OAM), you may know about a feature called *OAM DMA*.

[OAM DMA](https://gbdev.io/pandocs/OAM_DMA_Transfer) is a convenient feature that allows quickly updating the on-screen ["objects"](https://gbdev.io/pandocs/Rendering#objects) (often known as "sprites") quickly—which is especially useful since it typically needs to occur on every frame.
However, using OAM DMA requires a small routine to be copied to HRAM and then run from there.

Interestingly, most games only copy the routine when starting up, and then execute it on every subsequent frame.
But, *if we modified that routine while the game is running*, then the game will happily run the customized routine!

### Patching the code

Here is the standard routine, given by Nintendo in the GB programming manual (using [RGBASM syntax](https://rgbds.gbdev.io/docs/rgbasm.5) and a symbol from [`hardware.inc`](https://github.com/gbdev/hardware.inc)):

```asm
    ld a, HIGH(OAMBuffer)
    ldh [rDMA], a  ; $FF46
    ld a, 40
DMALoop:
    dec a
    jr nz, DMALoop
    ret
```

The simplest way to get custom code (let's call it `DMAHook`) executed would be to overwrite the first few bytes with a jump to `DMAHook`:

```asm{1}
    jp DMAHook
    db $46    ; Leftover operand byte of `ldh [rDMA], a`
    ld a, 40  ; None of this is executed
DMALoop:
    dec a
    jr nz, DMALoop
    ret
```

Now, overwriting the routine like this works for our purposes, but comes with a large drawback: the routine isn't doing what it is intended to anymore, and so the game's objects won't update (unless you manually copied OAM, but beware of [the OAM corruption bug](https://gbdev.io/pandocs/OAM_Corruption_Bug)).
Further, it's not possible to write to `rDMA` from `DMAHook`, as the write and subsequent wait loop **must** be executed from HRAM.

But, there is a solution.

```asm{1-2}
    call DMAHook
    ldh [c], a  ; A write to `rDMA`, set up by DMAHook
    ld a, 40
DMALoop:
    dec a
    jr nz, DMALoop
    ret
```

Provided that `DMAHook` returns with properly set registers, this allows writing to `rDMA` in the single HRAM byte left by the `call` instruction.
Here is a pattern for DMAHook :

```asm
DMAHook:
    ;;  Custom code, do whatever you want, it's VBlank time!
    ; ...
    ld c, LOW(rDMA)  ; $46
    ld a, HIGH(OAMBuffer)
    ret
```

`DMAHook` can live anywhere in memory, but typically it will be in WRAM.
It will be executed in the context of the VBlank interrupt, so for most games interrupts will be disabled, etc.

## With Cartswap

DMA Hijacking is also useful when combined with [cartswap](https://gist.github.com/ISSOtm/3008fd73ec66cb56f1caecfcc8b6fb6f) (swapping carts without shutting the console down, concept found by furrtek, developed by Cryo and me on the GCL forums), because it allows "transporting" ACE to other games.

General procedure:

1. Acquire ACE in the "source" game
1. Perform cartswap, insert the "victim" game
1. "Pseudo-initialize" the victim
1. Place the modified DMA handler in HRAM
1. Transfer control back to the victim's ROM
1. ????
1. Profit!

Possible applications are checking for a button combo to trigger specific code (for example, credits warp), checking one or multiple memory addresses to detect a certain game state, etc.

Possible "attack vectors", i.e. ways of affecting the victim game, are setting certain memory addresses (like a GameShark), or even better: manipulating the stack.

Here is a video demonstration:
<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/BNyDmZlbsNI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Manipulating the stack with this technique can not crash if the triggering game state is specific enough.
I achieved text pointer manipulation in Pokémon Red this way.
(This is not a ROM hack!)
<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/yXy5sYZR9mk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### Details

This new technique hinges on breaking one of any game's core assumptions: its entry point.
You see, normally, [the console transfers control to the game at address $0100](https://gbdev.io/pandocs/The_Cartridge_Header#0100-0103---entry-point), so any code placed there is designed to initialize all of the game's systems, in particular their memory.

However, since we have control of the CPU, we can jump to any location in the game's ROM, which allows bypassing some of said initialization.
Doing so without any precautions is very likely to go haywire, though—it is important to initialize *enough* that the game runs, but not *too much* that it would end up overwriting the code we are trying to inject.
This is what I call "**pseudo-initialization**".

Another important part is finding some free space to store the hook code in.
The stack area can work surprisingly well for this, as many games appear to over-allocate (e.g. 256 bytes when the typical usage doesn't go beyond 32).

None of this has a silver bullet: the game's init code must be analyzed, and its memory usage carefully scrutinized in order to dig up enough free space for your hook.

## Trivia

DMA hijacking works similarly to the GameShark: that device intercepts accesses to the ROM, and when it detects that the VBlank handler is being run, it "overlays" different instructions that apply the stored codes, and jump back to the actual handler.

And, why yes, it is possible to use DMA hijacking to emulate GameShark codes!
[Here is a proof-of-concept in Pokémon Red](http://gbdev.gg8.se/forums/viewtopic.php?id=430).

## Notes

- I encountered some games that don't transfer OAM unless a specific flag is set; I believe that it is always possible to override this limitation, by setting the flag back in the hook.
- The OAM DMA routine is often placed at $FF80 in commercial games.
- The patched OAM DMA routine with our hook may be modifying registers that the game expects to be preserved.
  This is all dependent on the target game, so no general advice can be given.

  Additionally, if the hook takes too long, it may cause code expecting to run in VBlank to break.
  This might be solved for example by manipulating the stack and injecting an additional return address; here is an example.
  ```asm
      jp DMAHook
  PostDMAHook:
      ldh [c], a
      ld a, 40
  DMALoop:
      dec a
      jr nz, DMALoop
      jp hl
  ```
  ```asm
      pop hl  ; Get original return address
      ld bc, PostHandlerHook  ; Address of code that will be executed once the VBlank handler finishes
      push bc  ; Inject return address for VBlank handler
      ld c, LOW(rDMA)
      ld a, HIGH(OAMBuffer)
      jp PostDMAHook
  ```
  (Since the handler almost certainly performs some `pop`s before returning, you will almost certainly need more complex stack manipulation, but that's the gist of it.)
- Some games have a slightly more clever routine in HRAM, that omits the initial `ld a, HIGH(OAMBuffer)` saving 2 bytes of HRAM.
  ```asm
      ldh [rDMA], a
      ld a, 40
  DMALoop:
      dec a
      jr nz, DMALoop
      ret
  ```
  They can still be patched by overwriting the `ld a, 40` instead, and using e.g. the `b` register for the loop:
  ```asm{1-2,4}
      call DMAHook
      ldh [c], a  ; Write to rDMA
  DMALoop:
      dec b
      jr nz, DMALoop
      ret
  ```
  Then `DMAHook` needs to return with `b` additionally set to 40:
  ```asm{4-5}
  DMAHook:
      ;;  Custom code, do whatever you want, it's VBlank time!
      ; ...
      ld bc, 40 << 8 | LOW(rDMA)  ; 40 in B, $46 in C
      ld a, HIGH(OAMBuffer)
      ret
  ```
  However, if the OAM buffer address passed to the function (in `a`) is not static, `push af` and `pop af` will have to be used instead of `ld a, HIGH(OAMBuffer)`.
