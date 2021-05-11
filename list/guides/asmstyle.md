# Game Boy ASM style guide

Version `1.0`.

This style guide aims to formalize a style that most Game Boy ASM programmers agree on, and provide a good baseline for new programmers just starting in this field. (If that's you, welcome! :D)

To quote the [Linux kernel style guide](https://github.com/torvalds/linux/blob/master/Documentation/process/coding-style.rst):

> Coding style is very personal, and I won't **force** my views on anybody, but this is what goes for anything that I have to be able to maintain, and I'd prefer it for most other things too. Please at least consider the points made here.

Many people follow alternate style guides, and that's fine; but if you're starting to code in ASM, a clean style goes a long way to keep your code organized. Again: you don't have to do everything listed here, but please at least consider the reasons behind each bullet point.

Oh, by the way, you're free to [contribute to this document](https://github.com/gbdev/gbdev.github.io) and/or [chat with us about it](https://gbdev.io/chat)!

## Naming

[RGBASM accepts a lot of symbol names](https://rgbds.gbdev.io/docs/v0.4.2/rgbasm.5#SYMBOLS):

> Symbol names can contain letters, numbers, underscores ‘_’, hashes ‘#’ and at signs ‘@’. However, they must begin with either a letter, or an underscore. 

However, naming conventions make code easier to read, since they help convey the different semantics between each symbol's name.

- Labels use PascalCase: `DrawNPCs`, `GetOffsetFromCamera`.
- Labels in RAM (VRAM, SRAM, WRAM, HRAM; you shouldn't be using Echo RAM or OAM) use the same convention but are prefixed with the initial of the RAM they're in, in lowercase: `wCameraOffsetBuffer`, `hVBlankFlag`, `vTilesetTiles`, `sSaveFileChecksum`. *Rationale: to know in which memory type the label is; this is important because VRAM and SRAM have special access precautions and HRAM can (should (must)) be accessed using the `ldh` instruction.*
- Local labels use camelCase, regardless of memory type: `.waitVRAM`, `wPlayer.xCoord`.
- Macro names use snake_case: `wait_vram`, `end_struct`.
- Constants use CAPS_SNAKE: `NB_NPCS`, `OVERWORLD_STATE_LOAD_MAP`.

  Exception: constants that are used like labels should follow the label naming conventions. For example, see [hardware.inc](https://github.com/gbdev/hardware.inc/blob/master/hardware.inc)'s `rXXX` constants.

## Best practices

- Avoid hardcoding things. This means:
  * No magic numbers. `ld a, CURSOR_SPEED` is much more obvious than `ld a, 5`. In addition, if you ever change your mind and decide to change the cursor speed, you will only need to do so in one location (`CURSOR_SPEED equ 5` → `CURSOR_SPEED equ 4`) instead of at every location you're using it, potentially missing some.
  * Unless **absolutely necessary**, don't [force a `SECTION`'s bank](https://rgbds.gbdev.io/docs/v0.4.2/rgbasm.5#BANK) or address. This puts the burden of managing ROM space on you, instead of offloading the job to RGBLINK, which performs very well in typical cases. Exceptions:
    - Your ROM's entry point [must be at $0100](https://gbdev.io/pandocs/#_0100-0103-entry-point), however the jump does not have to be to $0150 ([example](https://github.com/GreenAndEievui/vuibui-engine/blob/206fd814e67da2cebbeca7d011a5537fef22a29c/src/main.asm#L6)).
    - [`rst` vectors and interrupt handlers](https://gbdev.io/pandocs/#jump-vectors-in-first-rom-bank) obviously need to be at the corresponding locations.
    - [RGBDS presently does not allow forcing different sections to be in the same bank](https://github.com/gbdev/rgbds/issues/244). If you need to do so, the ideal fix is to merge the two sections together (either by moving the code, or using [`SECTION FRAGMENT`](https://rgbds.gbdev.io/docs/v0.4.2/rgbasm.5#Section_Fragments)), but if that option is unavailable, the only alternative is to explicitly declare them with the same `BANK[]` attribute. (In which case it's advisable to add an `assert BANK("Section A") == BANK("Section B")` line.)

    If you need some alignment, prefer [`ALIGN[]`](https://rgbds.gbdev.io/docs/v0.4.2/rgbasm.5#ALIGN) to forcing the address. A typical example is [OAM DMA](https://gbdev.io/pandocs/#lcd-oam-dma-transfers); for that, prefer `SECTION "Shadow OAM", WRAM0,ALIGN[8]` over e.g. `SECTION "Shadow OAM", WRAM0[$C000]`.

- Allocate space for your variables using [labels](https://rgbds.gbdev.io/docs/v0.4.2/rgbasm.5#SYMBOLS) + [`ds` & co](https://rgbds.gbdev.io/docs/v0.4.2/rgbasm.5#Declaring_variables_in_a_RAM_section) instead of [`equ`](https://rgbds.gbdev.io/docs/v0.4.2/rgbasm.5#EQU). This has several benefits:
  * Removing, adding, or changing the size of a variable that isn't the last one doesn't require updating every variable after it.
  * The size of each variable is obvious (`ds 4`) instead of having to be calculated from the addresses.
  * `equ` allocation is equivalent to hardcoding section addresses (see above), whereas labels are placed automatically by RGBLINK.
  * Labels support [`BANK()`](https://rgbds.gbdev.io/docs/v0.4.2/rgbasm.5#Other_functions) and many cool other features!
  * Labels are output in [`map` and `sym`](https://rgbds.gbdev.io/docs/v0.4.2/rgblink.1#m) files.

- If a file gets too big, you should split it. Files too large are harder to read and navigate. However, the splitting should stay coherent and consistent; having to jump around files constantly is equally as hard to read and navigate.

- [Unless you're making a 32k ROM](https://gbdev.io/pandocs/#no-mbc), put things in [`ROMX`](https://rgbds.gbdev.io/docs/v0.4.2/rgbasm.5#ROMX) by default. `ROM0` space is precious, and can deplete quickly; and when you run out, it's difficult to move things to ROMX.

  However, if you have code in ROM bank A refer to code or data in ROM bank B, then either should probably be moved to ROM0, or both be placed in the same bank (options for that are mentioned further above). [`farcall`](https://github.com/pret/pokecrystal/blob/35219230960f0dc85c0cb6a5723877b247609e46/macros/rst.asm#L1-L5) is a good way to make your code really [spaghetti](https://en.wikipedia.org/wiki/Spaghetti_code).
  
- Don't clear RAM at init! Good debugging emulators will warn you when you're reading uninitialized RAM ([BGB](https://bgb.bircd.org) has one in the option's Exceptions tab, for example), which will let you know that you forgot to initialize a variable. Clearing RAM does not fix most of these bugs, but silences the helpful warnings.

  Also, a lot of the time, variables need to get initialized to values other than 0, so clearing RAM is actually counter-productive in these cases.

## Recommendations

The difference between these and the "best practices" above is that these are more subjective, but they're still worth talking about here.

- Historically, RGBDS has required label definitions to begin at "column 1" (i.e. no whitespace before them on their line). However, later versions (with full support added in 0.5.0) allow [indenting labels](https://github.com/pinobatch/libbet/blob/cabe48bc4042338b9975cb32c2dbd0ee6640f31e/src/main.z80#L206-L231), for example to make loops stand out like in higher-level languages. However, [a lot of people don't do this](https://github.com/BlitterObjectBob/DeadCScroll/blob/9834372eb0d56e8b9a8cdcaae4b8aecb6d402266/DeadCScroll.asm#L410-L422), so it's up to you.

- Please use the `.asm` (or `.s`) file extensions, not `.z80`. The GB CPU isn't a Z80, so syntax highlighters get it *mostly* right, but not quite. And it helps spreading the false idea that the GB CPU is a Z80. :,(

- Compressing data is useful for several reasons; however, it's not necessary in a lot of cases nowadays, so you may want to only look at it after more high-priority aspects.

- Avoid abusing macros. Macros tend to make code opaque and hard to read for people trying to help you, in addition to having side effects and sometimes leading to very inefficient code.

- Never let the hardware draw a corrupted frame even if it's just one frame. If it's noticeable by squinting a bit, it must go.

- [Makefiles are bae](https://www.gnu.org/software/make/manual/html_node/); they speed up build time by not re-processing what hasn't changed, and they can automate a lot of tedium. Writing a good Makefile can be quite daunting, but [gb-boilerplate](https://github.com/ISSOtm/gb-boilerplate) and [gb-starter-kit](https://github.com/ISSOtm/gb-starter-kit) can help you get started faster.
