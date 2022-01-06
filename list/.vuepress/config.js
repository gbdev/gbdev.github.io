// .vuepress/config.js
module.exports = {
      plugins: [
    ['@vuepress/plugin-shiki', {'langs': ['asm']}],
  ],
  	title: 'gbdev',
    description: 'game boy development scene',
    head: [
      ['link', { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicons/favicon-32x32.png"}],
      ['link', { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicons/favicon-16x16.png"}],
    ],
 //base: "/list",
  themeConfig: {
    contributors: false,
    sidebar: [
      {
        text: 'Community',
        link: '/',
        collapsable: false,
        sidebarDepth: 1,
        children: [
          {link: '/chat', text: 'Chat'},
          {link: '/contribute', text: 'Contribute'},
        ]
      },
      { link: 'https://itch.io/jam/gbcompo21', text:'gb compo 2021'},
      { link: '/list', text: 'Resources'},
      {
        text: 'Guides', 
        collapsable: false,
        sidebarDepth: 1,
        children: [
          { link: '/guides/tools', text:'Choosing development tools'},
          { link: '/guides/asmstyle', text:'ASM Style recomendations'},
          { link: '/guides/lyc_timing', text:'The Timing of LYC STAT Handlers'},
          { link: '/guides/dma_hijacking', text:'DMA Hijacking'},
          { link: 'https://eldred.fr/gb-asm-tutorial', text:'GB ASM Programming Guide'}
        ]
      }
      ],
      navbar: [
      { text: 'Patreon', link: 'https://www.patreon.com/gbdev01' },
      { text: 'OpenCollective', link: 'https://opencollective.com/gbdev/'}
    ]
  }
}
