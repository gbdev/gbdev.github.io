import{_ as a,M as r,p as i,q as l,R as e,t,N as n,a1 as s}from"./framework-204010b2.js";const d={},c=e("h1",{id:"game-boy-asm-style-guide",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#game-boy-asm-style-guide","aria-hidden":"true"},"#"),t(" Game Boy ASM style guide")],-1),h={href:"https://github.com/ISSOtm/",target:"_blank",rel:"noopener noreferrer"},u=e("hr",null,null,-1),b=e("p",null,"This style guide aims to formalize a style that most Game Boy ASM programmers agree on, and provide a good baseline for new programmers just starting in this field. (If that's you, welcome! 😄)",-1),p={href:"https://github.com/torvalds/linux/blob/master/Documentation/process/coding-style.rst",target:"_blank",rel:"noopener noreferrer"},g=e("blockquote",null,[e("p",null,[t("Coding style is very personal, and I won't "),e("strong",null,"force"),t(" my views on anybody, but this is what goes for anything that I have to be able to maintain, and I'd prefer it for most other things too. Please at least consider the points made here.")])],-1),_=e("p",null,"Many people follow alternate style guides, and that's fine; but if you're starting to code in ASM, a clean style goes a long way to keep your code organized. Again: you don't have to do everything listed here, but please at least consider the reasons behind each bullet point.",-1),f={href:"https://github.com/gbdev/gbdev.github.io",target:"_blank",rel:"noopener noreferrer"},m={href:"https://gbdev.io/chat",target:"_blank",rel:"noopener noreferrer"},y=e("h2",{id:"naming",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#naming","aria-hidden":"true"},"#"),t(" Naming")],-1),v={href:"https://rgbds.gbdev.io/docs/v0.4.2/rgbasm.5#SYMBOLS",target:"_blank",rel:"noopener noreferrer"},k=e("blockquote",null,[e("p",null,"Symbol names can contain letters, numbers, underscores ‘_’, hashes ‘#’ and at signs ‘@’. However, they must begin with either a letter, or an underscore.")],-1),w=e("p",null,"However, naming conventions make code easier to read, since they help convey the different semantics between each symbol's name.",-1),A=s("<li><p>Labels use PascalCase: <code>DrawNPCs</code>, <code>GetOffsetFromCamera</code>.</p></li><li><p>Labels in RAM (VRAM, SRAM, WRAM, HRAM; you shouldn&#39;t be using Echo RAM or OAM) use the same convention but are prefixed with the initial of the RAM they&#39;re in, in lowercase: <code>wCameraOffsetBuffer</code>, <code>hVBlankFlag</code>, <code>vTilesetTiles</code>, <code>sSaveFileChecksum</code>. <em>Rationale: to know in which memory type the label is; this is important because VRAM and SRAM have special access precautions and HRAM can (should (must)) be accessed using the <code>ldh</code> instruction.</em></p></li><li><p>Local labels use camelCase, regardless of memory type: <code>.waitVRAM</code>, <code>wPlayer.xCoord</code>.</p></li><li><p>Macro names use snake_case: <code>wait_vram</code>, <code>end_struct</code>.</p></li>",4),M=e("p",null,[t("Constants use CAPS_SNAKE: "),e("code",null,"NB_NPCS"),t(", "),e("code",null,"OVERWORLD_STATE_LOAD_MAP"),t(".")],-1),R={href:"https://github.com/gbdev/hardware.inc/blob/master/hardware.inc",target:"_blank",rel:"noopener noreferrer"},S=e("code",null,"rXXX",-1),O=e("h2",{id:"best-practices",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#best-practices","aria-hidden":"true"},"#"),t(" Best practices")],-1),B=e("p",null,"Avoid hardcoding things. This means:",-1),x=e("li",null,[e("p",null,[t("No magic numbers. "),e("code",null,"ld a, CURSOR_SPEED"),t(" is much more obvious than "),e("code",null,"ld a, 5"),t(". In addition, if you ever change your mind and decide to change the cursor speed, you will only need to do so in one location ("),e("code",null,"CURSOR_SPEED equ 5"),t(" → "),e("code",null,"CURSOR_SPEED equ 4"),t(") instead of at every location you're using it, potentially missing some.")])],-1),N=e("strong",null,"absolutely necessary",-1),C={href:"https://rgbds.gbdev.io/docs/v0.4.2/rgbasm.5#BANK",target:"_blank",rel:"noopener noreferrer"},I=e("code",null,"SECTION",-1),L={href:"https://gbdev.io/pandocs/#_0100-0103-entry-point",target:"_blank",rel:"noopener noreferrer"},E={href:"https://github.com/GreenAndEievui/vuibui-engine/blob/206fd814e67da2cebbeca7d011a5537fef22a29c/src/main.asm#L6",target:"_blank",rel:"noopener noreferrer"},T={href:"https://gbdev.io/pandocs/#jump-vectors-in-first-rom-bank",target:"_blank",rel:"noopener noreferrer"},q=e("code",null,"rst",-1),G={href:"https://github.com/gbdev/rgbds/issues/244",target:"_blank",rel:"noopener noreferrer"},D={href:"https://rgbds.gbdev.io/docs/v0.4.2/rgbasm.5#Section_Fragments",target:"_blank",rel:"noopener noreferrer"},P=e("code",null,"SECTION FRAGMENT",-1),z=e("code",null,"BANK[]",-1),H=e("code",null,'assert BANK("Section A") == BANK("Section B")',-1),V={href:"https://rgbds.gbdev.io/docs/v0.4.2/rgbasm.5#ALIGN",target:"_blank",rel:"noopener noreferrer"},j=e("code",null,"ALIGN[]",-1),K={href:"https://gbdev.io/pandocs/#lcd-oam-dma-transfers",target:"_blank",rel:"noopener noreferrer"},U=e("code",null,'SECTION "Shadow OAM", WRAM0,ALIGN[8]',-1),F=e("code",null,'SECTION "Shadow OAM", WRAM0[$C000]',-1),W={href:"https://rgbds.gbdev.io/docs/v0.4.2/rgbasm.5#SYMBOLS",target:"_blank",rel:"noopener noreferrer"},X={href:"https://rgbds.gbdev.io/docs/v0.4.2/rgbasm.5#Declaring_variables_in_a_RAM_section",target:"_blank",rel:"noopener noreferrer"},Y=e("code",null,"ds",-1),$={href:"https://rgbds.gbdev.io/docs/v0.4.2/rgbasm.5#EQU",target:"_blank",rel:"noopener noreferrer"},Z=e("code",null,"equ",-1),Q=e("li",null,"Removing, adding, or changing the size of a variable that isn't the last one doesn't require updating every variable after it.",-1),J=e("li",null,[t("The size of each variable is obvious ("),e("code",null,"ds 4"),t(") instead of having to be calculated from the addresses.")],-1),ee=e("li",null,[e("code",null,"equ"),t(" allocation is equivalent to hardcoding section addresses (see above), whereas labels are placed automatically by RGBLINK.")],-1),te={href:"https://rgbds.gbdev.io/docs/v0.4.2/rgbasm.5#Other_functions",target:"_blank",rel:"noopener noreferrer"},oe=e("code",null,"BANK()",-1),ne={href:"https://rgbds.gbdev.io/docs/v0.4.2/rgblink.1#m",target:"_blank",rel:"noopener noreferrer"},se=e("code",null,"map",-1),ae=e("code",null,"sym",-1),re=e("li",null,[e("p",null,"If a file gets too big, you should split it. Files too large are harder to read and navigate. However, the splitting should stay coherent and consistent; having to jump around files constantly is equally as hard to read and navigate.")],-1),ie={href:"https://gbdev.io/pandocs/#no-mbc",target:"_blank",rel:"noopener noreferrer"},le={href:"https://rgbds.gbdev.io/docs/v0.4.2/rgbasm.5#ROMX",target:"_blank",rel:"noopener noreferrer"},de=e("code",null,"ROMX",-1),ce=e("code",null,"ROM0",-1),he={href:"https://github.com/pret/pokecrystal/blob/35219230960f0dc85c0cb6a5723877b247609e46/macros/rst.asm#L1-L5",target:"_blank",rel:"noopener noreferrer"},ue=e("code",null,"farcall",-1),be={href:"https://en.wikipedia.org/wiki/Spaghetti_code",target:"_blank",rel:"noopener noreferrer"},pe={href:"https://bgb.bircd.org",target:"_blank",rel:"noopener noreferrer"},ge=e("p",null,"Also, a lot of the time, variables need to get initialized to values other than 0, so clearing RAM is actually counter-productive in these cases.",-1),_e=e("h2",{id:"recommendations",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#recommendations","aria-hidden":"true"},"#"),t(" Recommendations")],-1),fe=e("p",null,`The difference between these and the "best practices" above is that these are more subjective, but they're still worth talking about here.`,-1),me={href:"https://github.com/pinobatch/libbet/blob/cabe48bc4042338b9975cb32c2dbd0ee6640f31e/src/main.z80#L206-L231",target:"_blank",rel:"noopener noreferrer"},ye={href:"https://github.com/BlitterObjectBob/DeadCScroll/blob/9834372eb0d56e8b9a8cdcaae4b8aecb6d402266/DeadCScroll.asm#L410-L422",target:"_blank",rel:"noopener noreferrer"},ve=s("<li><p>Please use the <code>.asm</code> (or <code>.s</code>) file extensions, not <code>.z80</code>. The GB CPU isn&#39;t a Z80, so syntax highlighters get it <em>mostly</em> right, but not quite. And it helps spreading the false idea that the GB CPU is a Z80. 😢</p></li><li><p>Compressing data is useful for several reasons; however, it&#39;s not necessary in a lot of cases nowadays, so you may want to only look at it after more high-priority aspects.</p></li><li><p>Avoid abusing macros. Macros tend to make code opaque and hard to read for people trying to help you, in addition to having side effects and sometimes leading to very inefficient code.</p></li><li><p>Never let the hardware draw a corrupted frame even if it&#39;s just one frame. If it&#39;s noticeable by squinting a bit, it must go.</p></li>",4),ke={href:"https://www.gnu.org/software/make/manual/html_node/",target:"_blank",rel:"noopener noreferrer"},we={href:"https://github.com/ISSOtm/gb-boilerplate",target:"_blank",rel:"noopener noreferrer"},Ae={href:"https://github.com/ISSOtm/gb-starter-kit",target:"_blank",rel:"noopener noreferrer"};function Me(Re,Se){const o=r("ExternalLinkIcon");return i(),l("div",null,[c,e("p",null,[t("Written by "),e("a",h,[t("ISSOtm"),n(o)])]),u,b,e("p",null,[t("To quote the "),e("a",p,[t("Linux kernel style guide"),n(o)]),t(":")]),g,_,e("p",null,[t("Oh, by the way, you're free to "),e("a",f,[t("contribute to this document"),n(o)]),t(" and/or "),e("a",m,[t("chat with us about it"),n(o)]),t("!")]),y,e("p",null,[e("a",v,[t("RGBASM accepts a lot of symbol names"),n(o)]),t(":")]),k,w,e("ul",null,[A,e("li",null,[M,e("p",null,[t("Exception: constants that are used like labels should follow the label naming conventions. For example, see "),e("a",R,[t("hardware.inc"),n(o)]),t("'s "),S,t(" constants.")])])]),O,e("ul",null,[e("li",null,[B,e("ul",null,[x,e("li",null,[e("p",null,[t("Unless "),N,t(", don't "),e("a",C,[t("force a "),I,t("'s bank"),n(o)]),t(" or address. This puts the burden of managing ROM space on you, instead of offloading the job to RGBLINK, which performs very well in typical cases. Exceptions:")]),e("ul",null,[e("li",null,[t("Your ROM's entry point "),e("a",L,[t("must be at $0100"),n(o)]),t(", however the jump does not have to be to $0150 ("),e("a",E,[t("example"),n(o)]),t(").")]),e("li",null,[e("a",T,[q,t(" vectors and interrupt handlers"),n(o)]),t(" obviously need to be at the corresponding locations.")]),e("li",null,[e("a",G,[t("RGBDS presently does not allow forcing different sections to be in the same bank"),n(o)]),t(". If you need to do so, the ideal fix is to merge the two sections together (either by moving the code, or using "),e("a",D,[P,n(o)]),t("), but if that option is unavailable, the only alternative is to explicitly declare them with the same "),z,t(" attribute. (In which case it's advisable to add an "),H,t(" line.)")])]),e("p",null,[t("If you need some alignment, prefer "),e("a",V,[j,n(o)]),t(" to forcing the address. A typical example is "),e("a",K,[t("OAM DMA"),n(o)]),t("; for that, prefer "),U,t(" over e.g. "),F,t(".")])])])]),e("li",null,[e("p",null,[t("Allocate space for your variables using "),e("a",W,[t("labels"),n(o)]),t(" + "),e("a",X,[Y,t(" & co"),n(o)]),t(" instead of "),e("a",$,[Z,n(o)]),t(". This has several benefits:")]),e("ul",null,[Q,J,ee,e("li",null,[t("Labels support "),e("a",te,[oe,n(o)]),t(" and many cool other features!")]),e("li",null,[t("Labels are output in "),e("a",ne,[se,t(" and "),ae,n(o)]),t(" files.")])])]),re,e("li",null,[e("p",null,[e("a",ie,[t("Unless you're making a 32k ROM"),n(o)]),t(", put things in "),e("a",le,[de,n(o)]),t(" by default. "),ce,t(" space is precious, and can deplete quickly; and when you run out, it's difficult to move things to ROMX.")]),e("p",null,[t("However, if you have code in ROM bank A refer to code or data in ROM bank B, then either should probably be moved to ROM0, or both be placed in the same bank (options for that are mentioned further above). "),e("a",he,[ue,n(o)]),t(" is a good way to make your code really "),e("a",be,[t("spaghetti"),n(o)]),t(".")])]),e("li",null,[e("p",null,[t("Don't clear RAM at init! Good debugging emulators will warn you when you're reading uninitialized RAM ("),e("a",pe,[t("BGB"),n(o)]),t(" has one in the option's Exceptions tab, for example), which will let you know that you forgot to initialize a variable. Clearing RAM does not fix most of these bugs, but silences the helpful warnings.")]),ge])]),_e,fe,e("ul",null,[e("li",null,[e("p",null,[t('Historically, RGBDS has required label definitions to begin at "column 1" (i.e. no whitespace before them on their line). However, later versions (with full support added in 0.5.0) allow '),e("a",me,[t("indenting labels"),n(o)]),t(", for example to make loops stand out like in higher-level languages. However, "),e("a",ye,[t("a lot of people don't do this"),n(o)]),t(", so it's up to you.")])]),ve,e("li",null,[e("p",null,[e("a",ke,[t("Makefiles are bae"),n(o)]),t("; they speed up build time by not re-processing what hasn't changed, and they can automate a lot of tedium. Writing a good Makefile can be quite daunting, but "),e("a",we,[t("gb-boilerplate"),n(o)]),t(" and "),e("a",Ae,[t("gb-starter-kit"),n(o)]),t(" can help you get started faster.")])])])])}const Be=a(d,[["render",Me],["__file","asmstyle.html.vue"]]);export{Be as default};