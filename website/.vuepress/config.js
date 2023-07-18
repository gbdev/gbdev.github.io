// .vuepress/config.js

//const { path } = require("@vuepress/utils");

import markdownRawPlugin from "vite-raw-plugin";
import { defaultTheme } from "vuepress";
import { viteBundler } from "vuepress";
import shiki from "vuepress-plugin-shiki";

module.exports = {
  plugins: [shiki({ langs: ["asm"] })],
  title: "gbdev.io",
  description: "game boy development scene",
  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicons/favicon-32x32.png",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicons/favicon-16x16.png",
      },
    ],
    // Default meta values, frontmatter the pages will overwrite this
    ["meta", { property: "og:site_name", content: "gbdev.io" }],
    ["meta", { name: "twitter:card", content: "summary" }],
    ["meta", { name: "twitter:site", content: "@gbdev0" }],
    [
      "meta",
      { name: "og:image", content: "https://gbdev.io/images/gbinternals.png" },
    ],
  ],
  //base: "/list",
  theme: defaultTheme({
    lastUpdated: false,
    contributors: false,
    editLink: true,
    docsRepo: "https://github.com/gbdev/gbdev.github.io",
    docsBranch: "dev",
    docsDir: "website",
    footer: "test",
    navbar: [
      { link: "/gbcompo23", text: "GB Compo 2023" },
      { link: "https://hh.gbdev.io", text: "Games" },
      { link: "https://gbdev.io/pandocs", text: "Pan Docs" },
      {
        text: "Community",
        link: "/",
        collapsable: false,
        sidebarDepth: 1,
        children: [
          { link: "/chat", text: "Chat" },
          { link: "/contribute", text: "Contribute" },
          {
            link: "/gbcompo21",
            text: "GB Competition 2021",
          },
        ],
      },
      { link: "/resources", text: "Resources" },
      {
        text: "Guides",
        children: [
          { link: "/guides/tools", text: "Choosing development tools" },
          { link: "/guides/asmstyle", text: "ASM Style recomendations" },
          {
            link: "/guides/lyc_timing",
            text: "The Timing of LYC STAT Handlers",
          },
          { link: "/guides/deadcscroll", text: "Dead C Scroll" },
          {
            link: "https://eldred.fr/blog/2022/05/22/prehistorik",
            text: "The wonders of Prehistorik Man",
          },
          { link: "/guides/dma_hijacking", text: "DMA Hijacking" },
          { link: "/guides/border", text: "Adding SGB Borders" },
        ],
      },
    ],
  }),

  bundler: viteBundler({
    viteOptions: {
      plugins: [markdownRawPlugin({ fileRegex: /\.asm$/ })],
      resolve: {
        alias: {
          "@": __dirname, // Alias to the `.vuepress` folder
        },
      },
    },
  }),
};
