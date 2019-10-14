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
      ['/', 'Community'],
      ['/list', 'Resources'],
      ['/to_c_or_not_to_c', 'To C or not to C'],
      ['/contribute', 'Contribute']],
       sidebarDepth: 2,
        nav: [
      { text: 'GitHub', link: 'https://github.com/gbdev' },
      { text: 'Discord chat', link: 'https://discordapp.com/invite/gpBxq85' },
      { text: 'Homebrew Games', link: 'https://gbhh.avivace.com'}
    ]
  }
}
