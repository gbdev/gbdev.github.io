(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{363:function(e,t,a){"use strict";a.r(t);var o=a(44),r=Object(o.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"choosing-tools-for-game-boy-development"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#choosing-tools-for-game-boy-development"}},[e._v("#")]),e._v(" Choosing tools for Game Boy development")]),e._v(" "),a("p",[e._v("This essay gives an overview of the Game Boy's capabilities, discussing the pros and cons of the available development tools, and providing a few tips to write more efficient code.")]),e._v(" "),a("p",[e._v("Written by "),a("a",{attrs:{href:"https://github.com/ISSOtm/",target:"_blank",rel:"noopener noreferrer"}},[e._v("ISSOtm"),a("OutboundLink")],1),e._v(" with help from "),a("a",{attrs:{href:"https://github.com/tobiasvl",target:"_blank",rel:"noopener noreferrer"}},[e._v("tobiasvl"),a("OutboundLink")],1),e._v(", some updates by "),a("a",{attrs:{href:"https://github.com/bbbbbr",target:"_blank",rel:"noopener noreferrer"}},[e._v("bbbbbr"),a("OutboundLink")],1),e._v(".")]),e._v(" "),a("hr"),e._v(" "),a("p",[e._v("In the past few years as retro gaming has grown in popularity, programming for older platforms has also gained traction. A popular platform is the Game Boy, both for its nostalgia and (relative) ease to program for.")]),e._v(" "),a("div",{staticClass:"custom-block warning"},[a("p",{staticClass:"custom-block-title"},[e._v("WARNING")]),e._v(" "),a("p",[e._v("This document only applies to the Game Boy and Game Boy Color. Game Boy Advance programming has little in common with Game Boy programming.")]),e._v(" "),a("p",[e._v("If you want to program for the GBA, which is much more C-friendly (and C++ and Rust, for that matter) than the GB and GBC, then I advise you to download devkitARM and follow the "),a("a",{attrs:{href:"https://www.coranac.com/tonc/text/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Tonc"),a("OutboundLink")],1),e._v(" tutorial. Please note that the Game Boy Advance also functions as a Game Boy Color, so if you only have a GBA, you can use it for both GB and GBC development.")])]),e._v(" "),a("p",[e._v("When someone wants to make their own game, one of the first problems they will encounter is picking the "),a("em",[e._v("tools")]),e._v(" they will use. There current main options are:")]),e._v(" "),a("ul",[a("li",[e._v("RGBDS (Rednex Game Boy Development System) and the Game Boy's Assembly language (ASM)")]),e._v(" "),a("li",[e._v("GBDK-2020 (Game Boy Development Kit) and the C language")]),e._v(" "),a("li",[e._v("ZGB (an engine built on GBDK-2020) and the C language")]),e._v(" "),a("li",[e._v("GB Studio (a drag-and-drop game creator with scripting)")])]),e._v(" "),a("p",[e._v('The purpose of this document is to provide some insights and help you make the better choice if you\'re starting a new project. I will also provide some "good practice" tips, both for C and ASM, if you have already made up your mind or are already using one of these.')]),e._v(" "),a("h1",{attrs:{id:"overview"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#overview"}},[e._v("#")]),e._v(" Overview")]),e._v(" "),a("p",[e._v("The original Game Boy, codenamed the DMG, has a 1 MHz CPU [the CPU is actually clocked at 4 MHz, but every instruction takes up a multiple of 4 clocks, so it's often simplified to a 1 MHz CPU]. Given that an instruction takes approximately 2 to 3 cycles, this gives the CPU a capacity of 333,000~500,000 instructions per second.\nIts LCD boasts 60 fps [it's actually 59.73 fps], which rounds up to between 50,000 and 80,000 instructions per frame. Suddenly not so much, eh?\nIt also has 8 kB of RAM, and 8 kB of video RAM ; a 160x144 px LCD (thus slightly wider than it's tall), 4 colors, and 4-channel audio.")]),e._v(" "),a("p",[e._v("The Super Game Boy adds a few minor things, such as a customizable screen border, and some crude color. It's also slightly faster than the DMG.")]),e._v(" "),a("p",[e._v("The Game Boy Color "),a("em",[e._v("can")]),e._v(" [if you tell it to] unlock additional functionality, such as more fleshed-out color, a double-speed CPU, twice the video RAM and "),a("em",[e._v("four times")]),e._v(" the RAM! (With caveats, obviously.)")]),e._v(" "),a("h1",{attrs:{id:"languages"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#languages"}},[e._v("#")]),e._v(" Languages")]),e._v(" "),a("p",[e._v("The choice of programming language is important and can have a very large effect on a project. It determines how much work is involved, what will be possible, and how fast it will be able to run.")]),e._v(" "),a("h3",{attrs:{id:"assembly-asm"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#assembly-asm"}},[e._v("#")]),e._v(" Assembly (ASM)")]),e._v(" "),a("p",[e._v("Most games and programs for the Game Boy written in ASM will use RGBDS or WLA-DX.")]),e._v(" "),a("p",[e._v("Strengths:")]),e._v(" "),a("ul",[a("li",[e._v("Not too difficult to learn.")]),e._v(" "),a("li",[e._v("Extremely powerful and flexible.")]),e._v(" "),a("li",[e._v("When well written it allows for maximum speed and efficiency on the limited resources of the Game Boy hardware.")])]),e._v(" "),a("p",[e._v("Weaknesses:")]),e._v(" "),a("ul",[a("li",[e._v("It takes a special kind of work to write optimized ASM code.")]),e._v(" "),a("li",[e._v("It's quite verbose and sometimes tedious.")]),e._v(" "),a("li",[e._v("Will require more time and learning to get up and running when compared with C.")]),e._v(" "),a("li",[e._v("Code may not be easily shared with ports of a game on other platforms.")])]),e._v(" "),a("h3",{attrs:{id:"c"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#c"}},[e._v("#")]),e._v(" C")]),e._v(" "),a("p",[e._v("C will typically be used with the SDCC compiler and GBDK-2020 or ZGB, though it can also be used on it’s own without a framework or with a different compiler/dev kit (such as "),a("a",{attrs:{href:"https://github.com/z88dk/",target:"_blank",rel:"noopener noreferrer"}},[e._v("z88dk"),a("OutboundLink")],1),e._v(").")]),e._v(" "),a("p",[e._v("Strengths:")]),e._v(" "),a("ul",[a("li",[e._v("Allows for getting up and running faster than with ASM, especially when building on top of GBDK-2020 and ZGB.")]),e._v(" "),a("li",[e._v("The language abstractions make it relatively easy to implement ideas and algorithms.")]),e._v(" "),a("li",[e._v("C source debugging is available through Emulicious with the VSCode debug adapter, making it easier to understand problems if they arise.")]),e._v(" "),a("li",[e._v("ASM can be included in projects with C, either standalone or inline for speed critical features.")])]),e._v(" "),a("p",[e._v("Weaknesses:")]),e._v(" "),a("ul",[a("li",[e._v("The SDCC C compiler won't always generate code that runs as fast as skilled, hand-optimized assembly. It has matured a lot in the 20 years since the original GBDK, but bugs still turns up on occasion. On a platform with a slow CPU such as the Game Boy this can be a factor.")]),e._v(" "),a("li",[e._v("It’s easier to write inefficient code in C without realizing it. The Game Boy's CPU is only capable of performing 8-bit addition or subtraction, or 16-bit addition. Using "),a("code",[e._v("INT32")]),e._v("s is quite taxing on the CPU (it needs to do two consecutive 16-bit adds, and add the carry). See the tips below to avoid such blunders.")]),e._v(" "),a("li",[e._v("There is overhead due to C being a stack-oriented language, whereas the Game Boy's CPU is rather built for a register-oriented strategy. This most notably makes passing function arguments a lot slower, although SDCC has some optimizations for this.")])]),e._v(" "),a("h3",{attrs:{id:"non-programming-language-option"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#non-programming-language-option"}},[e._v("#")]),e._v(" Non-Programming Language option")]),e._v(" "),a("p",[e._v("Using a GUI instead- If you don’t want to learn a programming language in order to make Game Boy games, then GB Studio is an option. See the "),a("a",{attrs:{href:"#gb-studio"}},[e._v("GB Studio")]),e._v(" section for more details.")]),e._v(" "),a("h1",{attrs:{id:"development-platforms"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#development-platforms"}},[e._v("#")]),e._v(" Development Platforms")]),e._v(" "),a("h3",{attrs:{id:"rgbds-with-asm"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#rgbds-with-asm"}},[e._v("#")]),e._v(" "),a("a",{attrs:{href:"http://github.com/rednex/rgbds",target:"_blank",rel:"noopener noreferrer"}},[e._v("RGBDS"),a("OutboundLink")],1),e._v(" with ASM")]),e._v(" "),a("p",[e._v("RGBDS is an actively maintained suite of programs that allow building a ROM using ASM (assembly). It contains three programs that perform different stages of the compilation, as well as a program that converts PNG images to the Game Boy's tile format. RGBDS is available for Linux, Windows and MacOS.")]),e._v(" "),a("p",[e._v("Strengths:")]),e._v(" "),a("ul",[a("li",[e._v("Very knowledgeable community with a lot of history.")]),e._v(" "),a("li",[e._v("Built in support for ROM banking.")]),e._v(" "),a("li",[e._v("Works quite well with BGB for debugging.")])]),e._v(" "),a("p",[e._v("Weaknesses:")]),e._v(" "),a("ul",[a("li",[e._v("Provides a limited amount of built-in code and functionality (does not include a large API like GBDK-2020 does).")])]),e._v(" "),a("h3",{attrs:{id:"wla-dx-with-asm"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#wla-dx-with-asm"}},[e._v("#")]),e._v(" "),a("a",{attrs:{href:"https://github.com/vhelin/wla-dx",target:"_blank",rel:"noopener noreferrer"}},[e._v("WLA-DX"),a("OutboundLink")],1),e._v(" with ASM")]),e._v(" "),a("p",[e._v("WLA-DX is also sometimes used when writing in ASM, mostly due to its better struct support than RGBDS.")]),e._v(" "),a("h3",{attrs:{id:"gbdk-2020-with-c"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#gbdk-2020-with-c"}},[e._v("#")]),e._v(" "),a("a",{attrs:{href:"https://github.com/Zal0/gbdk-2020",target:"_blank",rel:"noopener noreferrer"}},[e._v("GBDK-2020"),a("OutboundLink")],1),e._v(" with C")]),e._v(" "),a("p",[e._v("GBDK-2020 is a development kit and toolchain built around the SDCC C compiler which allows you to write programs in C and build ROMs. It includes an API for interfacing with the Game Boy. GBDK-2020 is a modernized version of the original "),a("a",{attrs:{href:"http://gbdk.sourceforge.net",target:"_blank",rel:"noopener noreferrer"}},[e._v("GBDK"),a("OutboundLink")],1),e._v(". It's available for Linux, Windows and MacOS.")]),e._v(" "),a("p",[e._v("Strengths:")]),e._v(" "),a("ul",[a("li",[e._v("Flexible and extensible.")]),e._v(" "),a("li",[e._v("Comprehensive API that covers most hardware features.")]),e._v(" "),a("li",[e._v("Many sample projects and open source games are available that demonstrate how to use the API, hardware, and structure games.")]),e._v(" "),a("li",[e._v("C source debugging is available with Emulicious.")])]),e._v(" "),a("p",[e._v("Weaknesses:")]),e._v(" "),a("ul",[a("li",[e._v("Takes care of some aspects of the hardware without requiring the developer to initiate them (such as OAM DMA during VBLANK), so it's not always obvious to beginners what the hardware is doing behind the scenes, or how to fix them when something goes wrong.")]),e._v(" "),a("li",[e._v("ROM banking may require more management in code than RGBDS.")])]),e._v(" "),a("h3",{attrs:{id:"zgb-with-c-gbdk-2020"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#zgb-with-c-gbdk-2020"}},[e._v("#")]),e._v(" "),a("a",{attrs:{href:"https://github.com/Zal0/ZGB/",target:"_blank",rel:"noopener noreferrer"}},[e._v("ZGB"),a("OutboundLink")],1),e._v(" with C & GBDK-2020")]),e._v(" "),a("p",[e._v("ZGB is a small engine for the Game Boy built on top of GBDK-2020 and written in C.\nStrengths:")]),e._v(" "),a("ul",[a("li",[e._v("The basic graphics, sound and event structure are all pre-written, so it’s faster and easier to start writing a game.")]),e._v(" "),a("li",[e._v("Several open source games built with it are available as examples.")])]),e._v(" "),a("p",[e._v("Weaknesses:")]),e._v(" "),a("ul",[a("li",[e._v("The engine just has the basics and custom code may need to be needed for common game features (such as moving platforms, etc.).")]),e._v(" "),a("li",[e._v("Even more of the hardware configuration and processing is taken care of behind the scenes than with GBDK, so less experienced users may have trouble when problems arise.")])]),e._v(" "),a("h3",{attrs:{id:"gb-studio"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#gb-studio"}},[e._v("#")]),e._v(" "),a("a",{attrs:{href:"https://www.gbstudio.dev/",target:"_blank",rel:"noopener noreferrer"}},[e._v("GB Studio"),a("OutboundLink")],1)]),e._v(" "),a("p",[e._v("GB Studio is a drag-and-drop game creator for the Game Boy that does not require knowledge of programming languages. Games are built using a graphical interface to script graphics, sound and actions. It is available for Linux, Windows and MacOS.")]),e._v(" "),a("p",[e._v("Strengths:")]),e._v(" "),a("ul",[a("li",[e._v("Very easy for beginners to start building games right away. Everything is built-in and requires minimal knowledge and understanding of the Game Boy hardware.")]),e._v(" "),a("li",[e._v("Has been used to create large and extensive projects.")]),e._v(" "),a("li",[e._v("Very active community for help and support.")])]),e._v(" "),a("p",[e._v("Weaknesses:")]),e._v(" "),a("ul",[a("li",[e._v("It’s games will tend to be slower than both ASM and C.")]),e._v(" "),a("li",[e._v("There is a limited set of commands to script with and some artificially smaller restrictions on palettes, sprites, background tiles and other hardware features (due to how GB Studio manages them).")]),e._v(" "),a("li",[e._v("Games may be more constrained or require workarounds to do things if they don’t easily fit within the available scripting, graphics and sound tools. (Though it is possible for advanced users to do a “engine eject” and add more functionality using C and ASM.)")])]),e._v(" "),a("h1",{attrs:{id:"emulators-and-debuging-tools"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#emulators-and-debuging-tools"}},[e._v("#")]),e._v(" Emulators and debuging tools")]),e._v(" "),a("p",[e._v("Accurate emulators and debugging tools are tremendously helpful for testing and tracking down problems. The following Game Boy emulators provide excellent accuracy and include a variety of different features.")]),e._v(" "),a("ul",[a("li",[a("p",[a("a",{attrs:{href:"http://bgb.bircd.org",target:"_blank",rel:"noopener noreferrer"}},[e._v("BGB"),a("OutboundLink")],1),e._v(" has a convenient (ASM) debugger, though its minimal interface can be confusing at first. It is available for Windows only, but runs almost flawlessly with Wine.")])]),e._v(" "),a("li",[a("p",[a("a",{attrs:{href:"https://emulicious.net/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Emulicious"),a("OutboundLink")],1),e._v(" includes powerful tools such as a profiler and source-level debugging for ASM and C via a "),a("a",{attrs:{href:"https://marketplace.visualstudio.com/items?itemName=emulicious.emulicious-debugger",target:"_blank",rel:"noopener noreferrer"}},[e._v("VS Code debug adapter"),a("OutboundLink")],1),e._v(". It runs on Linux, Windows, MacOS and any other operating systems that supports Java SE.")])]),e._v(" "),a("li",[a("p",[a("a",{attrs:{href:"https://sameboy.github.io/features/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Same Boy"),a("OutboundLink")],1),e._v(" is user friendly and has a wide range of powerful (ASM) debugging features. It runs on Windows and MacOS.")])]),e._v(" "),a("li",[a("p",[a("a",{attrs:{href:"http://github.com/sinamas/gambatte",target:"_blank",rel:"noopener noreferrer"}},[e._v("Gambatte"),a("OutboundLink")],1),e._v(" lacks a debugger and must be compiled from source, but is packaged both in "),a("a",{attrs:{href:"http://retroarch.com",target:"_blank",rel:"noopener noreferrer"}},[e._v("RetroArch"),a("OutboundLink")],1),e._v(" (Linux, Windows and Mac) and "),a("a",{attrs:{href:"http://tasvideos.org/BizHawk.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("BizHawk"),a("OutboundLink")],1),e._v(" (Windows-only).")])]),e._v(" "),a("li",[a("p",[e._v("Purists prefer to also run their games on hardware, which is possible thanks to flashcarts. My personal recommendation is "),a("a",{attrs:{href:"http://krikzz.com/store/",target:"_blank",rel:"noopener noreferrer"}},[e._v("krikzz's carts"),a("OutboundLink")],1),e._v(", particularly the "),a("a",{attrs:{href:"https://krikzz.com/store/home/47-everdrive-gb.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("Everdrive GB X5"),a("OutboundLink")],1),e._v(".")])])]),e._v(" "),a("p",[e._v("Side note : if you are using VBA or VBA-rr, "),a("strong",[e._v("stop using them right now")]),e._v(". These emulators are extremely inaccurate, and also contain "),a("strong",[e._v("severe security flaws")]),e._v(". I strongly urge you to ditch these emulators and spread the word.")]),e._v(" "),a("h1",{attrs:{id:"summary"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#summary"}},[e._v("#")]),e._v(" Summary")]),e._v(" "),a("p",[e._v('If your question is "'),a("em",[e._v("What should I use for my game project ?")]),e._v("\", then you're in the right section. The first question you should ask yourself is what languages you know.")]),e._v(" "),a("h3",{attrs:{id:"if-you-don-t-know-asm-c-or-c"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#if-you-don-t-know-asm-c-or-c"}},[e._v("#")]),e._v(" If you don't know ASM, C or C++")]),e._v(" "),a("p",[e._v("Consider starting with C and GBDK. This will introduce you to working with the hardware and is an easier starting place.")]),e._v(" "),a("p",[e._v("Once you've grasped C's concepts (most importantly pointers), give ASM a go. The language is simpler than it looks. Even if you don't manage to get working ASM code, it actually helps a lot (especially on such a constrained system) to know what's \"under the hood\". There is even an "),a("a",{attrs:{href:"https://daid.github.io/rgbds-live/",target:"_blank",rel:"noopener noreferrer"}},[e._v("online IDE"),a("OutboundLink")],1),e._v(" to experiment with.")]),e._v(" "),a("p",[e._v("For C / GBDK users, knowing ASM will help you understand what it's API (which is mostly written in ASM) is doing behind the scenes and will make using emulator debuggers easier to understand.")]),e._v(" "),a("p",[e._v("If you don't wan't to learn a language at all, "),a("a",{attrs:{href:"#gb-studio"}},[e._v("GB Studio")]),e._v(" is an alternative to C and ASM.")]),e._v(" "),a("h3",{attrs:{id:"if-you-know-c-but-not-asm"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#if-you-know-c-but-not-asm"}},[e._v("#")]),e._v(" If you know C but not ASM")]),e._v(" "),a("p",[e._v("Consider the goals, scope and time frame of your project. If you'd like to start building right away then C and GBDK will make that easy. You'll also have growing exposure to ASM as time goes on due to working with the hardware and tracking down problems in the debugger.")]),e._v(" "),a("p",[e._v("On the other hand, if you'd like to expand your programming skill set and have additional time, learning to use ASM and RGBDS will provide you with a lot of knowledge about the Game Boy hardware. Once you know ASM in addition to C, you'll have a lot of flexibility in what tools you use for projects.")]),e._v(" "),a("h3",{attrs:{id:"if-you-know-asm"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#if-you-know-asm"}},[e._v("#")]),e._v(" If you know ASM")]),e._v(" "),a("p",[e._v("RGBDS with ASM is a solid option. You'll be able to get the best performance out of the hardware, and there is an experienced community available to help.")]),e._v(" "),a("p",[e._v("Another option is to "),a("a",{attrs:{href:"#community-and-help"}},[e._v("reach out to us")]),e._v(", and discuss the matter.")]),e._v(" "),a("h1",{attrs:{id:"tips-for-better-code"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#tips-for-better-code"}},[e._v("#")]),e._v(" Tips For Better Code")]),e._v(" "),a("p",[e._v("The "),a("em",[e._v("very first thing")]),e._v(" to do "),a("strong",[e._v("in all cases")]),e._v(" is to "),a("a",{attrs:{href:"https://gbdev.io/pandocs/",target:"_blank",rel:"noopener noreferrer"}},[e._v("read the docs"),a("OutboundLink")],1),e._v(", to grasp how the Game Boy works. In ASM, this is essential; in C, this will let you understand what a given library function does. It will also let you understand what is possible on the Game Boy, and what isn't. (You can always ask, if you have doubts.)")]),e._v(" "),a("p",[e._v("I also recommend looking up "),a("a",{attrs:{href:"https://gbdev.io/list.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("awesome-gbdev"),a("OutboundLink")],1),e._v(" for resources and tutorials. There are a lot of helpful articles there, as well as helper tools.")]),e._v(" "),a("h2",{attrs:{id:"asm-help"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#asm-help"}},[e._v("#")]),e._v(" ASM Help")]),e._v(" "),a("ul",[a("li",[a("em",[e._v("Modules")]),a("br"),e._v('\nSeparate your game into several "entities" that interact together. Camera, Player, NPCs, Loading zones, etc. This simplifies coding, by allowing you to reason independently on smaller units. This facilitates development and reduces the amount of bugs.')]),e._v(" "),a("li",[a("em",[e._v("Document your functions")]),a("br"),e._v("\nFor each function, write a comment saying what it does, what memory it touches, and what registers it affects. This will avoid conflicts, and let you optimize your code by minimizing the amount of registers you save when calling a function.")]),e._v(" "),a("li",[a("em",[e._v("Plan before writing")]),a("br"),e._v("\nYou should plan what register is going to be used for what within your functions "),a("em",[e._v("before starting to write them")]),e._v(". Your goal is to minimize the amount of register swapping. There's no general rule, so feel free to drop by and ask us, if you're in doubt.")]),e._v(" "),a("li",[a("em",[e._v("RGBASM "),a("code",[e._v("-E")]),e._v(" and RGBLINK "),a("code",[e._v("-n <symfile>")])]),a("br"),e._v("\nWhen you load "),a("code",[e._v("ROM.gb")]),e._v(" or "),a("code",[e._v("ROM.gbc")]),e._v(" in BGB, it automatically loads (if it exists) the file "),a("code",[e._v("ROM.sym")]),e._v(" in the same folder as the ROM. This adds symbols to the debugger, which - believe me - helps "),a("em",[e._v("a ton")]),e._v(".")])]),e._v(" "),a("h2",{attrs:{id:"optimizing-for-gbdk"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#optimizing-for-gbdk"}},[e._v("#")]),e._v(" Optimizing For GBDK")]),e._v(" "),a("ul",[a("li",[a("em",[e._v("Global variables")]),a("br"),e._v("\nUse as many global variables as you can; the Game Boy has a lot of RAM compared to other platforms such as the NES, but is slow at using the stack. Thus, minimizing the number of local variables, especially in heavily-called functions, will reduce the time spent manipulating the stack.")]),e._v(" "),a("li",[a("em",[e._v("Optimized code")]),a("br"),e._v("\nWrite code as efficient as possible. Sometimes there is a readability tradeoff, so I recommend you get the comment machine gun out and put some everywhere.")]),e._v(" "),a("li",[e._v("By default GBDK-2020 (after v4.0.1) will use the SDCC flag "),a("code",[e._v("--max-allocs-per-node 50000")]),e._v(" for an increased optimization pass. You may also choose to use --opt-code-speed (optimize code generation towards fast code, possibly at the expense of codesize) or --opt-code-size (optimize code generation towards compact code, possibly at the expense of codespeed).")]),e._v(" "),a("li",[a("em",[e._v("Inlining")]),a("br"),e._v("\nWhen performance is important avoid using functions if you can inline them, which skips passing all arguments to the stack, mostly. Macros will be your friends there. If needed you can also use inline ASM.")]),e._v(" "),a("li",[a("strong",[e._v("NEVER use recursive functions")])]),e._v(" "),a("li",[a("strong",[e._v("AVOID printf")]),a("br"),e._v(" "),a("code",[e._v("printf")]),e._v(" clobbers a sizeable chunk of VRAM with unnecessary text tiles. Instead, you should "),a("code",[e._v("sprintf")]),e._v(" to a buffer in WRAM, then put that on the screen using a custom font.")]),e._v(" "),a("li",[a("em",[e._v("Geometry funcs")]),a("br"),e._v("\nAvoid the functions that draw geometry on-screen (lines, rectangles, etc.). The Game Boy isn't designed for this kind of drawing method, and you will have a hard time mixing this with, say, background art. Plus, the functions are super slow.")]),e._v(" "),a("li",[a("code",[e._v("const")]),e._v(" (very important!)"),a("br"),e._v("\nDeclaring a variable that doesn't change as "),a("code",[e._v("const")]),e._v(" "),a("strong",[e._v("greatly")]),e._v(" reduces the amount of ROM, RAM, and CPU used."),a("br"),e._v("\nThe technical reason behind that is that non-"),a("code",[e._v("const")]),e._v(" values, "),a("em",[e._v("especially")]),e._v(" arrays, are loaded to RAM from ROM in an "),a("em",[e._v("extremely")]),e._v(" inefficient way. This takes up a LOT more ROM, and copies the value(s) to RAM when it's unneeded. (And the GB does not have enough RAM for that to be viable.)")]),e._v(" "),a("li",[a("em",[e._v("Don't use MBC1")]),a("br"),e._v("\nMBC1 is often assumed to be the simplest of all MBCs... but it has a quirk that adds some overhead every time ROM or SRAM bank switches are performed. MBC3 and MBC5 don't have this quirk, and don't add any complexity. Using MBC1 has no real use. (Let's not talk about MBC2, either.)")])]),e._v(" "),a("h1",{attrs:{id:"community-and-help"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#community-and-help"}},[e._v("#")]),e._v(" Community And Help")]),e._v(" "),a("p",[e._v("If you want to get help from the community, go:")]),e._v(" "),a("ul",[a("li",[e._v("To the historical IRC channel, #gbdev on "),a("a",{attrs:{href:"http://efnet.net",target:"_blank",rel:"noopener noreferrer"}},[e._v("EFNet"),a("OutboundLink")],1),e._v(' [if you don\'t have an IRC client, you can use the "Webchat login" box, just enter a username].')]),e._v(" "),a("li",[e._v("To the more recent "),a("a",{attrs:{href:"https://gbdev.io/chat.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("gbdev Discord server"),a("OutboundLink")],1),e._v(" or "),a("a",{attrs:{href:"https://github.com/Zal0/gbdk-2020#discord-servers",target:"_blank",rel:"noopener noreferrer"}},[e._v("GBDK/ZGB"),a("OutboundLink")],1),e._v(" specific server.")]),e._v(" "),a("li",[e._v("And to the "),a("a",{attrs:{href:"http://gbdev.gg8.se/forums",target:"_blank",rel:"noopener noreferrer"}},[e._v("GBDev forums"),a("OutboundLink")],1),e._v("!")])])])}),[],!1,null,null,null);t.default=r.exports}}]);