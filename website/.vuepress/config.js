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
    ['script', {}, `
        var _paq = window._paq = window._paq || [];
        /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
        (function() {
          var u="//stats.gbdev.io/";
          _paq.push(['setTrackerUrl', u+'matomo.php']);
          _paq.push(['setSiteId', '1']);
          var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
          g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
        })();
    `],
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
      { link: "/resources", text: "Resources" },
      {
        text: "Events",
        link: "/",
        collapsable: false,
        sidebarDepth: 1,
        children: [
          {
            link: "/gbcompo23",
            text: "GB Competition 2023",
          },
          {
            link: "/gbcompo21",
            text: "GB Competition 2021",
          },
        ],
      },
      {
        text: "Projects",
        link: "/",
        collapsable: false,
        sidebarDepth: 1,
        children: [
          { link: "https://hh.gbdev.io", text: "Homebrew Hub" },
          { link: "https://gbdev.io/pandocs", text: "Pan Docs" },
          { link: "https://gbdev.io/gb-asm-tutorial", text: "GB ASM Tutorial" },
          { link: "https://rgbds.gbdev.io/", text: "RGBDS" },
        ],
      },
      {
        text: "Community",
        link: "/",
        collapsable: false,
        sidebarDepth: 1,
        children: [
          { link: "/chat", text: "Chat channels" },
          { link: "/meetings", text: "Meetings minutes" },
          { link: "/donate", text: "Donations and Bounties" },
          { link: "/contributing", text: "Contribution Guidelines" },
          { link: "/newsletter", text: "Newsletter" },
        ],
      },
      {
        text: "Guides",
        children: [
          { link: "/guides/tools", text: "Choosing development tools" },
          { link: "/guides/asmstyle", text: "ASM Style recomendations" },
          {
            link: "/guides/lyc_timing",
            text: "The Timing of LYC STAT Handlers",
          },
          {
            link: "https://evie.gbdev.io/resources/interrupts.html",
            text: "Interrupts tutorial"
          },
          { link: "/guides/deadcscroll", text: "Dead C Scroll" },
          {
            link: "https://eldred.fr/blog/2022/05/22/prehistorik",
            text: "The wonders of Prehistorik Man",
          },
          { link: "/guides/dma_hijacking", text: "DMA Hijacking" },
          { link: "/guides/sgb_border", text: "Adding a custom SGB border" },
        ],
      },
      { link: "https://opencollective.com/gbdev", text: "Donate" },
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
