// .vuepress/config.js

const { path } = require("@vuepress/utils");
const markdownRawPlugin = require('vite-raw-plugin');

module.exports = {
    plugins: [
        ['@vuepress/plugin-shiki', { 'langs': ['asm'] }],
    ],
    title: 'gbdev',
    description: 'game boy development scene',
    head: [
        ['link', { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicons/favicon-32x32.png" }],
        ['link', { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicons/favicon-16x16.png" }],
        // Default meta values, frontmatter the pages will overwrite this
        ['meta', { property: 'og:site_name', content: 'gbdev.io' }],
        ['meta', { name: 'twitter:card', content: 'summary' }],
        ['meta', { name: 'twitter:site', content: '@gbdev0' }],
        ['meta', { name: 'og:image', content : 'https://gbdev.io/images/gbinternals.png'}]
    ],
    //base: "/list",
    themeConfig: {
        lastUpdated: false,
        contributors: false,
        editLink: true,
        docsRepo: "https://github.com/gbdev/gbdev.github.io",
        docsBranch: "dev",
        docsDir: "website",
        navbar: [
            { link: 'https://www.getrevue.co/profile/gbdev', text: 'Newsletter' },
            {
                text: 'Community',
                link: '/',
                collapsable: false,
                sidebarDepth: 1,
                children: [
                    { link: '/chat', text: 'Chat' },
                    { link: '/contribute', text: 'Contribute' },
                    {
                        link: '/gbcompo21',
                        text: 'GB Competition 2021',
                    }
                ]
            },
            { link: '/resources', text: 'Resources' },
            {
                text: 'Guides',
                children: [
                    { link: '/guides/tools', text: 'Choosing development tools' },
                    { link: '/guides/asmstyle', text: 'ASM Style recomendations' },
                    { link: '/guides/lyc_timing', text: 'The Timing of LYC STAT Handlers' },
                    { link: '/guides/deadcscroll', text: 'Dead C Scroll' },
                    { link: '/guides/dma_hijacking', text: 'DMA Hijacking' },
                    { link: 'https://eldred.fr/gb-asm-tutorial', text: 'GB ASM Programming Guide' }
                ]
            }
        ]
    },

    bundler: '@vuepress/bundler-vite',
    bundlerConfig: {
        viteOptions: {
            plugins: [
                markdownRawPlugin({ fileRegex: /\.asm$/ }),
            ],
            resolve: {
                alias: {
                    '@': __dirname, // Alias to the `.vuepress` folder
                },
            },
        },
    },
}
