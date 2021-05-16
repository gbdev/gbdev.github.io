// .vuepress/config.js
module.exports = {
  	title: 'gbdev',
    description: 'game boy development scene',
    head: [
      ['link', { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicons/favicon-32x32.png"}],
      ['link', { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicons/favicon-16x16.png"}],
    ],
 //base: "/list",
  themeConfig: {
    sidebar: [
      {
        title: 'Community',
        path: '/',
        collapsable: false,
        sidebarDepth: 1,
        children: [
          ['/chat', 'Chat'],
          ['/contribute', 'Contribute'],
        ]
      },
      ['/list', 'Resources'],
      {
        title: 'Guides', 
        //path: '/foo/', 
        collapsable: false,
        sidebarDepth: 1,
        children: [
          ['/guides/tools', 'Choosing development tools'],
          ['/guides/asmstyle', 'ASM Style recomendations'],
          ['https://eldred.fr/gb-asm-tutorial', 'GB ASM Programming Guide']
        ]
      },],
      sidebarDepth: 2,
      nav: [
      { text: 'GitHub', link: 'https://github.com/gbdev' },
      { text: 'Patreon', link: 'https://www.patreon.com/gbdev01' },
      { text: 'OpenCollective', link: 'https://opencollective.com/gbdev/'}
    ]
  }
}
