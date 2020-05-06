#!/bin/bash

npx vuepress build list
cp list/.vuepress/dist/* dist/ -r
cp CNAME dist/
npx gh-pages -d dist -b master 
