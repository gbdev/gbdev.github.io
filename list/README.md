<div id='outer'>
<!-- Game Boy animation by `heero`. Originally found at https://codepen.io/heero/pen/wylhv -->
<div id='container'>
                        <div id='back'></div>
                        <div id='border'></div>
                        <div id='card3'></div>
                        <div id='card2'></div>
                        <div id='chip2'></div>
                        <div id='screenBack'></div>
                        <div id='card1'></div>
                        <div id='speaker'></div>
                        <div id='chip'></div>
                        <div id='chipPinL'></div>
                        <div id='chipPinR'></div>
                        <div id='ec1'></div>
                        <div id='volumeWheelBack'></div>
                        <div id='volumeWheel'></div>
                        <div id='joystickBack'></div>
                        <div id='buttonsABBack'></div>
                        <div id='buttonsSSBack'></div>
                        <div id='jackBack'></div>
                        <div id='jack'></div>
                        <div id='ec2'></div>
                        <div id='powerBack'></div>
                        <div id='power'></div>
                        <div id='box'></div>
                        <div id='screen'></div>
                        <div id='screen2'></div>
                        <div id='joystickCross1'></div>
                        <div id='joystickCross2'></div>
                        <div id='buttonsSS'></div>
                        <div id='buttonsSSText'></div>
                        <div id='buttonsAB'></div>
                        <div id='buttonsABText'></div>
                        <!--<img id='gameboyText' src='assets/gb-pocket-logo.png'>-->
                        <div id='powerLed'></div>
                        <div id='speakerFilter'></div>
    </div>
</div>
<div style="line-height: 90%;letter-spacing: -0.05em; font-weight: 400; font-size: 2.7em;"><span style="font-weight: 600;
letter-spacing: -0.05em;">
    Game Boy Development
</span>community</div>

<div style="letter-spacing: -0.055em; font-weight: 500; font-size: 20px;">
        <br>
We are a group of passionate developers working on homebrews, emulators and documentation for the Nintendo Game Boy handheld console, the original gray brick from 1989!
</div>

<a href="https://github.com/gbdev" target="_blank"> <img height="40" width="40" :src="$withBase('/images/github.svg')"></a>&nbsp;<a href="https://instagram.com/gbdev0" target="_blank"><img height="40" width="40" :src="$withBase('/images/instagram.svg')"></a>&nbsp;<a href="https://twitter.com/gbdev0" target="_blank"><img height="40" width="40" :src="$withBase('/images/twitter.svg')"></a>&nbsp;<a href="https://gbdev.io/chat" target="_blank"><img height="40" width="40" :src="$withBase('/images/discord.svg')"></a>

<div>
Here's a quick showcase of what we are up to:<br><br>

<p> <a class="projectTitle" target="_blank" href="https://gbdev.io/pandocs/">Pan Docs&nbsp;</a><a class="github-button" target="_blank" href="https://github.com/gbdev/pandocs" data-icon="octicon-star" data-show-count="true" aria-label="Star gbdev/awesome-gbdev on GitHub">Star</a>
<span></span></p>
The single, most comprehensive technical reference to Game Boy available to the public. 
<br><br>
<p ><a class="projectTitle" href="list.html">Awesome list&nbsp;</a> <a class="github-button" target="_blank" href="https://github.com/gbdev/awesome-gbdev" data-icon="octicon-star" data-show-count="true" aria-label="Star gbdev/awesome-gbdev on GitHub">Star</a>
<span></span></p>
A <b>curated list</b> of Game Boy development resources such as tools, guides, technical documentation, tutorials, emulators, related projects and open-source ROMs. Everything you'll ever need to know and see about this console is here. <br>If you want to code an emulator, create your own game or simply dive into the software and hardware architecture of the Game Boy, this is the place!
<br><br>
<p ><a class="projectTitle" target="_blank" href="https://github.com/gbdev/rgbds">RGBDS&nbsp;</a> <a class="github-button" target="_blank" href="https://github.com/gbdev/rgbds" data-icon="octicon-star" data-show-count="true" aria-label="Star gbdev/rgbds on GitHub">Star</a>
<span></span></p>
Rednex Game Boy Development System: the de-facto development toolkit for the Game Boy and Game Boy Color.
<br><br>
<p class="projectTitle"><a href="https://gbdev.io/chat">Chat Channels</a>&nbsp;<img height="22" src="https://img.shields.io/badge/dynamic/json.svg?label=chat&colorB=green&suffix=%20online&query=presence_count&uri=https://discordapp.com/api/guilds/303217943234215948/widget.json&style=flat-square"></p>
The places our community thrives. Here we <b>chat</b>, discuss, help each other and show what we are working on. We have a Discord server, an IRC channel, and more.
<br><br>
 <p class="projectTitle"><a target="_blank" href="https://gbhh.avivace.com">Homebrew Hub</a>&nbsp;<img height="22" src="https://img.shields.io/badge/dynamic/json.svg?label=games&amp;suffix=%20entries&amp;colorB=blue&amp;query=games&amp;uri=https%3A%2F%2Fgbhh.avivace.com%2Fapi%2Finfo&amp;style=flat-square"></p>
Play Game Boy games online from an archive of hundreds of entries! <br>
A community-led attempt to collect, archive and save every unofficial game, homebrew, demo, patch, hackrom for Game Boy produced by the community through the last 3 decades of passionate work.
<br><br>
<p class="projectTitle"><a target="_blank" href="https://github.com/gb-archive">The Game Boy Archive</a>&nbsp;<img style="font-family: Monospace" height="22" src="https://img.shields.io/badge/dynamic/json.svg?label=mirrored%20projects&amp;url=https%3A%2F%2Fapi.github.com%2Forgs%2Fgb-archive&amp;query=public_repos&amp;style=flat-square"></p>
A <b>library</b> of Game Boy related software, hardware and literature. Aimed to mirror and preserve old and fragmented contributions in the scene from the last three decades.

</div>

<script async defer src="https://buttons.github.io/buttons.js"></script>

<script>
export default {
  mounted () {
    let githubButtonsScript = document.createElement('script')
    githubButtonsScript.setAttribute('src', 'https://buttons.github.io/buttons.js')
    document.head.appendChild(githubButtonsScript)

    let colors = ['#5f98c6', // Teal (1998, 1999 NA) 
        '#FCCF37', // Dandelion - yellow (1998, 1999 NA)
        '#EB1667', // Berry - fuchsia (1998, 1999 NA)
        '#A8F602', // Kiwi - neon green (1998, 1999 NA)
        // '#5B3099', // Grape - purple (1998) TODO: Darken the black elements
        // Translucent colors - TODO: Fix speakers
        'rgba(255, 255, 255, 0.5)', // Atomic Purple - clear purple (1998)
        'rgba(91, 48, 153, 0.5)' // Neotones Ice (LIJI32 special request <3)
    ]
    let color = colors[Math.floor(Math.random() * colors.length)];
    var box = document.querySelector('#box');
    box.style.setProperty('background-color', color);
    console.log(color)
  }
}
</script>

<style>
body{
        font-size:18px !important;
}

.projectTitle{
        font-size:32px;
        letter-spacing: -0.05em;
        line-height: 80%;
}

/*
By `heero`. Originally found at https://codepen.io/heero/pen/wylhv
*/
#outer {
    width: 100%;
}
#container {
  position: relative;
  float: right;
  width: 130px;
  height: 220px;
  margin: 1px 20px 50px 50px;
}

#back {
  position: absolute;
  bottom: 0;
  background-color: #D3D3D3;
  box-shadow: 5px 5px 0 0 #D3D3D3;
  -webkit-animation: backAnim 5s forwards;
  -moz-animation: backAnim 5s forwards;
  -o-animation: backAnim 5s forwards;
  animation: backAnim 5s forwards;
}

@-webkit-keyframes backAnim {
  0% {
    width: 8px;
    height: 68px;
  }
  4% {
    width: 100px;
    height: 75px;
  }
  5% {
    width: 125px;
    height: 80px;
    border-radius: 3px 3px 20px 3px;
  }
  11%, 100% {
    height: 206px;
    width: 125px;
    border-radius: 3px 3px 20px 3px;
  }
}
@-moz-keyframes backAnim {
  0% {
    width: 8px;
    height: 68px;
  }
  4% {
    width: 100px;
    height: 75px;
  }
  5% {
    width: 125px;
    height: 80px;
    border-radius: 3px 3px 20px 3px;
  }
  11%, 100% {
    height: 206px;
    width: 125px;
    border-radius: 3px 3px 20px 3px;
  }
}
@-ms-keyframes backAnim {
  0% {
    width: 8px;
    height: 68px;
  }
  4% {
    width: 100px;
    height: 75px;
  }
  5% {
    width: 125px;
    height: 80px;
    border-radius: 3px 3px 20px 3px;
  }
  11%, 100% {
    height: 206px;
    width: 125px;
    border-radius: 3px 3px 20px 3px;
  }
}
@keyframes backAnim {
  0% {
    width: 8px;
    height: 68px;
  }
  4% {
    width: 100px;
    height: 75px;
  }
  5% {
    width: 125px;
    height: 80px;
    border-radius: 3px 3px 20px 3px;
  }
  11%, 100% {
    height: 206px;
    width: 125px;
    border-radius: 3px 3px 20px 3px;
  }
}
#speaker {
  position: absolute;
  background-color: #646060;
  -webkit-animation: speakerAnim 5s forwards;
  -moz-animation: speakerAnim 5s forwards;
  -o-animation: speakerAnim 5s forwards;
  animation: speakerAnim 5s forwards;
}

@-webkit-keyframes speakerAnim {
  0%, 6% {
    width: 0px;
    height: 0px;
    bottom: 22px;
    left: 103px;
  }
  11% {
    width: 30px;
    height: 30px;
    bottom: 7px;
    left: 88px;
    border-radius: 15px;
    box-shadow: inset 0px 0px 0px 15px #484848;
  }
  14%, 100% {
    width: 30px;
    height: 30px;
    bottom: 7px;
    left: 88px;
    border-radius: 15px;
    box-shadow: inset 0px 0px 0px 8px #484848;
  }
}
@-moz-keyframes speakerAnim {
  0%, 6% {
    width: 0px;
    height: 0px;
    bottom: 22px;
    left: 103px;
  }
  11% {
    width: 30px;
    height: 30px;
    bottom: 7px;
    left: 88px;
    border-radius: 15px;
    box-shadow: inset 0px 0px 0px 15px #484848;
  }
  14%, 100% {
    width: 30px;
    height: 30px;
    bottom: 7px;
    left: 88px;
    border-radius: 15px;
    box-shadow: inset 0px 0px 0px 8px #484848;
  }
}
@-ms-keyframes speakerAnim {
  0%, 6% {
    width: 0px;
    height: 0px;
    bottom: 22px;
    left: 103px;
  }
  11% {
    width: 30px;
    height: 30px;
    bottom: 7px;
    left: 88px;
    border-radius: 15px;
    box-shadow: inset 0px 0px 0px 15px #484848;
  }
  14%, 100% {
    width: 30px;
    height: 30px;
    bottom: 7px;
    left: 88px;
    border-radius: 15px;
    box-shadow: inset 0px 0px 0px 8px #484848;
  }
}
@keyframes speakerAnim {
  0%, 6% {
    width: 0px;
    height: 0px;
    bottom: 22px;
    left: 103px;
  }
  11% {
    width: 30px;
    height: 30px;
    bottom: 7px;
    left: 88px;
    border-radius: 15px;
    box-shadow: inset 0px 0px 0px 15px #484848;
  }
  14%, 100% {
    width: 30px;
    height: 30px;
    bottom: 7px;
    left: 88px;
    border-radius: 15px;
    box-shadow: inset 0px 0px 0px 8px #484848;
  }
}
#card1 {
  position: absolute;
  left: 15px;
  background-color: #5eaf89;
  -webkit-animation: card1Anim 5s forwards;
  -moz-animation: card1Anim 5s forwards;
  -o-animation: card1Anim 5s forwards;
  animation: card1Anim 5s forwards;
}

@-webkit-keyframes card1Anim {
  0%, 8% {
    height: 0px;
    width: 0px;
    bottom: 64px;
  }
  9% {
    height: 17px;
    width: 15px;
    bottom: 64px;
  }
  12% {
    height: 113px;
    width: 15px;
    bottom: 17px;
  }
  18%, 100% {
    height: 113px;
    width: 95px;
    bottom: 17px;
  }
}
@-moz-keyframes card1Anim {
  0%, 8% {
    height: 0px;
    width: 0px;
    bottom: 64px;
  }
  9% {
    height: 17px;
    width: 15px;
    bottom: 64px;
  }
  12% {
    height: 113px;
    width: 15px;
    bottom: 17px;
  }
  18%, 100% {
    height: 113px;
    width: 95px;
    bottom: 17px;
  }
}
@-ms-keyframes card1Anim {
  0%, 8% {
    height: 0px;
    width: 0px;
    bottom: 64px;
  }
  9% {
    height: 17px;
    width: 15px;
    bottom: 64px;
  }
  12% {
    height: 113px;
    width: 15px;
    bottom: 17px;
  }
  18%, 100% {
    height: 113px;
    width: 95px;
    bottom: 17px;
  }
}
@keyframes card1Anim {
  0%, 8% {
    height: 0px;
    width: 0px;
    bottom: 64px;
  }
  9% {
    height: 17px;
    width: 15px;
    bottom: 64px;
  }
  12% {
    height: 113px;
    width: 15px;
    bottom: 17px;
  }
  18%, 100% {
    height: 113px;
    width: 95px;
    bottom: 17px;
  }
}
#border {
  position: absolute;
  bottom: 2px;
  right: 7px;
  border: 2px solid #646060;
  border-radius: 3px 3px 20px 3px;
  -webkit-animation: borderAnim 5s forwards;
  -moz-animation: borderAnim 5s forwards;
  -o-animation: borderAnim 5s forwards;
  animation: borderAnim 5s forwards;
}

@-webkit-keyframes borderAnim {
  0%, 8% {
    height: 0px;
    width: 0px;
    border: none;
  }
  9% {
    height: 40px;
    width: 10px;
    border-right: 2px solid #646060;
    border-bottom: 2px solid #646060;
    border-top: none;
    border-left: none;
  }
  13% {
    height: 40px;
    width: 117px;
    border-right: 2px solid #646060;
    border-bottom: 2px solid #646060;
    border-top: none;
    border-left: none;
  }
  17% {
    height: 198px;
    width: 117px;
    border-right: 2px solid #646060;
    border-left: 2px solid #646060;
    border-bottom: 2px solid #646060;
    border-top: none;
  }
  18%, 100% {
    height: 198px;
    width: 117px;
    border: 2px solid #646060;
  }
}
@-moz-keyframes borderAnim {
  0%, 8% {
    height: 0px;
    width: 0px;
    border: none;
  }
  9% {
    height: 40px;
    width: 10px;
    border-right: 2px solid #646060;
    border-bottom: 2px solid #646060;
    border-top: none;
    border-left: none;
  }
  13% {
    height: 40px;
    width: 117px;
    border-right: 2px solid #646060;
    border-bottom: 2px solid #646060;
    border-top: none;
    border-left: none;
  }
  17% {
    height: 198px;
    width: 117px;
    border-right: 2px solid #646060;
    border-left: 2px solid #646060;
    border-bottom: 2px solid #646060;
    border-top: none;
  }
  18%, 100% {
    height: 198px;
    width: 117px;
    border: 2px solid #646060;
  }
}
@-ms-keyframes borderAnim {
  0%, 8% {
    height: 0px;
    width: 0px;
    border: none;
  }
  9% {
    height: 40px;
    width: 10px;
    border-right: 2px solid #646060;
    border-bottom: 2px solid #646060;
    border-top: none;
    border-left: none;
  }
  13% {
    height: 40px;
    width: 117px;
    border-right: 2px solid #646060;
    border-bottom: 2px solid #646060;
    border-top: none;
    border-left: none;
  }
  17% {
    height: 198px;
    width: 117px;
    border-right: 2px solid #646060;
    border-left: 2px solid #646060;
    border-bottom: 2px solid #646060;
    border-top: none;
  }
  18%, 100% {
    height: 198px;
    width: 117px;
    border: 2px solid #646060;
  }
}
@keyframes borderAnim {
  0%, 8% {
    height: 0px;
    width: 0px;
    border: none;
  }
  9% {
    height: 40px;
    width: 10px;
    border-right: 2px solid #646060;
    border-bottom: 2px solid #646060;
    border-top: none;
    border-left: none;
  }
  13% {
    height: 40px;
    width: 117px;
    border-right: 2px solid #646060;
    border-bottom: 2px solid #646060;
    border-top: none;
    border-left: none;
  }
  17% {
    height: 198px;
    width: 117px;
    border-right: 2px solid #646060;
    border-left: 2px solid #646060;
    border-bottom: 2px solid #646060;
    border-top: none;
  }
  18%, 100% {
    height: 198px;
    width: 117px;
    border: 2px solid #646060;
  }
}
#card2 {
  position: absolute;
  bottom: 6px;
  left: 7px;
  width: 10px;
  height: 20px;
  background-color: #646060;
  -webkit-animation: card2Anim 5s forwards;
  -moz-animation: card2Anim 5s forwards;
  -o-animation: card2Anim 5s forwards;
  animation: card2Anim 5s forwards;
}

@-webkit-keyframes card2Anim {
  0%, 12% {
    height: 0px;
    width: 0px;
  }
  13% {
    height: 20px;
    width: 10px;
  }
  21%, 100% {
    height: 20px;
    width: 78px;
  }
}
@-moz-keyframes card2Anim {
  0%, 12% {
    height: 0px;
    width: 0px;
  }
  13% {
    height: 20px;
    width: 10px;
  }
  21%, 100% {
    height: 20px;
    width: 78px;
  }
}
@-ms-keyframes card2Anim {
  0%, 12% {
    height: 0px;
    width: 0px;
  }
  13% {
    height: 20px;
    width: 10px;
  }
  21%, 100% {
    height: 20px;
    width: 78px;
  }
}
@keyframes card2Anim {
  0%, 12% {
    height: 0px;
    width: 0px;
  }
  13% {
    height: 20px;
    width: 10px;
  }
  21%, 100% {
    height: 20px;
    width: 78px;
  }
}
#card3 {
  position: absolute;
  bottom: 48px;
  left: 8px;
  height: 5px;
  background-color: #3c9b66;
  -webkit-animation: card3Anim 5s forwards;
  -moz-animation: card3Anim 5s forwards;
  -o-animation: card3Anim 5s forwards;
  animation: card3Anim 5s forwards;
}

@-webkit-keyframes card3Anim {
  0%, 12% {
    height: 0px;
    width: 0px;
  }
  15% {
    height: 5px;
    width: 110px;
  }
  23%, 100% {
    height: 150px;
    width: 110px;
  }
}
@-moz-keyframes card3Anim {
  0%, 12% {
    height: 0px;
    width: 0px;
  }
  15% {
    height: 5px;
    width: 110px;
  }
  23%, 100% {
    height: 150px;
    width: 110px;
  }
}
@-ms-keyframes card3Anim {
  0%, 12% {
    height: 0px;
    width: 0px;
  }
  15% {
    height: 5px;
    width: 110px;
  }
  23%, 100% {
    height: 150px;
    width: 110px;
  }
}
@keyframes card3Anim {
  0%, 12% {
    height: 0px;
    width: 0px;
  }
  15% {
    height: 5px;
    width: 110px;
  }
  23%, 100% {
    height: 150px;
    width: 110px;
  }
}
#chip {
  position: absolute;
  bottom: 46px;
  left: 54px;
  width: 4px;
  height: 4px;
  background-color: #484848;
  -webkit-animation: chipAnim 5s forwards;
  -moz-animation: chipAnim 5s forwards;
  -o-animation: chipAnim 5s forwards;
  animation: chipAnim 5s forwards;
}

@-webkit-keyframes chipAnim {
  0%, 15% {
    height: 0px;
    width: 0px;
  }
  16% {
    height: 4px;
    width: 4px;
    bottom: 46px;
    left: 54px;
  }
  20%, 100% {
    height: 22px;
    width: 22px;
    bottom: 37px;
    left: 45px;
  }
}
@-moz-keyframes chipAnim {
  0%, 15% {
    height: 0px;
    width: 0px;
  }
  16% {
    height: 4px;
    width: 4px;
    bottom: 46px;
    left: 54px;
  }
  20%, 100% {
    height: 22px;
    width: 22px;
    bottom: 37px;
    left: 45px;
  }
}
@-ms-keyframes chipAnim {
  0%, 15% {
    height: 0px;
    width: 0px;
  }
  16% {
    height: 4px;
    width: 4px;
    bottom: 46px;
    left: 54px;
  }
  20%, 100% {
    height: 22px;
    width: 22px;
    bottom: 37px;
    left: 45px;
  }
}
@keyframes chipAnim {
  0%, 15% {
    height: 0px;
    width: 0px;
  }
  16% {
    height: 4px;
    width: 4px;
    bottom: 46px;
    left: 54px;
  }
  20%, 100% {
    height: 22px;
    width: 22px;
    bottom: 37px;
    left: 45px;
  }
}
#chip2 {
  position: absolute;
  bottom: 132px;
  left: 60px;
  width: 4px;
  height: 12px;
  background-color: #484848;
  -webkit-animation: chip2Anim 5s forwards;
  -moz-animation: chip2Anim 5s forwards;
  -o-animation: chip2Anim 5s forwards;
  animation: chip2Anim 5s forwards;
}

@-webkit-keyframes chip2Anim {
  0%, 16% {
    height: 0px;
    width: 0px;
  }
  17% {
    height: 12px;
    width: 4px;
    bottom: 132px;
    left: 60px;
  }
  23% {
    height: 12px;
    width: 60px;
    bottom: 132px;
    left: 32px;
  }
  30%, 100% {
    height: 12px;
    width: 60px;
    bottom: 160px;
    left: 32px;
  }
}
@-moz-keyframes chip2Anim {
  0%, 16% {
    height: 0px;
    width: 0px;
  }
  17% {
    height: 12px;
    width: 4px;
    bottom: 132px;
    left: 60px;
  }
  23% {
    height: 12px;
    width: 60px;
    bottom: 132px;
    left: 32px;
  }
  30%, 100% {
    height: 12px;
    width: 60px;
    bottom: 160px;
    left: 32px;
  }
}
@-ms-keyframes chip2Anim {
  0%, 16% {
    height: 0px;
    width: 0px;
  }
  17% {
    height: 12px;
    width: 4px;
    bottom: 132px;
    left: 60px;
  }
  23% {
    height: 12px;
    width: 60px;
    bottom: 132px;
    left: 32px;
  }
  30%, 100% {
    height: 12px;
    width: 60px;
    bottom: 160px;
    left: 32px;
  }
}
@keyframes chip2Anim {
  0%, 16% {
    height: 0px;
    width: 0px;
  }
  17% {
    height: 12px;
    width: 4px;
    bottom: 132px;
    left: 60px;
  }
  23% {
    height: 12px;
    width: 60px;
    bottom: 132px;
    left: 32px;
  }
  30%, 100% {
    height: 12px;
    width: 60px;
    bottom: 160px;
    left: 32px;
  }
}
#volumeWheelBack {
  position: absolute;
  left: 108px;
  bottom: 157px;
  width: 10px;
  height: 10px;
  background-color: #645d5f;
  -webkit-animation: volumeWheelBackAnim 5s forwards;
  -moz-animation: volumeWheelBackAnim 5s forwards;
  -o-animation: volumeWheelBackAnim 5s forwards;
  animation: volumeWheelBackAnim 5s forwards;
}

@-webkit-keyframes volumeWheelBackAnim {
  0%, 17% {
    height: 0px;
    width: 0px;
    left: 113px;
    bottom: 162px;
  }
  21%, 25% {
    height: 10px;
    width: 10px;
    left: 108px;
    bottom: 157px;
  }
  30%, 100% {
    height: 10px;
    width: 10px;
    left: 108px;
    bottom: 167px;
  }
}
@-moz-keyframes volumeWheelBackAnim {
  0%, 17% {
    height: 0px;
    width: 0px;
    left: 113px;
    bottom: 162px;
  }
  21%, 25% {
    height: 10px;
    width: 10px;
    left: 108px;
    bottom: 157px;
  }
  30%, 100% {
    height: 10px;
    width: 10px;
    left: 108px;
    bottom: 167px;
  }
}
@-ms-keyframes volumeWheelBackAnim {
  0%, 17% {
    height: 0px;
    width: 0px;
    left: 113px;
    bottom: 162px;
  }
  21%, 25% {
    height: 10px;
    width: 10px;
    left: 108px;
    bottom: 157px;
  }
  30%, 100% {
    height: 10px;
    width: 10px;
    left: 108px;
    bottom: 167px;
  }
}
@keyframes volumeWheelBackAnim {
  0%, 17% {
    height: 0px;
    width: 0px;
    left: 113px;
    bottom: 162px;
  }
  21%, 25% {
    height: 10px;
    width: 10px;
    left: 108px;
    bottom: 157px;
  }
  30%, 100% {
    height: 10px;
    width: 10px;
    left: 108px;
    bottom: 167px;
  }
}
#volumeWheel {
  position: absolute;
  left: 108px;
  bottom: 157px;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: #b2aea9;
  box-shadow: inset 0px 0px 0px 5px #dddddd;
  -webkit-animation: volumeWheelAnim 5s forwards;
  -moz-animation: volumeWheelAnim 5s forwards;
  -o-animation: volumeWheelAnim 5s forwards;
  animation: volumeWheelAnim 5s forwards;
}

@-webkit-keyframes volumeWheelAnim {
  0%, 18% {
    height: 1px;
    width: 1px;
    left: 115px;
    bottom: 159px;
    box-shadow: inset 0px 0px 0px 10px #dddddd;
  }
  22% {
    height: 16px;
    width: 16px;
    left: 110px;
    bottom: 154px;
    box-shadow: inset 0px 0px 0px 10px #dddddd;
  }
  25% {
    height: 16px;
    width: 16px;
    left: 110px;
    bottom: 154px;
    box-shadow: inset 0px 0px 0px 5px #dddddd;
  }
  30%, 100% {
    height: 16px;
    width: 16px;
    left: 110px;
    bottom: 164px;
    box-shadow: inset 0px 0px 0px 5px #dddddd;
  }
}
@-moz-keyframes volumeWheelAnim {
  0%, 18% {
    height: 1px;
    width: 1px;
    left: 115px;
    bottom: 159px;
    box-shadow: inset 0px 0px 0px 10px #dddddd;
  }
  22% {
    height: 16px;
    width: 16px;
    left: 110px;
    bottom: 154px;
    box-shadow: inset 0px 0px 0px 10px #dddddd;
  }
  25% {
    height: 16px;
    width: 16px;
    left: 110px;
    bottom: 154px;
    box-shadow: inset 0px 0px 0px 5px #dddddd;
  }
  30%, 100% {
    height: 16px;
    width: 16px;
    left: 110px;
    bottom: 164px;
    box-shadow: inset 0px 0px 0px 5px #dddddd;
  }
}
@-ms-keyframes volumeWheelAnim {
  0%, 18% {
    height: 1px;
    width: 1px;
    left: 115px;
    bottom: 159px;
    box-shadow: inset 0px 0px 0px 10px #dddddd;
  }
  22% {
    height: 16px;
    width: 16px;
    left: 110px;
    bottom: 154px;
    box-shadow: inset 0px 0px 0px 10px #dddddd;
  }
  25% {
    height: 16px;
    width: 16px;
    left: 110px;
    bottom: 154px;
    box-shadow: inset 0px 0px 0px 5px #dddddd;
  }
  30%, 100% {
    height: 16px;
    width: 16px;
    left: 110px;
    bottom: 164px;
    box-shadow: inset 0px 0px 0px 5px #dddddd;
  }
}
@keyframes volumeWheelAnim {
  0%, 18% {
    height: 1px;
    width: 1px;
    left: 115px;
    bottom: 159px;
    box-shadow: inset 0px 0px 0px 10px #dddddd;
  }
  22% {
    height: 16px;
    width: 16px;
    left: 110px;
    bottom: 154px;
    box-shadow: inset 0px 0px 0px 10px #dddddd;
  }
  25% {
    height: 16px;
    width: 16px;
    left: 110px;
    bottom: 154px;
    box-shadow: inset 0px 0px 0px 5px #dddddd;
  }
  30%, 100% {
    height: 16px;
    width: 16px;
    left: 110px;
    bottom: 164px;
    box-shadow: inset 0px 0px 0px 5px #dddddd;
  }
}
#chipPinL {
  position: absolute;
  left: 43px;
  bottom: 54px;
  width: 4px;
  height: 2px;
  background-color: #dddddd;
  box-shadow: 0px 3px #dddddd;
  -webkit-animation: chipPinAnimL 5s forwards;
  -moz-animation: chipPinAnimL 5s forwards;
  -o-animation: chipPinAnimL 5s forwards;
  animation: chipPinAnimL 5s forwards;
}

@-webkit-keyframes chipPinAnimL {
  0%, 19% {
    width: 0px;
  }
  20% {
    width: 4px;
    box-shadow: 0px 3px #dddddd;
  }
  21% {
    box-shadow: 0px 3px #dddddd, 0px 6px #dddddd, 0px 9px #dddddd;
  }
  22%, 100% {
    box-shadow: 0px 3px #dddddd, 0px 6px #dddddd, 0px 9px #dddddd, 0px 12px #dddddd, 0px 15px #dddddd;
  }
}
@-moz-keyframes chipPinAnimL {
  0%, 19% {
    width: 0px;
  }
  20% {
    width: 4px;
    box-shadow: 0px 3px #dddddd;
  }
  21% {
    box-shadow: 0px 3px #dddddd, 0px 6px #dddddd, 0px 9px #dddddd;
  }
  22%, 100% {
    box-shadow: 0px 3px #dddddd, 0px 6px #dddddd, 0px 9px #dddddd, 0px 12px #dddddd, 0px 15px #dddddd;
  }
}
@-ms-keyframes chipPinAnimL {
  0%, 19% {
    width: 0px;
  }
  20% {
    width: 4px;
    box-shadow: 0px 3px #dddddd;
  }
  21% {
    box-shadow: 0px 3px #dddddd, 0px 6px #dddddd, 0px 9px #dddddd;
  }
  22%, 100% {
    box-shadow: 0px 3px #dddddd, 0px 6px #dddddd, 0px 9px #dddddd, 0px 12px #dddddd, 0px 15px #dddddd;
  }
}
@keyframes chipPinAnimL {
  0%, 19% {
    width: 0px;
  }
  20% {
    width: 4px;
    box-shadow: 0px 3px #dddddd;
  }
  21% {
    box-shadow: 0px 3px #dddddd, 0px 6px #dddddd, 0px 9px #dddddd;
  }
  22%, 100% {
    box-shadow: 0px 3px #dddddd, 0px 6px #dddddd, 0px 9px #dddddd, 0px 12px #dddddd, 0px 15px #dddddd;
  }
}
#chipPinR {
  position: absolute;
  left: 65px;
  bottom: 54px;
  width: 4px;
  height: 2px;
  background-color: #dddddd;
  box-shadow: 0px 3px #dddddd;
  -webkit-animation: chipPinAnimR 5s forwards;
  -moz-animation: chipPinAnimR 5s forwards;
  -o-animation: chipPinAnimR 5s forwards;
  animation: chipPinAnimR 5s forwards;
}

@-webkit-keyframes chipPinAnimR {
  0%, 22% {
    width: 0px;
  }
  23% {
    width: 4px;
    box-shadow: 0px 3px #dddddd;
  }
  24% {
    box-shadow: 0px 3px #dddddd, 0px 6px #dddddd, 0px 9px #dddddd;
  }
  25%, 100% {
    box-shadow: 0px 3px #dddddd, 0px 6px #dddddd, 0px 9px #dddddd, 0px 12px #dddddd, 0px 15px #dddddd;
  }
}
@-moz-keyframes chipPinAnimR {
  0%, 22% {
    width: 0px;
  }
  23% {
    width: 4px;
    box-shadow: 0px 3px #dddddd;
  }
  24% {
    box-shadow: 0px 3px #dddddd, 0px 6px #dddddd, 0px 9px #dddddd;
  }
  25%, 100% {
    box-shadow: 0px 3px #dddddd, 0px 6px #dddddd, 0px 9px #dddddd, 0px 12px #dddddd, 0px 15px #dddddd;
  }
}
@-ms-keyframes chipPinAnimR {
  0%, 22% {
    width: 0px;
  }
  23% {
    width: 4px;
    box-shadow: 0px 3px #dddddd;
  }
  24% {
    box-shadow: 0px 3px #dddddd, 0px 6px #dddddd, 0px 9px #dddddd;
  }
  25%, 100% {
    box-shadow: 0px 3px #dddddd, 0px 6px #dddddd, 0px 9px #dddddd, 0px 12px #dddddd, 0px 15px #dddddd;
  }
}
@keyframes chipPinAnimR {
  0%, 22% {
    width: 0px;
  }
  23% {
    width: 4px;
    box-shadow: 0px 3px #dddddd;
  }
  24% {
    box-shadow: 0px 3px #dddddd, 0px 6px #dddddd, 0px 9px #dddddd;
  }
  25%, 100% {
    box-shadow: 0px 3px #dddddd, 0px 6px #dddddd, 0px 9px #dddddd, 0px 12px #dddddd, 0px 15px #dddddd;
  }
}
#ec1 {
  position: absolute;
  left: 24px;
  bottom: 122px;
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background-color: #484848;
  -webkit-animation: ec3Anim 5s forwards;
  -moz-animation: ec3Anim 5s forwards;
  -o-animation: ec3Anim 5s forwards;
  animation: ec3Anim 5s forwards;
}

@-webkit-keyframes ec3Anim {
  0%, 18% {
    width: 0px;
  }
  20% {
    width: 4px;
    height: 4px;
  }
  22% {
    box-shadow: 8px 0px #484848;
  }
  24% {
    box-shadow: 8px 0px #484848, 16px 0px #484848;
  }
  26% {
    box-shadow: 8px 0px #484848, 16px 0px #484848, 24px 0px #484848;
  }
  28% {
    box-shadow: 8px 0px #484848, 16px 0px #484848, 24px 0px #484848, 32px 0px #484848;
  }
  30%, 100% {
    box-shadow: 8px 0px #484848, 16px 0px #484848, 24px 0px #484848, 32px 0px #484848, 40px 0px #484848;
  }
}
@-moz-keyframes ec3Anim {
  0%, 18% {
    width: 0px;
  }
  20% {
    width: 4px;
    height: 4px;
  }
  22% {
    box-shadow: 8px 0px #484848;
  }
  24% {
    box-shadow: 8px 0px #484848, 16px 0px #484848;
  }
  26% {
    box-shadow: 8px 0px #484848, 16px 0px #484848, 24px 0px #484848;
  }
  28% {
    box-shadow: 8px 0px #484848, 16px 0px #484848, 24px 0px #484848, 32px 0px #484848;
  }
  30%, 100% {
    box-shadow: 8px 0px #484848, 16px 0px #484848, 24px 0px #484848, 32px 0px #484848, 40px 0px #484848;
  }
}
@-ms-keyframes ec3Anim {
  0%, 18% {
    width: 0px;
  }
  20% {
    width: 4px;
    height: 4px;
  }
  22% {
    box-shadow: 8px 0px #484848;
  }
  24% {
    box-shadow: 8px 0px #484848, 16px 0px #484848;
  }
  26% {
    box-shadow: 8px 0px #484848, 16px 0px #484848, 24px 0px #484848;
  }
  28% {
    box-shadow: 8px 0px #484848, 16px 0px #484848, 24px 0px #484848, 32px 0px #484848;
  }
  30%, 100% {
    box-shadow: 8px 0px #484848, 16px 0px #484848, 24px 0px #484848, 32px 0px #484848, 40px 0px #484848;
  }
}
@keyframes ec3Anim {
  0%, 18% {
    width: 0px;
  }
  20% {
    width: 4px;
    height: 4px;
  }
  22% {
    box-shadow: 8px 0px #484848;
  }
  24% {
    box-shadow: 8px 0px #484848, 16px 0px #484848;
  }
  26% {
    box-shadow: 8px 0px #484848, 16px 0px #484848, 24px 0px #484848;
  }
  28% {
    box-shadow: 8px 0px #484848, 16px 0px #484848, 24px 0px #484848, 32px 0px #484848;
  }
  30%, 100% {
    box-shadow: 8px 0px #484848, 16px 0px #484848, 24px 0px #484848, 32px 0px #484848, 40px 0px #484848;
  }
}
#joystickBack {
  position: absolute;
  left: 8px;
  bottom: 47px;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: #dddddd;
  -webkit-animation: joystickBackAnim 5s forwards;
  -moz-animation: joystickBackAnim 5s forwards;
  -o-animation: joystickBackAnim 5s forwards;
  animation: joystickBackAnim 5s forwards;
}

@-webkit-keyframes joystickBackAnim {
  0%, 23% {
    left: 26px;
    bottom: 65px;
    width: 0px;
    height: 0px;
  }
  28%, 100% {
    left: 8px;
    bottom: 47px;
    width: 36px;
    height: 36px;
  }
}
@-moz-keyframes joystickBackAnim {
  0%, 23% {
    left: 26px;
    bottom: 65px;
    width: 0px;
    height: 0px;
  }
  28%, 100% {
    left: 8px;
    bottom: 47px;
    width: 36px;
    height: 36px;
  }
}
@-ms-keyframes joystickBackAnim {
  0%, 23% {
    left: 26px;
    bottom: 65px;
    width: 0px;
    height: 0px;
  }
  28%, 100% {
    left: 8px;
    bottom: 47px;
    width: 36px;
    height: 36px;
  }
}
@keyframes joystickBackAnim {
  0%, 23% {
    left: 26px;
    bottom: 65px;
    width: 0px;
    height: 0px;
  }
  28%, 100% {
    left: 8px;
    bottom: 47px;
    width: 36px;
    height: 36px;
  }
}
#joystickCross1 {
  position: absolute;
  left: 11px;
  bottom: 60px;
  width: 30px;
  height: 10px;
  border-radius: 1px;
  background-color: #484848;
  -webkit-animation: joystickCrossAnim 5s forwards;
  -moz-animation: joystickCrossAnim 5s forwards;
  -o-animation: joystickCrossAnim 5s forwards;
  animation: joystickCrossAnim 5s forwards;
}

#joystickCross2 {
  position: absolute;
  left: 11px;
  bottom: 60px;
  width: 30px;
  height: 10px;
  border-radius: 1px;
  background-color: #484848;
  -moz-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
  -webkit-animation: joystickCrossAnim 5s forwards;
  -moz-animation: joystickCrossAnim 5s forwards;
  -o-animation: joystickCrossAnim 5s forwards;
  animation: joystickCrossAnim 5s forwards;
}

@-webkit-keyframes joystickCrossAnim {
  0%, 26% {
    left: 26px;
    bottom: 65px;
    width: 0px;
    height: 0px;
  }
  33%, 100% {
    left: 11px;
    bottom: 60px;
    width: 30px;
    height: 10px;
  }
}
@-moz-keyframes joystickCrossAnim {
  0%, 26% {
    left: 26px;
    bottom: 65px;
    width: 0px;
    height: 0px;
  }
  33%, 100% {
    left: 11px;
    bottom: 60px;
    width: 30px;
    height: 10px;
  }
}
@-ms-keyframes joystickCrossAnim {
  0%, 26% {
    left: 26px;
    bottom: 65px;
    width: 0px;
    height: 0px;
  }
  33%, 100% {
    left: 11px;
    bottom: 60px;
    width: 30px;
    height: 10px;
  }
}
@keyframes joystickCrossAnim {
  0%, 26% {
    left: 26px;
    bottom: 65px;
    width: 0px;
    height: 0px;
  }
  33%, 100% {
    left: 11px;
    bottom: 60px;
    width: 30px;
    height: 10px;
  }
}
#buttonsABBack {
  position: absolute;
  left: 70px;
  bottom: 55px;
  width: 50px;
  height: 22px;
  border-radius: 11px;
  background-color: #dddddd;
  box-shadow: inset 0px 0px 0px 2px #a9a9a9;
  -moz-transform: rotate(160deg);
  -ms-transform: rotate(160deg);
  -webkit-transform: rotate(160deg);
  transform: rotate(160deg);
  -webkit-animation: buttonsABBackAnim 5s forwards;
  -moz-animation: buttonsABBackAnim 5s forwards;
  -o-animation: buttonsABBackAnim 5s forwards;
  animation: buttonsABBackAnim 5s forwards;
}

@-webkit-keyframes buttonsABBackAnim {
  0%, 24% {
    left: 95px;
    bottom: 67px;
    width: 0px;
    height: 0px;
    -moz-transform: rotate(220deg);
    -ms-transform: rotate(220deg);
    -webkit-transform: rotate(220deg);
    transform: rotate(220deg);
  }
  29% {
    left: 70px;
    bottom: 55px;
    width: 50px;
    height: 22px;
    -webkit-transform: rotate(160deg);
    -moz-transform: rotate(160deg);
    -ms-transform: rotate(160deg);
    -webkit-transform: rotate(160deg);
    transform: rotate(160deg);
  }
  33%, 100% {
    box-shadow: inset 0px 0px 0px 2px #a9a9a9;
  }
}
@-moz-keyframes buttonsABBackAnim {
  0%, 24% {
    left: 95px;
    bottom: 67px;
    width: 0px;
    height: 0px;
    -moz-transform: rotate(220deg);
    -ms-transform: rotate(220deg);
    -webkit-transform: rotate(220deg);
    transform: rotate(220deg);
  }
  29% {
    left: 70px;
    bottom: 55px;
    width: 50px;
    height: 22px;
    -webkit-transform: rotate(160deg);
    -moz-transform: rotate(160deg);
    -ms-transform: rotate(160deg);
    -webkit-transform: rotate(160deg);
    transform: rotate(160deg);
  }
  33%, 100% {
    box-shadow: inset 0px 0px 0px 2px #a9a9a9;
  }
}
@-ms-keyframes buttonsABBackAnim {
  0%, 24% {
    left: 95px;
    bottom: 67px;
    width: 0px;
    height: 0px;
    -moz-transform: rotate(220deg);
    -ms-transform: rotate(220deg);
    -webkit-transform: rotate(220deg);
    transform: rotate(220deg);
  }
  29% {
    left: 70px;
    bottom: 55px;
    width: 50px;
    height: 22px;
    -webkit-transform: rotate(160deg);
    -moz-transform: rotate(160deg);
    -ms-transform: rotate(160deg);
    -webkit-transform: rotate(160deg);
    transform: rotate(160deg);
  }
  33%, 100% {
    box-shadow: inset 0px 0px 0px 2px #a9a9a9;
  }
}
@keyframes buttonsABBackAnim {
  0%, 24% {
    left: 95px;
    bottom: 67px;
    width: 0px;
    height: 0px;
    -moz-transform: rotate(220deg);
    -ms-transform: rotate(220deg);
    -webkit-transform: rotate(220deg);
    transform: rotate(220deg);
  }
  29% {
    left: 70px;
    bottom: 55px;
    width: 50px;
    height: 22px;
    -webkit-transform: rotate(160deg);
    -moz-transform: rotate(160deg);
    -ms-transform: rotate(160deg);
    -webkit-transform: rotate(160deg);
    transform: rotate(160deg);
  }
  33%, 100% {
    box-shadow: inset 0px 0px 0px 2px #a9a9a9;
  }
}
#buttonsAB {
  position: absolute;
  left: 74px;
  bottom: 53px;
  width: 16px;
  height: 16px;
  border-radius: 11px;
  background-color: #484848;
  box-shadow: 26px -10px #484848;
  -webkit-animation: buttonsABAnim 5s forwards;
  -moz-animation: buttonsABAnim 5s forwards;
  -o-animation: buttonsABAnim 5s forwards;
  animation: buttonsABAnim 5s forwards;
}

@-webkit-keyframes buttonsABAnim {
  0%, 28% {
    left: 81px;
    bottom: 61px;
    width: 0px;
    height: 0px;
    box-shadow: 26px -10px #484848;
  }
  33%, 100% {
    left: 74px;
    bottom: 53px;
    width: 16px;
    height: 16px;
    box-shadow: 26px -10px #484848;
  }
}
@-moz-keyframes buttonsABAnim {
  0%, 28% {
    left: 81px;
    bottom: 61px;
    width: 0px;
    height: 0px;
    box-shadow: 26px -10px #484848;
  }
  33%, 100% {
    left: 74px;
    bottom: 53px;
    width: 16px;
    height: 16px;
    box-shadow: 26px -10px #484848;
  }
}
@-ms-keyframes buttonsABAnim {
  0%, 28% {
    left: 81px;
    bottom: 61px;
    width: 0px;
    height: 0px;
    box-shadow: 26px -10px #484848;
  }
  33%, 100% {
    left: 74px;
    bottom: 53px;
    width: 16px;
    height: 16px;
    box-shadow: 26px -10px #484848;
  }
}
@keyframes buttonsABAnim {
  0%, 28% {
    left: 81px;
    bottom: 61px;
    width: 0px;
    height: 0px;
    box-shadow: 26px -10px #484848;
  }
  33%, 100% {
    left: 74px;
    bottom: 53px;
    width: 16px;
    height: 16px;
    box-shadow: 26px -10px #484848;
  }
}
#buttonsABText {
  -webkit-animation: buttonsABTextAnim 5s forwards;
  -moz-animation: buttonsABTextAnim 5s forwards;
  -o-animation: buttonsABTextAnim 5s forwards;
  animation: buttonsABTextAnim 5s forwards;
}

#buttonsABText::before {
  content: "A";
  position: absolute;
  left: 106px;
  bottom: 50px;
  font: 8px "Arial";
  color: #606060;
}

#buttonsABText::after {
  content: "B";
  position: absolute;
  left: 80px;
  bottom: 40px;
  font: 8px "Arial";
  color: #606060;
}

@-webkit-keyframes buttonsABTextAnim {
  0%, 73% {
    visibility: hidden;
  }
  74%, 100% {
    bisibility: visible;
  }
}
@-moz-keyframes buttonsABTextAnim {
  0%, 73% {
    visibility: hidden;
  }
  74%, 100% {
    bisibility: visible;
  }
}
@-ms-keyframes buttonsABTextAnim {
  0%, 73% {
    visibility: hidden;
  }
  74%, 100% {
    bisibility: visible;
  }
}
@keyframes buttonsABTextAnim {
  0%, 73% {
    visibility: hidden;
  }
  74%, 100% {
    bisibility: visible;
  }
}
#buttonsSSText {
  -webkit-animation: buttonsSSTextAnim 5s forwards;
  -moz-animation: buttonsSSTextAnim 5s forwards;
  -o-animation: buttonsSSTextAnim 5s forwards;
  animation: buttonsSSTextAnim 5s forwards;
}

#buttonsSSText::before {
  content: "select";
  position: absolute;
  left: 45px;
  bottom: 15px;
  font: 7px "Arial";
  color: #606060;
}

#buttonsSSText::after {
  content: "start";
  position: absolute;
  left: 68px;
  bottom: 15px;
  font: 7px "Arial";
  color: #606060;
}

@-webkit-keyframes buttonsSSTextAnim {
  0%, 75% {
    visibility: hidden;
  }
  76%, 100% {
    bisibility: visible;
  }
}
@-moz-keyframes buttonsSSTextAnim {
  0%, 75% {
    visibility: hidden;
  }
  76%, 100% {
    bisibility: visible;
  }
}
@-ms-keyframes buttonsSSTextAnim {
  0%, 75% {
    visibility: hidden;
  }
  76%, 100% {
    bisibility: visible;
  }
}
@keyframes buttonsSSTextAnim {
  0%, 75% {
    visibility: hidden;
  }
  76%, 100% {
    bisibility: visible;
  }
}
#buttonsSSBack {
  position: absolute;
  left: 45px;
  bottom: 26px;
  width: 40px;
  height: 10px;
  background-color: #dddddd;
  -webkit-animation: buttonsSSBackAnim 5s forwards;
  -moz-animation: buttonsSSBackAnim 5s forwards;
  -o-animation: buttonsSSBackAnim 5s forwards;
  animation: buttonsSSBackAnim 5s forwards;
}

@-webkit-keyframes buttonsSSBackAnim {
  0%, 27% {
    left: 65px;
    bottom: 26px;
    width: 0px;
    height: 10px;
  }
  33%, 100% {
    left: 45px;
    bottom: 26px;
    width: 40px;
    height: 10px;
  }
}
@-moz-keyframes buttonsSSBackAnim {
  0%, 27% {
    left: 65px;
    bottom: 26px;
    width: 0px;
    height: 10px;
  }
  33%, 100% {
    left: 45px;
    bottom: 26px;
    width: 40px;
    height: 10px;
  }
}
@-ms-keyframes buttonsSSBackAnim {
  0%, 27% {
    left: 65px;
    bottom: 26px;
    width: 0px;
    height: 10px;
  }
  33%, 100% {
    left: 45px;
    bottom: 26px;
    width: 40px;
    height: 10px;
  }
}
@keyframes buttonsSSBackAnim {
  0%, 27% {
    left: 65px;
    bottom: 26px;
    width: 0px;
    height: 10px;
  }
  33%, 100% {
    left: 45px;
    bottom: 26px;
    width: 40px;
    height: 10px;
  }
}
#buttonsSS {
  position: absolute;
  border-radius: 2px;
  background-color: #484848;
  -webkit-animation: buttonsSSAnim 5s forwards;
  -moz-animation: buttonsSSAnim 5s forwards;
  -o-animation: buttonsSSAnim 5s forwards;
  animation: buttonsSSAnim 5s forwards;
}

@-webkit-keyframes buttonsSSAnim {
  0%, 34% {
    left: 52px;
    bottom: 31px;
    width: 0px;
    height: 0px;
    box-shadow: inset 0px 0px 0px 2px #a9a8a6, 20px 0px 0px -2px #484848, 26px 0px #a9a8a6;
  }
  41% {
    left: 45px;
    bottom: 29px;
    width: 14px;
    height: 4px;
    box-shadow: inset 0px 0px 0px 2px #a9a8a6, 20px 0px 0px -2px #484848, 26px 0px #a9a8a6;
  }
  44% {
    left: 48px;
    bottom: 29px;
    width: 14px;
    height: 4px;
    box-shadow: inset 0px 0px 0px 2px #a9a8a6, 20px 0px 0px -2px #484848, 20px 0px #a9a8a6;
  }
  49%, 100% {
    left: 48px;
    bottom: 29px;
    width: 14px;
    height: 4px;
    box-shadow: inset 0px 0px 0px 0px #a9a8a6, 20px 0px 0px 0px #484848, 20px 0px #a9a8a6;
  }
}
@-moz-keyframes buttonsSSAnim {
  0%, 34% {
    left: 52px;
    bottom: 31px;
    width: 0px;
    height: 0px;
    box-shadow: inset 0px 0px 0px 2px #a9a8a6, 20px 0px 0px -2px #484848, 26px 0px #a9a8a6;
  }
  41% {
    left: 45px;
    bottom: 29px;
    width: 14px;
    height: 4px;
    box-shadow: inset 0px 0px 0px 2px #a9a8a6, 20px 0px 0px -2px #484848, 26px 0px #a9a8a6;
  }
  44% {
    left: 48px;
    bottom: 29px;
    width: 14px;
    height: 4px;
    box-shadow: inset 0px 0px 0px 2px #a9a8a6, 20px 0px 0px -2px #484848, 20px 0px #a9a8a6;
  }
  49%, 100% {
    left: 48px;
    bottom: 29px;
    width: 14px;
    height: 4px;
    box-shadow: inset 0px 0px 0px 0px #a9a8a6, 20px 0px 0px 0px #484848, 20px 0px #a9a8a6;
  }
}
@-ms-keyframes buttonsSSAnim {
  0%, 34% {
    left: 52px;
    bottom: 31px;
    width: 0px;
    height: 0px;
    box-shadow: inset 0px 0px 0px 2px #a9a8a6, 20px 0px 0px -2px #484848, 26px 0px #a9a8a6;
  }
  41% {
    left: 45px;
    bottom: 29px;
    width: 14px;
    height: 4px;
    box-shadow: inset 0px 0px 0px 2px #a9a8a6, 20px 0px 0px -2px #484848, 26px 0px #a9a8a6;
  }
  44% {
    left: 48px;
    bottom: 29px;
    width: 14px;
    height: 4px;
    box-shadow: inset 0px 0px 0px 2px #a9a8a6, 20px 0px 0px -2px #484848, 20px 0px #a9a8a6;
  }
  49%, 100% {
    left: 48px;
    bottom: 29px;
    width: 14px;
    height: 4px;
    box-shadow: inset 0px 0px 0px 0px #a9a8a6, 20px 0px 0px 0px #484848, 20px 0px #a9a8a6;
  }
}
@keyframes buttonsSSAnim {
  0%, 34% {
    left: 52px;
    bottom: 31px;
    width: 0px;
    height: 0px;
    box-shadow: inset 0px 0px 0px 2px #a9a8a6, 20px 0px 0px -2px #484848, 26px 0px #a9a8a6;
  }
  41% {
    left: 45px;
    bottom: 29px;
    width: 14px;
    height: 4px;
    box-shadow: inset 0px 0px 0px 2px #a9a8a6, 20px 0px 0px -2px #484848, 26px 0px #a9a8a6;
  }
  44% {
    left: 48px;
    bottom: 29px;
    width: 14px;
    height: 4px;
    box-shadow: inset 0px 0px 0px 2px #a9a8a6, 20px 0px 0px -2px #484848, 20px 0px #a9a8a6;
  }
  49%, 100% {
    left: 48px;
    bottom: 29px;
    width: 14px;
    height: 4px;
    box-shadow: inset 0px 0px 0px 0px #a9a8a6, 20px 0px 0px 0px #484848, 20px 0px #a9a8a6;
  }
}
#screenBack {
  position: absolute;
  background-color: #dddddd;
  border-radius: 2px;
  -webkit-animation: screenBackAnim 5s forwards;
  -moz-animation: screenBackAnim 5s forwards;
  -o-animation: screenBackAnim 5s forwards;
  animation: screenBackAnim 5s forwards;
}

@-webkit-keyframes screenBackAnim {
  0%, 25% {
    left: 63px;
    bottom: 125px;
    width: 0px;
    height: 64px;
  }
  31%, 100% {
    left: 21px;
    bottom: 125px;
    width: 84px;
    height: 64px;
  }
}
@-moz-keyframes screenBackAnim {
  0%, 25% {
    left: 63px;
    bottom: 125px;
    width: 0px;
    height: 64px;
  }
  31%, 100% {
    left: 21px;
    bottom: 125px;
    width: 84px;
    height: 64px;
  }
}
@-ms-keyframes screenBackAnim {
  0%, 25% {
    left: 63px;
    bottom: 125px;
    width: 0px;
    height: 64px;
  }
  31%, 100% {
    left: 21px;
    bottom: 125px;
    width: 84px;
    height: 64px;
  }
}
@keyframes screenBackAnim {
  0%, 25% {
    left: 63px;
    bottom: 125px;
    width: 0px;
    height: 64px;
  }
  31%, 100% {
    left: 21px;
    bottom: 125px;
    width: 84px;
    height: 64px;
  }
}
#screen {
  position: absolute;
  background-color: #494949;
  border-radius: 4px 4px 10px 4px;
  -webkit-animation: screenAnim 5s forwards;
  -moz-animation: screenAnim 5s forwards;
  -o-animation: screenAnim 5s forwards;
  animation: screenAnim 5s forwards;
}

@-webkit-keyframes screenAnim {
  0%, 28% {
    left: 68px;
    bottom: 131px;
    width: 0px;
    height: 0px;
  }
  33%, 36% {
    left: 26px;
    bottom: 100px;
    width: 74px;
    height: 64px;
  }
  40%, 42% {
    left: 26px;
    bottom: 114px;
    width: 74px;
    height: 64px;
  }
  48%, 100% {
    left: 8px;
    bottom: 100px;
    width: 110px;
    height: 96px;
  }
}
@-moz-keyframes screenAnim {
  0%, 28% {
    left: 68px;
    bottom: 131px;
    width: 0px;
    height: 0px;
  }
  33%, 36% {
    left: 26px;
    bottom: 100px;
    width: 74px;
    height: 64px;
  }
  40%, 42% {
    left: 26px;
    bottom: 114px;
    width: 74px;
    height: 64px;
  }
  48%, 100% {
    left: 8px;
    bottom: 100px;
    width: 110px;
    height: 96px;
  }
}
@-ms-keyframes screenAnim {
  0%, 28% {
    left: 68px;
    bottom: 131px;
    width: 0px;
    height: 0px;
  }
  33%, 36% {
    left: 26px;
    bottom: 100px;
    width: 74px;
    height: 64px;
  }
  40%, 42% {
    left: 26px;
    bottom: 114px;
    width: 74px;
    height: 64px;
  }
  48%, 100% {
    left: 8px;
    bottom: 100px;
    width: 110px;
    height: 96px;
  }
}
@keyframes screenAnim {
  0%, 28% {
    left: 68px;
    bottom: 131px;
    width: 0px;
    height: 0px;
  }
  33%, 36% {
    left: 26px;
    bottom: 100px;
    width: 74px;
    height: 64px;
  }
  40%, 42% {
    left: 26px;
    bottom: 114px;
    width: 74px;
    height: 64px;
  }
  48%, 100% {
    left: 8px;
    bottom: 100px;
    width: 110px;
    height: 96px;
  }
}
#jackBack {
  position: absolute;
  background-color: #646060;
  -webkit-animation: jackBackAnim 5s forwards;
  -moz-animation: jackBackAnim 5s forwards;
  -o-animation: jackBackAnim 5s forwards;
  animation: jackBackAnim 5s forwards;
}

@-webkit-keyframes jackBackAnim {
  0%, 21% {
    left: 11px;
    bottom: 136px;
    width: 0px;
    height: 0px;
  }
  25%, 31% {
    left: 6px;
    bottom: 132px;
    width: 12px;
    height: 12px;
  }
  36%, 100% {
    left: 6px;
    bottom: 138px;
    width: 12px;
    height: 12px;
  }
}
@-moz-keyframes jackBackAnim {
  0%, 21% {
    left: 11px;
    bottom: 136px;
    width: 0px;
    height: 0px;
  }
  25%, 31% {
    left: 6px;
    bottom: 132px;
    width: 12px;
    height: 12px;
  }
  36%, 100% {
    left: 6px;
    bottom: 138px;
    width: 12px;
    height: 12px;
  }
}
@-ms-keyframes jackBackAnim {
  0%, 21% {
    left: 11px;
    bottom: 136px;
    width: 0px;
    height: 0px;
  }
  25%, 31% {
    left: 6px;
    bottom: 132px;
    width: 12px;
    height: 12px;
  }
  36%, 100% {
    left: 6px;
    bottom: 138px;
    width: 12px;
    height: 12px;
  }
}
@keyframes jackBackAnim {
  0%, 21% {
    left: 11px;
    bottom: 136px;
    width: 0px;
    height: 0px;
  }
  25%, 31% {
    left: 6px;
    bottom: 132px;
    width: 12px;
    height: 12px;
  }
  36%, 100% {
    left: 6px;
    bottom: 138px;
    width: 12px;
    height: 12px;
  }
}
#jack {
  position: absolute;
  background-color: #494949;
  border-radius: 7px;
  -webkit-animation: jackAnim 5s forwards;
  -moz-animation: jackAnim 5s forwards;
  -o-animation: jackAnim 5s forwards;
  animation: jackAnim 5s forwards;
}

@-webkit-keyframes jackAnim {
  0%, 23% {
    left: 6px;
    bottom: 135px;
    width: 0px;
    height: 0px;
  }
  27%, 31% {
    left: 1px;
    bottom: 131px;
    width: 14px;
    height: 14px;
  }
  36%, 100% {
    left: 1px;
    bottom: 137px;
    width: 14px;
    height: 14px;
  }
}
@-moz-keyframes jackAnim {
  0%, 23% {
    left: 6px;
    bottom: 135px;
    width: 0px;
    height: 0px;
  }
  27%, 31% {
    left: 1px;
    bottom: 131px;
    width: 14px;
    height: 14px;
  }
  36%, 100% {
    left: 1px;
    bottom: 137px;
    width: 14px;
    height: 14px;
  }
}
@-ms-keyframes jackAnim {
  0%, 23% {
    left: 6px;
    bottom: 135px;
    width: 0px;
    height: 0px;
  }
  27%, 31% {
    left: 1px;
    bottom: 131px;
    width: 14px;
    height: 14px;
  }
  36%, 100% {
    left: 1px;
    bottom: 137px;
    width: 14px;
    height: 14px;
  }
}
@keyframes jackAnim {
  0%, 23% {
    left: 6px;
    bottom: 135px;
    width: 0px;
    height: 0px;
  }
  27%, 31% {
    left: 1px;
    bottom: 131px;
    width: 14px;
    height: 14px;
  }
  36%, 100% {
    left: 1px;
    bottom: 137px;
    width: 14px;
    height: 14px;
  }
}
#screen2 {
  position: absolute;
  background-color: #b7b28f;
  border-radius: 2px;
  -webkit-animation: screen2Anim 5s forwards;
  -moz-animation: screen2Anim 5s forwards;
  -o-animation: screen2Anim 5s forwards;
  animation: screen2Anim 5s forwards;
}

@-webkit-keyframes screen2Anim {
  0%, 44% {
    left: 59px;
    bottom: 151px;
    width: 0px;
    height: 0px;
  }
  48% {
    left: 54px;
    bottom: 146px;
    width: 10px;
    height: 10px;
  }
  52% {
    left: 22px;
    bottom: 146px;
    width: 80px;
    height: 10px;
  }
  60%, 100% {
    left: 22px;
    bottom: 112px;
    width: 80px;
    height: 74px;
  }
}
@-moz-keyframes screen2Anim {
  0%, 44% {
    left: 59px;
    bottom: 151px;
    width: 0px;
    height: 0px;
  }
  48% {
    left: 54px;
    bottom: 146px;
    width: 10px;
    height: 10px;
  }
  52% {
    left: 22px;
    bottom: 146px;
    width: 80px;
    height: 10px;
  }
  60%, 100% {
    left: 22px;
    bottom: 112px;
    width: 80px;
    height: 74px;
  }
}
@-ms-keyframes screen2Anim {
  0%, 44% {
    left: 59px;
    bottom: 151px;
    width: 0px;
    height: 0px;
  }
  48% {
    left: 54px;
    bottom: 146px;
    width: 10px;
    height: 10px;
  }
  52% {
    left: 22px;
    bottom: 146px;
    width: 80px;
    height: 10px;
  }
  60%, 100% {
    left: 22px;
    bottom: 112px;
    width: 80px;
    height: 74px;
  }
}
@keyframes screen2Anim {
  0%, 44% {
    left: 59px;
    bottom: 151px;
    width: 0px;
    height: 0px;
  }
  48% {
    left: 54px;
    bottom: 146px;
    width: 10px;
    height: 10px;
  }
  52% {
    left: 22px;
    bottom: 146px;
    width: 80px;
    height: 10px;
  }
  60%, 100% {
    left: 22px;
    bottom: 112px;
    width: 80px;
    height: 74px;
  }
}
#box {
  position: absolute;
  background-color: #5f98c6;
  border-radius: 3px 3px 20px 3px;
  height: 206px;
  width: 125px;
  bottom: 0px;
  -webkit-animation: boxAnim 5s forwards;
  -moz-animation: boxAnim 5s forwards;
  -o-animation: boxAnim 5s forwards;
  animation: boxAnim 5s forwards;
}

@-webkit-keyframes boxAnim {
  0%, 67% {
    height: 0px;
    width: 125px;
    bottom: 206px;
  }
  80%, 100% {
    height: 206px;
    width: 125px;
    bottom: 0px;
  }
}
@-moz-keyframes boxAnim {
  0%, 67% {
    height: 0px;
    width: 125px;
    bottom: 206px;
  }
  80%, 100% {
    height: 206px;
    width: 125px;
    bottom: 0px;
  }
}
@-ms-keyframes boxAnim {
  0%, 67% {
    height: 0px;
    width: 125px;
    bottom: 206px;
  }
  80%, 100% {
    height: 206px;
    width: 125px;
    bottom: 0px;
  }
}
@keyframes boxAnim {
  0%, 67% {
    height: 0px;
    width: 125px;
    bottom: 206px;
  }
  80%, 100% {
    height: 206px;
    width: 125px;
    bottom: 0px;
  }
}
#gameboyText {
  position: absolute;
  left: 23px;
  bottom: 103px;
  height: 6px;
  width: 50px;
  color: #b7b28f;
  clip: rect(0px, 0px, 0px, 0px);
  -webkit-animation: gameboyTextAnim 5s forwards;
  -moz-animation: gameboyTextAnim 5s forwards;
  -o-animation: gameboyTextAnim 5s forwards;
  animation: gameboyTextAnim 5s forwards;
}

@-webkit-keyframes gameboyTextAnim {
  0%, 55% {
    clip: rect(0px, 0px, 7px, 0px);
  }
  60%, 100% {
    clip: rect(0px, 50px, 6px, 0px);
  }
}
@-moz-keyframes gameboyTextAnim {
  0%, 55% {
    clip: rect(0px, 0px, 7px, 0px);
  }
  60%, 100% {
    clip: rect(0px, 50px, 6px, 0px);
  }
}
@-ms-keyframes gameboyTextAnim {
  0%, 55% {
    clip: rect(0px, 0px, 7px, 0px);
  }
  60%, 100% {
    clip: rect(0px, 50px, 6px, 0px);
  }
}
@keyframes gameboyTextAnim {
  0%, 55% {
    clip: rect(0px, 0px, 7px, 0px);
  }
  60%, 100% {
    clip: rect(0px, 50px, 6px, 0px);
  }
}
#powerBack {
  position: absolute;
  background-color: #494949;
  width: 15px;
  height: 9px;
  left: 6px;
  bottom: 197px;
  -webkit-animation: powerBackAnim 5s forwards;
  -moz-animation: powerBackAnim 5s forwards;
  -o-animation: powerBackAnim 5s forwards;
  animation: powerBackAnim 5s forwards;
}

@-webkit-keyframes powerBackAnim {
  0%, 23% {
    height: 0px;
  }
  30%, 100% {
    height: 9px;
  }
}
@-moz-keyframes powerBackAnim {
  0%, 23% {
    height: 0px;
  }
  30%, 100% {
    height: 9px;
  }
}
@-ms-keyframes powerBackAnim {
  0%, 23% {
    height: 0px;
  }
  30%, 100% {
    height: 9px;
  }
}
@keyframes powerBackAnim {
  0%, 23% {
    height: 0px;
  }
  30%, 100% {
    height: 9px;
  }
}
#power {
  position: absolute;
  background-color: #494949;
  border-radius: 4px 4px 0px 0px / 2px 2px 0px 0px;
  width: 8px;
  height: 6px;
  visibility: visible;
  -webkit-animation: powerAnim 5s forwards;
  -moz-animation: powerAnim 5s forwards;
  -o-animation: powerAnim 5s forwards;
  animation: powerAnim 5s forwards;
}

@-webkit-keyframes powerAnim {
  0%, 42% {
    visibility: hidden;
    left: 9px;
    bottom: 197px;
  }
  43% {
    visibility: visible;
    left: 9px;
    bottom: 197px;
  }
  46%, 90% {
    visibility: visible;
    left: 9px;
    bottom: 202px;
  }
  92%, 100% {
    visibility: visible;
    left: 15px;
    bottom: 202px;
  }
}
@-moz-keyframes powerAnim {
  0%, 42% {
    visibility: hidden;
    left: 9px;
    bottom: 197px;
  }
  43% {
    visibility: visible;
    left: 9px;
    bottom: 197px;
  }
  46%, 90% {
    visibility: visible;
    left: 9px;
    bottom: 202px;
  }
  92%, 100% {
    visibility: visible;
    left: 15px;
    bottom: 202px;
  }
}
@-ms-keyframes powerAnim {
  0%, 42% {
    visibility: hidden;
    left: 9px;
    bottom: 197px;
  }
  43% {
    visibility: visible;
    left: 9px;
    bottom: 197px;
  }
  46%, 90% {
    visibility: visible;
    left: 9px;
    bottom: 202px;
  }
  92%, 100% {
    visibility: visible;
    left: 15px;
    bottom: 202px;
  }
}
@keyframes powerAnim {
  0%, 42% {
    visibility: hidden;
    left: 9px;
    bottom: 197px;
  }
  43% {
    visibility: visible;
    left: 9px;
    bottom: 197px;
  }
  46%, 90% {
    visibility: visible;
    left: 9px;
    bottom: 202px;
  }
  92%, 100% {
    visibility: visible;
    left: 15px;
    bottom: 202px;
  }
}
#powerLed {
  position: absolute;
  background-color: #202020;
  border-radius: 2px;
  width: 4px;
  height: 4px;
  left: 10px;
  bottom: 180px;
  -webkit-animation: powerLedAnim 5s forwards;
  -moz-animation: powerLedAnim 5s forwards;
  -o-animation: powerLedAnim 5s forwards;
  animation: powerLedAnim 5s forwards;
}

@-webkit-keyframes powerLedAnim {
  0%, 49% {
    width: 0px;
    height: 0px;
    left: 12px;
    bottom: 172px;
  }
  52%, 91% {
    background-color: #202020;
    width: 4px;
    height: 4px;
    left: 10px;
    bottom: 170px;
  }
  92%, 100% {
    background-color: red;
    width: 4px;
    height: 4px;
    left: 10px;
    bottom: 170px;
  }
}
@-moz-keyframes powerLedAnim {
  0%, 49% {
    width: 0px;
    height: 0px;
    left: 12px;
    bottom: 172px;
  }
  52%, 91% {
    background-color: #202020;
    width: 4px;
    height: 4px;
    left: 10px;
    bottom: 170px;
  }
  92%, 100% {
    background-color: red;
    width: 4px;
    height: 4px;
    left: 10px;
    bottom: 170px;
  }
}
@-ms-keyframes powerLedAnim {
  0%, 49% {
    width: 0px;
    height: 0px;
    left: 12px;
    bottom: 172px;
  }
  52%, 91% {
    background-color: #202020;
    width: 4px;
    height: 4px;
    left: 10px;
    bottom: 170px;
  }
  92%, 100% {
    background-color: red;
    width: 4px;
    height: 4px;
    left: 10px;
    bottom: 170px;
  }
}
@keyframes powerLedAnim {
  0%, 49% {
    width: 0px;
    height: 0px;
    left: 12px;
    bottom: 172px;
  }
  52%, 91% {
    background-color: #202020;
    width: 4px;
    height: 4px;
    left: 10px;
    bottom: 170px;
  }
  92%, 100% {
    background-color: red;
    width: 4px;
    height: 4px;
    left: 10px;
    bottom: 170px;
  }
}
#speakerFilter {
  position: absolute;
  background-color: #555;
  border-radius: 2px;
  width: 4px;
  height: 4px;
  left: 95px;
  bottom: 20px;
  visibility: visible;
  box-shadow: 3px -3px #555, 6px -6px #555, 9px -9px #555, 0px 6px #555,3px 3px #555, 6px 0px #555, 9px -3px #555, 12px -6px #555, 15px -9px #555, 3px 9px #555, 6px 6px #555, 9px 3px #555, 12px 0px #555, 15px -3px #555, 18px -6px #555, 9px 9px #555, 12px 6px #555, 15px 3px #555, 18px 0px #555;
  -webkit-animation: speakerFilterAnim 5s forwards;
  -moz-animation: speakerFilterAnim 5s forwards;
  -o-animation: speakerFilterAnim 5s forwards;
  animation: speakerFilterAnim 5s forwards;
}

@-webkit-keyframes speakerFilterAnim {
  0%, 75% {
    visibility: hidden;
  }
  76%, 100% {
    visibility: visible;
  }
}
@-moz-keyframes speakerFilterAnim {
  0%, 75% {
    visibility: hidden;
  }
  76%, 100% {
    visibility: visible;
  }
}
@-ms-keyframes speakerFilterAnim {
  0%, 75% {
    visibility: hidden;
  }
  76%, 100% {
    visibility: visible;
  }
}
@keyframes speakerFilterAnim {
  0%, 75% {
    visibility: hidden;
  }
  76%, 100% {
    visibility: visible;
  }
}


</style>
