# gbdev landing page

Source repository of the gbdev landing website. GitHub Pages serves the content of the `master` branch on [gbdev.github.io](https://gbdev.github.io). 

> Development is done on the `dev` branch due to GitHub's restriction on branches for user pages.

Build and deploy:
```
npx vuepress build list/
cp list/.vuepress/dist/* dist/list -R
npx gh-pages -d dist -b master
```
