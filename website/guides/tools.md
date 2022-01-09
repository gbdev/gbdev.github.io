---
head:
  - - meta
    - name: og:title
      content: Choosing tools for Game Boy development
  - - meta
    - name: og:description
      content: Overview of the available tools for Game Boy development.
---


# Choosing tools for Game Boy development


This essay gives an overview of the Game Boy's capabilities, discussing the pros and cons of the available development tools, and providing a few tips to write more efficient code.

Written by [ISSOtm](https://github.com/ISSOtm/) with help from [tobiasvl](https://github.com/tobiasvl), some updates by [bbbbbr](https://github.com/bbbbbr).

---


In the past few years as retro gaming has grown in popularity, programming for older platforms has also gained traction. A popular platform is the Game Boy, both for its nostalgia and (relative) ease to program for.

::: warning
This document only applies to the Game Boy and Game Boy Color. Game Boy Advance programming has little in common with Game Boy programming.

If you want to program for the GBA, which is much more C-friendly (and C++ and Rust, for that matter) than the GB and GBC, then I advise you to download devkitARM and follow the [Tonc](https://www.coranac.com/tonc/text/) tutorial. Please note that the Game Boy Advance also functions as a Game Boy Color, so if you only have a GBA, you can use it for both GB and GBC development.
:::

When someone wants to make their own game, one of the first problems they will encounter is picking the *tools* they will use. There current main options are:
- RGBDS (Rednex Game Boy Development System) and the Game Boy's Assembly language (ASM)
- GBDK-2020 (Game Boy Development Kit) and the C language
- ZGB (an engine built on GBDK-2020) and the C language
- GB Studio (a drag-and-drop game creator with scripting)

The purpose of this document is to provide some insights and help you make the better choice if you're starting a new project. I will also provide some "good practice" tips, both for C and ASM, if you have already made up your mind or are already using one of these.



# Overview

The original Game Boy, codenamed the DMG, has a 1 MHz CPU \[the CPU is actually clocked at 4 MHz, but every instruction takes up a multiple of 4 clocks, so it's often simplified to a 1 MHz CPU\]. Given that an instruction takes approximately 2 to 3 cycles, this gives the CPU a capacity of 333,000~500,000 instructions per second.
Its LCD boasts 60 fps \[it's actually 59.73 fps\], which rounds up to between 50,000 and 80,000 instructions per frame. Suddenly not so much, eh?
It also has 8 kB of RAM, and 8 kB of video RAM ; a 160x144 px LCD (thus slightly wider than it's tall), 4 colors, and 4-channel audio.

The Super Game Boy adds a few minor things, such as a customizable screen border, and some crude color. It's also slightly faster than the DMG.

The Game Boy Color *can* \[if you tell it to\] unlock additional functionality, such as more fleshed-out color, a double-speed CPU, twice the video RAM and *four times* the RAM! (With caveats, obviously.)


# Languages

The choice of programming language is important and can have a very large effect on a project. It determines how much work is involved, what will be possible, and how fast it will be able to run.

### Assembly (ASM)
Most games and programs for the Game Boy written in ASM will use RGBDS or WLA-DX.

Strengths:
* Not too difficult to learn.
* Extremely powerful and flexible.
* When well written it allows for maximum speed and efficiency on the limited resources of the Game Boy hardware.

Weaknesses:
* It takes a special kind of work to write optimized ASM code.
* It's quite verbose and sometimes tedious.
* Will require more time and learning to get up and running when compared with C.
* Code may not be easily shared with ports of a game on other platforms.


### C
C will typically be used with the SDCC compiler and GBDK-2020 or ZGB, though it can also be used on it’s own without a framework or with a different compiler/dev kit (such as [z88dk](https://github.com/z88dk/)).

Strengths:
* Allows for getting up and running faster than with ASM, especially when building on top of GBDK-2020 and ZGB.
* The language abstractions make it relatively easy to implement ideas and algorithms.
* C source debugging is available through Emulicious with the VSCode debug adapter, making it easier to understand problems if they arise.
* ASM can be included in projects with C, either standalone or inline for speed critical features.

Weaknesses:
* The SDCC C compiler won't always generate code that runs as fast as skilled, hand-optimized assembly. It has matured a lot in the 20 years since the original GBDK, but bugs still turns up on occasion. On a platform with a slow CPU such as the Game Boy this can be a factor.
* It’s easier to write inefficient code in C without realizing it. The Game Boy's CPU is only capable of performing 8-bit addition or subtraction, or 16-bit addition. Using `INT32`s is quite taxing on the CPU (it needs to do two consecutive 16-bit adds, and add the carry). See the tips below to avoid such blunders.
* There is overhead due to C being a stack-oriented language, whereas the Game Boy's CPU is rather built for a register-oriented strategy. This most notably makes passing function arguments a lot slower, although SDCC has some optimizations for this.


### Non-Programming Language option
Using a GUI instead- If you don’t want to learn a programming language in order to make Game Boy games, then GB Studio is an option. See the [GB Studio](#gb-studio) section for more details.


# Development Platforms

### [RGBDS](http://github.com/rednex/rgbds) with ASM

RGBDS is an actively maintained suite of programs that allow building a ROM using ASM (assembly). It contains three programs that perform different stages of the compilation, as well as a program that converts PNG images to the Game Boy's tile format. RGBDS is available for Linux, Windows and MacOS.

Strengths:
* Very knowledgeable community with a lot of history.
* Built in support for ROM banking.
* Works quite well with BGB for debugging.

Weaknesses:
* Provides a limited amount of built-in code and functionality (does not include a large API like GBDK-2020 does).

### [WLA-DX](https://github.com/vhelin/wla-dx) with ASM
WLA-DX is also sometimes used when writing in ASM, mostly due to its better struct support than RGBDS.


### [GBDK-2020](https://github.com/Zal0/gbdk-2020) with C
GBDK-2020 is a development kit and toolchain built around the SDCC C compiler which allows you to write programs in C and build ROMs. It includes an API for interfacing with the Game Boy. GBDK-2020 is a modernized version of the original [GBDK](http://gbdk.sourceforge.net). It's available for Linux, Windows and MacOS.

Strengths:
* Flexible and extensible.
* Comprehensive API that covers most hardware features.
* Many sample projects and open source games are available that demonstrate how to use the API, hardware, and structure games.
* C source debugging is available with Emulicious.

Weaknesses:
* Takes care of some aspects of the hardware without requiring the developer to initiate them (such as OAM DMA during VBLANK), so it's not always obvious to beginners what the hardware is doing behind the scenes, or how to fix them when something goes wrong.
* ROM banking may require more management in code than RGBDS.


### [ZGB](https://github.com/Zal0/ZGB/) with C & GBDK-2020
ZGB is a small engine for the Game Boy built on top of GBDK-2020 and written in C.
Strengths:
* The basic graphics, sound and event structure are all pre-written, so it’s faster and easier to start writing a game.
* Several open source games built with it are available as examples.

Weaknesses:
* The engine just has the basics and custom code may need to be needed for common game features (such as moving platforms, etc.).
* Even more of the hardware configuration and processing is taken care of behind the scenes than with GBDK, so less experienced users may have trouble when problems arise.


### [GB Studio](https://www.gbstudio.dev/)

GB Studio is a drag-and-drop game creator for the Game Boy that does not require knowledge of programming languages. Games are built using a graphical interface to script graphics, sound and actions. It is available for Linux, Windows and MacOS.

Strengths:
* Very easy for beginners to start building games right away. Everything is built-in and requires minimal knowledge and understanding of the Game Boy hardware.
* Has been used to create large and extensive projects.
* Very active community for help and support.

Weaknesses:
* It’s games will tend to be slower than both ASM and C.
* There is a limited set of commands to script with and some artificially smaller restrictions on palettes, sprites, background tiles and other hardware features (due to how GB Studio manages them).
* Games may be more constrained or require workarounds to do things if they don’t easily fit within the available scripting, graphics and sound tools. (Though it is possible for advanced users to do a “engine eject” and add more functionality using C and ASM.)



# Emulators and debuging tools
Accurate emulators and debugging tools are tremendously helpful for testing and tracking down problems. The following Game Boy emulators provide excellent accuracy and include a variety of different features.

* [BGB](http://bgb.bircd.org) has a convenient (ASM) debugger, though its minimal interface can be confusing at first. It is available for Windows only, but runs almost flawlessly with Wine.

* [Emulicious](https://emulicious.net/) includes powerful tools such as a profiler and source-level debugging for ASM and C via a [VS Code debug adapter](https://marketplace.visualstudio.com/items?itemName=emulicious.emulicious-debugger). It runs on Linux, Windows, MacOS and any other operating systems that supports Java SE.

* [Same Boy](https://sameboy.github.io/features/) is user friendly and has a wide range of powerful (ASM) debugging features. It runs on Windows and MacOS.

* [Gambatte](http://github.com/sinamas/gambatte) lacks a debugger and must be compiled from source, but is packaged both in [RetroArch](http://retroarch.com) (Linux, Windows and Mac) and [BizHawk](http://tasvideos.org/BizHawk.html) (Windows-only).


* Purists prefer to also run their games on hardware, which is possible thanks to flashcarts. My personal recommendation is [krikzz's carts](http://krikzz.com/store/), particularly the [Everdrive GB X5](https://krikzz.com/store/home/47-everdrive-gb.html).

Side note : if you are using VBA or VBA-rr, **stop using them right now**. These emulators are extremely inaccurate, and also contain **severe security flaws**. I strongly urge you to ditch these emulators and spread the word.




# Summary

If your question is "*What should I use for my game project ?*", then you're in the right section. The first question you should ask yourself is what languages you know.

### If you don't know ASM, C or C++
Consider starting with C and GBDK. This will introduce you to working with the hardware and is an easier starting place.

Once you've grasped C's concepts (most importantly pointers), give ASM a go. The language is simpler than it looks. Even if you don't manage to get working ASM code, it actually helps a lot (especially on such a constrained system) to know what's "under the hood". There is even an [online IDE](https://daid.github.io/rgbds-live/) to experiment with.

For C / GBDK users, knowing ASM will help you understand what it's API (which is mostly written in ASM) is doing behind the scenes and will make using emulator debuggers easier to understand.

If you don't wan't to learn a language at all, [GB Studio](#gb-studio) is an alternative to C and ASM.

### If you know C but not ASM
Consider the goals, scope and time frame of your project. If you'd like to start building right away then C and GBDK will make that easy. You'll also have growing exposure to ASM as time goes on due to working with the hardware and tracking down problems in the debugger.

On the other hand, if you'd like to expand your programming skill set and have additional time, learning to use ASM and RGBDS will provide you with a lot of knowledge about the Game Boy hardware. Once you know ASM in addition to C, you'll have a lot of flexibility in what tools you use for projects.


### If you know ASM
RGBDS with ASM is a solid option. You'll be able to get the best performance out of the hardware, and there is an experienced community available to help.

Another option is to [reach out to us](#community-and-help), and discuss the matter.


# Tips For Better Code

The *very first thing* to do **in all cases** is to [read the docs](https://gbdev.io/pandocs/), to grasp how the Game Boy works. In ASM, this is essential; in C, this will let you understand what a given library function does. It will also let you understand what is possible on the Game Boy, and what isn't. (You can always ask, if you have doubts.)

I also recommend looking up [awesome-gbdev](https://gbdev.io/list.html) for resources and tutorials. There are a lot of helpful articles there, as well as helper tools.


## ASM Help

- *Modules*<br>
  Separate your game into several "entities" that interact together. Camera, Player, NPCs, Loading zones, etc. This simplifies coding, by allowing you to reason independently on smaller units. This facilitates development and reduces the amount of bugs.
- *Document your functions*<br>
  For each function, write a comment saying what it does, what memory it touches, and what registers it affects. This will avoid conflicts, and let you optimize your code by minimizing the amount of registers you save when calling a function.
- *Plan before writing*<br>
  You should plan what register is going to be used for what within your functions *before starting to write them*. Your goal is to minimize the amount of register swapping. There's no general rule, so feel free to drop by and ask us, if you're in doubt.
- *RGBASM `-E` and RGBLINK `-n <symfile>`*<br>
  When you load `ROM.gb` or `ROM.gbc` in BGB, it automatically loads (if it exists) the file `ROM.sym` in the same folder as the ROM. This adds symbols to the debugger, which - believe me - helps *a ton*.


## Optimizing For GBDK

- *Global variables*<br>
  Use as many global variables as you can; the Game Boy has a lot of RAM compared to other platforms such as the NES, but is slow at using the stack. Thus, minimizing the number of local variables, especially in heavily-called functions, will reduce the time spent manipulating the stack.
- *Optimized code*<br>
  Write code as efficient as possible. Sometimes there is a readability tradeoff, so I recommend you get the comment machine gun out and put some everywhere.
- By default GBDK-2020 (after v4.0.1) will use the SDCC flag `--max-allocs-per-node 50000` for an increased optimization pass. You may also choose to use --opt-code-speed (optimize code generation towards fast code, possibly at the expense of codesize) or --opt-code-size (optimize code generation towards compact code, possibly at the expense of codespeed).
- *Inlining*<br>
  When performance is important avoid using functions if you can inline them, which skips passing all arguments to the stack, mostly. Macros will be your friends there. If needed you can also use inline ASM.
- **NEVER use recursive functions**
- **AVOID printf**<br>
  `printf` clobbers a sizeable chunk of VRAM with unnecessary text tiles. Instead, you should `sprintf` to a buffer in WRAM, then put that on the screen using a custom font.
- *Geometry funcs*<br>
  Avoid the functions that draw geometry on-screen (lines, rectangles, etc.). The Game Boy isn't designed for this kind of drawing method, and you will have a hard time mixing this with, say, background art. Plus, the functions are super slow.
- `const` (very important!)<br>
  Declaring a variable that doesn't change as `const` **greatly** reduces the amount of ROM, RAM, and CPU used.<br>
  The technical reason behind that is that non-`const` values, *especially* arrays, are loaded to RAM from ROM in an *extremely* inefficient way. This takes up a LOT more ROM, and copies the value(s) to RAM when it's unneeded. (And the GB does not have enough RAM for that to be viable.)
- *Don't use MBC1*<br>
  MBC1 is often assumed to be the simplest of all MBCs... but it has a quirk that adds some overhead every time ROM or SRAM bank switches are performed. MBC3 and MBC5 don't have this quirk, and don't add any complexity. Using MBC1 has no real use. (Let's not talk about MBC2, either.)


# Community And Help

If you want to get help from the community, go:
- To the historical IRC channel, #gbdev on [EFNet](http://efnet.net) \[if you don't have an IRC client, you can use the "Webchat login" box, just enter a username\].
- To the more recent [gbdev Discord server](https://gbdev.io/chat.html) or [GBDK/ZGB](https://github.com/Zal0/gbdk-2020#discord-servers) specific server.
- And to the [GBDev forums](http://gbdev.gg8.se/forums)!
