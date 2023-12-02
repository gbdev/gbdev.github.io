# Contribution guidelines

These base guidelines (if not specified otherwise) apply to every repository under the [**gbdev**](https://github.com/gbdev/) github organisation. The specific CONTRIBUTING rules of the repository in object also apply. In case of conflicts, those last ones have the priority.

## General

- If you are unsure about anything or need guidance, you can always reach out the maintainers on [Discord or IRC](https://gbdev.io/chat.html).

## Issues

- Provide an example to reproduce the problem in isolation. This should include no private code. The example should be self-runnable. If a snippet is too small, create a repository.
- Unless the problem is visual, do not include screenshots. They are not helpful.
- Please be patient. You are probably frustrated by your problem - the maintainers are likely not aware of your workflow.
- Be grateful for any help you are getting and follow through. The maintainers are likely giving you support for free.
- Informal conversations are great (e.g. on Discord), but once a problem, feature request etc is outlined, opening an issue formalizing it is the most important thing you can do to help this information flow.
  - Open an issue in the related repository. If you don't know where it's better suited, [ask for help](https://gbdev.io/chat.html).
  - Include context and any information useful to understand the situation. Don't be scared about doing something wrong or _not good enough_, maintainers will follow up if needed.

## Pull Requests

- Keep titles and commit messages brief and concise.
- If the PR is not self-explanatory, add brief description of what has been done and implementation choices (if any).
- Keep the work in the branch focused and directed at accomplishing _only_ what you are describing in the PR. Ideally a PR should address a single issue (or a set of assimilable ones).
- PRs require commitment and they are an investment by the (volunteer) maintainers. If you don't have time or abandon the PR after reviews have been left and additional changes are needed, other maintainers may take over to make sure the PR can move forward and the work is not lost.
- Maintainers may chime in and commit to your feature branch on minor fixes (or suggestions agreed upon).
- Don't be scared of opening more PRs for the same task, if they can be logically divided. The smaller the changes, the faster they can get reviewed and eventually merged.
- When adding new features, think about tests and possibly updating documentation. Think about other parts of the project which may be affected by the change.
- Document trade-offs, risks, implementation and design choices, if any.

## Maintainers workflow

- Tests and pipelines must pass. If they failed because of something unrelated to the PR (e.g. a link died in the meantime), mention it in the PR thread.
- If the solution is "sub-optimal" (but still better than the actual implementation) and there are clear possible improvements, mention them and try to collaborate with the contributor, but ultimately prefer merging something sub-optimal than keeping the content stale/inactive. An issue can be opened (or kept opened) to report this situation.

For disruptive PRs:

- Wait for 2\* maintainers approval
- Every week of inactivity/staleness, ping maintainers
- After **5** weeks from last activity, PR is merge-able with only 1 maintainer approval

For non-disruptive PRs:

- Wait for 1 maintainer approval and merge it after 5 days
- If a maintainer wants to put a veto and to make the PR wait for his/her input after the mentioned period, the "veto" label can be used

\*if there are at least 2 active maintainers, otherwise 1.

## References

[1](https://twitter.com/matteocollina/status/1359087694375174145)

## Where can I help?

Here's a list of the project in most need of help:

### GB ASM Tutorial

If you're confident in writing assembly, we need contributors in helping us write, proofread and suggest improvements for new lessons in the tutorial.

Technologies and tools: Assembly, RGBDS, Rust, mdBook.

[Homepage](https://gbdev.io/gb-asm-tutorial) - [Repository](https://github.com/gbdev/gb-asm-tutorial)

### Pan Docs

The single, most comprehensive technical reference to Game Boy available to the public. Here, you can help adding new content, proof reading, fixing typos, preparing updated versions of figures or port new content from old resources.

Technologies and tools: Markdown, Rust, Python, mdBook.

[Homepage](https://gbdev.io/pandocs/) - [Repository](https://github.com/gbdev/pandocs) - [Beginner issues](https://github.com/gbdev/pandocs/issues?q=is%3Aissue+is%3Aopen+label%3AHacktoberfest)

### RGBDS

The de-facto standard assembly toolchain for the Nintendo Game Boy & Game Boy Color.

Technologies and tools: C, C++, Assembly, Rust

[Homepage](https://rgbds.gbdev.io/) - [Repository](https://github.com/gbdev/rgbds) - [Beginner issues](https://github.com/gbdev/rgbds/issues?q=is%3Aissue+is%3Aopen+label%3Ahacktoberfest)

### Homebrew Hub

A community-led attempt to collect, archive and save every unofficial game, homebrew, patch, hackrom for Game Boy produced by the community through decades of passionate work.

Technologies and tools:

- Frontend: Vue JS 3, Nuxt 3
- Backend: Django REST

[Homepage](https://hh.gbdev.io/) - [Repository (backend)](https://github.com/gbdev/homebrewhub) - [Repository (frontend)](https://github.com/gbdev/virens)

### Homebrew Hub Database

This is the database of games powering the main Homebrew Hub project. Find a game (we have a lot to add!) and add it with a Pull Request. Or - even better - write scrapers to dump entire sources and add them to our repository!

Technologies and tools: JSON Schema, Python, Javascript, BeautifulSoup

[Homepage](https://hh.gbdev.io/) - [Repository](https://github.com/gbdev/database) - [Beginner issues](https://github.com/gbdev/database/issues?q=is%3Aissue+is%3Aopen+label%3AHacktoberfest)
