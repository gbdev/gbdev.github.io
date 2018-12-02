# Gbdev Landing Page

Source repository of the gbdev landing website. GitHub pages hosts the contents of the `master` branch which is then hoster on `gbdev.github.io`. Development is done on the `dev` branch due to Github's resctrition on branches for user pages.

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

To build production:

```bash
# Run the webpack production build
npm run build-prod
```

To serve a production copy:

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
