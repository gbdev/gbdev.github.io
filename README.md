# front

Source repository of the gbdev landing website. GitHub pages hosts the contents of the folder `docs/` (where we put the webpack build) on `gbdev.github.io/front`. `gbdev.github.io` redirects to `gbdev.github.io/front`.

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

To build:

```bash
# Run the webpack production build
npm run build-prod
# Move the result into the docs folder, so GitHub pages will see it
mv dist/ docs/
```

Webpack config was written from zero, so it still misses a lot of things.
