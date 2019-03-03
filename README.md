# gbdev landing page

Source repository of the gbdev landing website. GitHub Pages serves the content of the `master` branch on [gbdev.github.io](https://gbdev.github.io). 

> Development is done on the `dev` branch due to GitHub's restriction on branches for user pages.

Tools:

- Stylesheet language: [Stylus](http://stylus-lang.com/)
- CSS framework: [Bulma](https://bulma.io/)
- Module bundler: [Webpack](https://webpack.js.org/)

To work on the project:

```bash
git clone https://github.com/gbdev/front
# Dependencies
npm install
# Run the development server with hot reload
npm run dev
```

Live at [localhost:8080](http://localhost:8080).


Production build:
```bash
npm run build-prod
```

Serve the production build:
```bash
# Run the webpack production build, then serve on a local http-server with gzip on http://localhost:8080
npm run serve-prod
```

To deploy onto the master branch:
```bash
# Run the webpack production build, then place dist/ folder on the master branch
npm run deploy
```

Webpack config was written from zero, so it still misses a lot of things.

## awesome list render

The awesome gbdev list web version is powered by VuePress. It's under the 

Build and deploy:
```
npx vuepress build list/
cp list/.vuepress/dist/* dist/list -R
npx gh-pages -d dist -b master
```