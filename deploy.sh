#!/bin/bash
vuepress build list
cp list/.vuepress/dist/* dist/ -r  
npx gh-pages -d dist -b master 