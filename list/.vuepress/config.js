// .vuepress/config.js
module.exports = {
  	title: 'gbdev',
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
