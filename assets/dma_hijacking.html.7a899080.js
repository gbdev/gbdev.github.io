import{r as l,o as t,c as i,a as e,b as a,F as r,e as s,d as o}from"./app.a6eabce3.js";import{_ as p}from"./plugin-vue_export-helper.21dcd24c.js";const c={},d=e("h1",{id:"dma-hijacking",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#dma-hijacking","aria-hidden":"true"},"#"),s(" DMA Hijacking")],-1),h=s("Written by "),u={href:"https://github.com/ISSOtm",target:"_blank",rel:"noopener noreferrer"},b=s("ISSOtm"),m=s("."),y=o('<div class="custom-container tip"><p class="custom-container-title">TARGET AUDIENCE</p><p>Unlike most resources here, this guide is not very useful to developers or even ROM hackers, but rather to glitch-hunters and exploit developers.</p></div><hr><h2 id="what-is-it" tabindex="-1"><a class="header-anchor" href="#what-is-it" aria-hidden="true">#</a> What is it?</h2><p><em>OAM DMA hijacking</em> is a simple technique that allows you to run custom code in most GB/SGB/CGB games, provided you have an ACE exploit.</p><p>One would be quick to point out that if you have an ACE exploit, you can already execute custom code. So then, what is the point? It&#39;s that code ran through DMA Hijacking will be run <em>on every game frame</em> (for most games, at least).</p><h2 id="how-is-it-done" tabindex="-1"><a class="header-anchor" href="#how-is-it-done" aria-hidden="true">#</a> How is it done?</h2>',6),D=s("If you are familiar enough with "),g={href:"https://gbdev.io/pandocs/OAM",target:"_blank",rel:"noopener noreferrer"},E=s("OAM"),F=s(", you may know about a feature called "),f=e("em",null,"OAM DMA",-1),_=s("."),v={href:"https://gbdev.io/pandocs/OAM_DMA_Transfer",target:"_blank",rel:"noopener noreferrer"},A=s("OAM DMA"),k=s(" is a convenient feature that allows quickly updating the on-screen "),w={href:"https://gbdev.io/pandocs/Rendering#objects",target:"_blank",rel:"noopener noreferrer"},M=s('"objects"'),C=s(' (often known as "sprites") quickly\u2014which is especially useful since it typically needs to occur on every frame. However, using OAM DMA requires a small routine to be copied to HRAM and then run from there.'),H=e("p",null,[s("Interestingly, most games only copy the routine when starting up, and then execute it on every subsequent frame. But, "),e("em",null,"if we modified that routine while the game is running"),s(", then the game will happily run the customized routine!")],-1),x=e("h3",{id:"patching-the-code",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#patching-the-code","aria-hidden":"true"},"#"),s(" Patching the code")],-1),B=s("Here is the standard routine, given by Nintendo in the GB programming manual (using "),O={href:"https://rgbds.gbdev.io/docs/rgbasm.5",target:"_blank",rel:"noopener noreferrer"},j=s("RGBASM syntax"),q=s(" and a symbol from "),I={href:"https://github.com/gbdev/hardware.inc",target:"_blank",rel:"noopener noreferrer"},T=e("code",null,"hardware.inc",-1),L=s("):"),G=o(`<div class="language-asm ext-asm line-numbers-mode"><pre class="shiki" style="background-color:#2e3440ff;"><code><span class="line"><span style="color:#D8DEE9FF;">    ld a, HIGH(OAMBuffer)</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    ldh [rDMA], a  </span><span style="color:#616E88;">; $FF46</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    ld a, </span><span style="color:#B48EAD;">40</span></span>
<span class="line"><span style="color:#88C0D0;">DMALoop</span><span style="color:#ECEFF4;">:</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    </span><span style="color:#81A1C1;">dec</span><span style="color:#D8DEE9FF;"> a</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    jr nz, DMALoop</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    </span><span style="color:#81A1C1;">ret</span></span>
<span class="line"></span></code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>The simplest way to get custom code (let&#39;s call it <code>DMAHook</code>) executed would be to overwrite the first few bytes with a jump to <code>DMAHook</code>:</p><div class="language-asm ext-asm line-numbers-mode"><pre class="shiki" style="background-color:#2e3440ff;"><code><span class="line"><span style="color:#D8DEE9FF;">    </span><span style="color:#81A1C1;">jp</span><span style="color:#D8DEE9FF;"> DMAHook</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    </span><span style="color:#81A1C1;">db</span><span style="color:#D8DEE9FF;"> </span><span style="color:#B48EAD;">$46</span><span style="color:#D8DEE9FF;">    </span><span style="color:#616E88;">; Leftover operand byte of \`ldh [rDMA], a\`</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    ld a, </span><span style="color:#B48EAD;">40</span><span style="color:#D8DEE9FF;">  </span><span style="color:#616E88;">; None of this is executed</span></span>
<span class="line"><span style="color:#88C0D0;">DMALoop</span><span style="color:#ECEFF4;">:</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    </span><span style="color:#81A1C1;">dec</span><span style="color:#D8DEE9FF;"> a</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    jr nz, DMALoop</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    </span><span style="color:#81A1C1;">ret</span></span>
<span class="line"></span></code></pre><div class="highlight-lines"><div class="highlight-line">\xA0</div><br><br><br><br><br><br></div><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div>`,3),R=s("Now, overwriting the routine like this works for our purposes, but comes with a large drawback: the routine isn't doing what it is intended to anymore, and so the game's objects won't update (unless you manually copied OAM, but beware of "),S={href:"https://gbdev.io/pandocs/OAM_Corruption_Bug",target:"_blank",rel:"noopener noreferrer"},z=s("the OAM corruption bug"),P=s("). Further, it's not possible to write to "),N=e("code",null,"rDMA",-1),V=s(" from "),W=e("code",null,"DMAHook",-1),$=s(", as the write and subsequent wait loop "),Y=e("strong",null,"must",-1),U=s(" be executed from HRAM."),Z=o(`<p>But, there is a solution.</p><div class="language-asm ext-asm line-numbers-mode"><pre class="shiki" style="background-color:#2e3440ff;"><code><span class="line"><span style="color:#D8DEE9FF;">    </span><span style="color:#81A1C1;">call</span><span style="color:#D8DEE9FF;"> DMAHook</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    ldh [c], a  </span><span style="color:#616E88;">; A write to \`rDMA\`, set up by DMAHook</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    ld a, </span><span style="color:#B48EAD;">40</span></span>
<span class="line"><span style="color:#88C0D0;">DMALoop</span><span style="color:#ECEFF4;">:</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    </span><span style="color:#81A1C1;">dec</span><span style="color:#D8DEE9FF;"> a</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    jr nz, DMALoop</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    </span><span style="color:#81A1C1;">ret</span></span>
<span class="line"></span></code></pre><div class="highlight-lines"><div class="highlight-line">\xA0</div><div class="highlight-line">\xA0</div><br><br><br><br><br></div><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>Provided that <code>DMAHook</code> returns with properly set registers, this allows writing to <code>rDMA</code> in the single HRAM byte left by the <code>call</code> instruction. Here is a pattern for DMAHook :</p><div class="language-asm ext-asm line-numbers-mode"><pre class="shiki" style="background-color:#2e3440ff;"><code><span class="line"><span style="color:#88C0D0;">DMAHook</span><span style="color:#ECEFF4;">:</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    </span><span style="color:#616E88;">;;  Custom code, do whatever you want, it&#39;s VBlank time!</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    </span><span style="color:#616E88;">; ...</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    ld c, LOW(rDMA)  </span><span style="color:#616E88;">; $46</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    ld a, HIGH(OAMBuffer)</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    </span><span style="color:#81A1C1;">ret</span></span>
<span class="line"></span></code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p><code>DMAHook</code> can live anywhere in memory, but typically it will be in WRAM. It will be executed in the context of the VBlank interrupt, so for most games interrupts will be disabled, etc.</p><h2 id="with-cartswap" tabindex="-1"><a class="header-anchor" href="#with-cartswap" aria-hidden="true">#</a> With Cartswap</h2>`,6),X=s("DMA Hijacking is also useful when combined with "),J={href:"https://gist.github.com/ISSOtm/3008fd73ec66cb56f1caecfcc8b6fb6f",target:"_blank",rel:"noopener noreferrer"},K=s("cartswap"),Q=s(' (swapping carts without shutting the console down, concept found by furrtek, developed by Cryo and me on the GCL forums), because it allows "transporting" ACE to other games.'),ss=o("<p>General procedure:</p><ol><li>Acquire ACE in the &quot;source&quot; game</li><li>Perform cartswap, insert the &quot;victim&quot; game</li><li>&quot;Pseudo-initialize&quot; the victim</li><li>Place the modified DMA handler in HRAM</li><li>Transfer control back to the victim&#39;s ROM</li><li>????</li><li>Profit!</li></ol><p>Possible applications are checking for a button combo to trigger specific code (for example, credits warp), checking one or multiple memory addresses to detect a certain game state, etc.</p><p>Possible &quot;attack vectors&quot;, i.e. ways of affecting the victim game, are setting certain memory addresses (like a GameShark), or even better: manipulating the stack.</p><p>Here is a video demonstration:</p>",5),es=e("iframe",{width:"560",height:"315",src:"https://www.youtube-nocookie.com/embed/BNyDmZlbsNI",title:"YouTube video player",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowfullscreen:""},null,-1),ns=e("p",null,"Manipulating the stack with this technique can not crash if the triggering game state is specific enough. I achieved text pointer manipulation in Pok\xE9mon Red this way. (This is not a ROM hack!)",-1),as=e("iframe",{width:"560",height:"315",src:"https://www.youtube-nocookie.com/embed/yXy5sYZR9mk",title:"YouTube video player",frameborder:"0",allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowfullscreen:""},null,-1),os=e("h3",{id:"details",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#details","aria-hidden":"true"},"#"),s(" Details")],-1),ls=s("This new technique hinges on breaking one of any game's core assumptions: its entry point. You see, normally, "),ts={href:"https://gbdev.io/pandocs/The_Cartridge_Header#0100-0103---entry-point",target:"_blank",rel:"noopener noreferrer"},is=s("the console transfers control to the game at address $0100"),rs=s(", so any code placed there is designed to initialize all of the game's systems, in particular their memory."),ps=o('<p>However, since we have control of the CPU, we can jump to any location in the game&#39;s ROM, which allows bypassing some of said initialization. Doing so without any precautions is very likely to go haywire, though\u2014it is important to initialize <em>enough</em> that the game runs, but not <em>too much</em> that it would end up overwriting the code we are trying to inject. This is what I call &quot;<strong>pseudo-initialization</strong>&quot;.</p><p>Another important part is finding some free space to store the hook code in. The stack area can work surprisingly well for this, as many games appear to over-allocate (e.g. 256 bytes when the typical usage doesn&#39;t go beyond 32).</p><p>None of this has a silver bullet: the game&#39;s init code must be analyzed, and its memory usage carefully scrutinized in order to dig up enough free space for your hook.</p><h2 id="trivia" tabindex="-1"><a class="header-anchor" href="#trivia" aria-hidden="true">#</a> Trivia</h2><p>DMA hijacking works similarly to the GameShark: that device intercepts accesses to the ROM, and when it detects that the VBlank handler is being run, it &quot;overlays&quot; different instructions that apply the stored codes, and jump back to the actual handler.</p>',5),cs=s("And, why yes, it is possible to use DMA hijacking to emulate GameShark codes! "),ds={href:"http://gbdev.gg8.se/forums/viewtopic.php?id=430",target:"_blank",rel:"noopener noreferrer"},hs=s("Here is a proof-of-concept in Pok\xE9mon Red"),us=s("."),bs=o(`<h2 id="notes" tabindex="-1"><a class="header-anchor" href="#notes" aria-hidden="true">#</a> Notes</h2><ul><li><p>I encountered some games that don&#39;t transfer OAM unless a specific flag is set; I believe that it is always possible to override this limitation, by setting the flag back in the hook.</p></li><li><p>The OAM DMA routine is often placed at $FF80 in commercial games.</p></li><li><p>The patched OAM DMA routine with our hook may be modifying registers that the game expects to be preserved. This is all dependent on the target game, so no general advice can be given.</p><p>Additionally, if the hook takes too long, it may cause code expecting to run in VBlank to break. This might be solved for example by manipulating the stack and injecting an additional return address; here is an example.</p><div class="language-asm ext-asm line-numbers-mode"><pre class="shiki" style="background-color:#2e3440ff;"><code><span class="line"><span style="color:#D8DEE9FF;">    </span><span style="color:#81A1C1;">jp</span><span style="color:#D8DEE9FF;"> DMAHook</span></span>
<span class="line"><span style="color:#88C0D0;">PostDMAHook</span><span style="color:#ECEFF4;">:</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    ldh [c], a</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    ld a, </span><span style="color:#B48EAD;">40</span></span>
<span class="line"><span style="color:#88C0D0;">DMALoop</span><span style="color:#ECEFF4;">:</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    </span><span style="color:#81A1C1;">dec</span><span style="color:#D8DEE9FF;"> a</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    jr nz, DMALoop</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    </span><span style="color:#81A1C1;">jp</span><span style="color:#D8DEE9FF;"> hl</span></span>
<span class="line"></span></code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><div class="language-asm ext-asm line-numbers-mode"><pre class="shiki" style="background-color:#2e3440ff;"><code><span class="line"><span style="color:#D8DEE9FF;">    </span><span style="color:#81A1C1;">pop</span><span style="color:#D8DEE9FF;"> hl  </span><span style="color:#616E88;">; Get original return address</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    ld bc, PostHandlerHook  </span><span style="color:#616E88;">; Address of code that will be executed once the VBlank handler finishes</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    </span><span style="color:#81A1C1;">push</span><span style="color:#D8DEE9FF;"> bc  </span><span style="color:#616E88;">; Inject return address for VBlank handler</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    ld c, LOW(rDMA)</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    ld a, HIGH(OAMBuffer)</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    </span><span style="color:#81A1C1;">jp</span><span style="color:#D8DEE9FF;"> PostDMAHook</span></span>
<span class="line"></span></code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>(Since the handler almost certainly performs some <code>pop</code>s before returning, you will almost certainly need more complex stack manipulation, but that&#39;s the gist of it.)</p></li><li><p>Some games have a slightly more clever routine in HRAM, that omits the initial <code>ld a, HIGH(OAMBuffer)</code> saving 2 bytes of HRAM.</p><div class="language-asm ext-asm line-numbers-mode"><pre class="shiki" style="background-color:#2e3440ff;"><code><span class="line"><span style="color:#D8DEE9FF;">    ldh [rDMA], a</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    ld a, </span><span style="color:#B48EAD;">40</span></span>
<span class="line"><span style="color:#88C0D0;">DMALoop</span><span style="color:#ECEFF4;">:</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    </span><span style="color:#81A1C1;">dec</span><span style="color:#D8DEE9FF;"> a</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    jr nz, DMALoop</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    </span><span style="color:#81A1C1;">ret</span></span>
<span class="line"></span></code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>They can still be patched by overwriting the <code>ld a, 40</code> instead, and using e.g. the <code>b</code> register for the loop:</p><div class="language-asm ext-asm line-numbers-mode"><pre class="shiki" style="background-color:#2e3440ff;"><code><span class="line"><span style="color:#D8DEE9FF;">    </span><span style="color:#81A1C1;">call</span><span style="color:#D8DEE9FF;"> DMAHook</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    ldh [c], a  </span><span style="color:#616E88;">; Write to rDMA</span></span>
<span class="line"><span style="color:#88C0D0;">DMALoop</span><span style="color:#ECEFF4;">:</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    </span><span style="color:#81A1C1;">dec</span><span style="color:#D8DEE9FF;"> b</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    jr nz, DMALoop</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    </span><span style="color:#81A1C1;">ret</span></span>
<span class="line"></span></code></pre><div class="highlight-lines"><div class="highlight-line">\xA0</div><div class="highlight-line">\xA0</div><br><div class="highlight-line">\xA0</div><br><br></div><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>Then <code>DMAHook</code> needs to return with <code>b</code> additionally set to 40:</p><div class="language-asm ext-asm line-numbers-mode"><pre class="shiki" style="background-color:#2e3440ff;"><code><span class="line"><span style="color:#88C0D0;">DMAHook</span><span style="color:#ECEFF4;">:</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    </span><span style="color:#616E88;">;;  Custom code, do whatever you want, it&#39;s VBlank time!</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    </span><span style="color:#616E88;">; ...</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    ld bc, </span><span style="color:#B48EAD;">40</span><span style="color:#D8DEE9FF;"> &lt;&lt; </span><span style="color:#B48EAD;">8</span><span style="color:#D8DEE9FF;"> | LOW(rDMA)  </span><span style="color:#616E88;">; 40 in B, $46 in C</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    ld a, HIGH(OAMBuffer)</span></span>
<span class="line"><span style="color:#D8DEE9FF;">    </span><span style="color:#81A1C1;">ret</span></span>
<span class="line"></span></code></pre><div class="highlight-lines"><br><br><br><div class="highlight-line">\xA0</div><div class="highlight-line">\xA0</div><br></div><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>However, if the OAM buffer address passed to the function (in <code>a</code>) is not static, <code>push af</code> and <code>pop af</code> will have to be used instead of <code>ld a, HIGH(OAMBuffer)</code>.</p></li></ul>`,2);function ms(ys,Ds){const n=l("ExternalLinkIcon");return t(),i(r,null,[d,e("p",null,[h,e("a",u,[b,a(n)]),m]),y,e("p",null,[D,e("a",g,[E,a(n)]),F,f,_]),e("p",null,[e("a",v,[A,a(n)]),k,e("a",w,[M,a(n)]),C]),H,x,e("p",null,[B,e("a",O,[j,a(n)]),q,e("a",I,[T,a(n)]),L]),G,e("p",null,[R,e("a",S,[z,a(n)]),P,N,V,W,$,Y,U]),Z,e("p",null,[X,e("a",J,[K,a(n)]),Q]),ss,es,ns,as,os,e("p",null,[ls,e("a",ts,[is,a(n)]),rs]),ps,e("p",null,[cs,e("a",ds,[hs,a(n)]),us]),bs],64)}var Fs=p(c,[["render",ms]]);export{Fs as default};
