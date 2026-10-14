# Contributing

## Resources page

`website/resources.md` (served at [gbdev.io/resources](https://gbdev.io/resources)) is not committed: it's generated from the [awesome-gbdev](https://github.com/gbdev/awesome-gbdev) README by `yarn build-resources`. The website-only top of the page (front matter, videos, notes) lives in [`scripts/resources/header.md`](scripts/resources/header.md), and everything between the `<!-- gbdev.io:begin body -->` and `<!-- gbdev.io:end body -->` markers of the awesome-gbdev README is appended to it.

By default the README is fetched from the master branch of awesome-gbdev. Run this before `yarn dev`, and again whenever you want to pull in changes to the list (requires Node 18 or later):

```bash
# From the master branch of awesome-gbdev
yarn build-resources

# From a specific branch, tag or commit
yarn build-resources 0c457e7833cd22985976dc0eecc859919ae589b0

# From a local copy of the README (e.g. to preview changes to the list md)
yarn build-resources ../awesome-gbdev/README.md
```

`yarn build` runs `yarn build-resources` automatically before building. By default (when `RESOURCES_MD_SRC` is not set) the script fetches the README from the master branch of awesome-gbdev on GitHub by itself, so deployed builds always use the current list. To build from another source instead, set the `RESOURCES_MD_SRC` environment variable to any of the values accepted by `yarn build-resources` (a branch, tag, commit or local path):

```bash
# Fetches the README from awesome-gbdev master
yarn build

# Uses a local copy of the README instead
RESOURCES_MD_SRC=../awesome-gbdev/README.md yarn build
```

## CI

The website is rebuilt and deployed on every push to `dev`, and also whenever the awesome-gbdev README changes: awesome-gbdev sends an `awesome-gbdev-updated` [`repository_dispatch`](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#repository_dispatch) event to this repository, which runs the deploy workflow. To do so, awesome-gbdev holds a fine-grained token with access to this repository (Contents: read and write): if it expires or is revoked, the resources page stops updating until the next push here. How the event is sent is documented in the [awesome-gbdev CONTRIBUTING.md](https://github.com/gbdev/awesome-gbdev/blob/master/CONTRIBUTING.md). A deploy may also be started manually from the Actions tab ("Run workflow").
