// .vuepress/config.js
module.exports = {
  	title: 'gbdev',
 base: "/list",
  themeConfig: {
    sidebar: [
      ['/', 'Home'],
      ['/list', 'Awesome list'],
      ['/contribute', 'Contribute']],
       sidebarDepth: 2,
        nav: [
      { text: 'Github', link: 'https://github.com/gbdev' },
      { text: 'Discord chat', link: 'https://discordapp.com/invite/gpBxq85' },
    ]
  }
}
