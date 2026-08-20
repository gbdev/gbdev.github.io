# AI Coding Assistants

This document provides guidance for AI tools and developers using AI
assistance when contributing to gbdev ([github.com/gbdev](https://github.com/gbdev)) projects.

This is the **generic, gbdev-wide** AI policy. Individual projects under the gbdev umbrella may define their own policy, which takes precedence over this document; when present, such project-specific policies can be found in the repository's `CONTRIBUTING.md` (except for the attribution/disclosure requirement below, which is mandatory and cannot be overridden).

::: tip Policy

**LLM-assisted contributions are accepted but discouraged, provided they are disclosed
as described in [Attribution](#attribution)**.

:::


Some projects may not agree with this generic policy at all, and may reject AI-assisted contributions entirely. Even where a project's policy allows AI-assisted contributions, an individual maintainer may still decline to review a specific PR on that basis, at their discretion.

gbdev as a community does not endorse or recommend the use of generative AI
assistants for software development, as it raises multiple concerns about ethics,
legality, copyright, etc.

Nevertheless, gbdev acknowledges that these practices are already in use and
likely here to stay. Rather than banning their use, the project chooses to place responsibility
on contributors and therefore defines the following guidelines:

Contributions to gbdev projects are welcome, but should be your own work.
Anything you submit is your responsibility, even if you used AI or other tool assistance to
help create it. You must explain which tools you used and what
they did (like citing sources for written work). You must have sufficiently evaluated and
properly understood the work you intend to submit, and be able to explain and defend it.

Contributors MUST NOT submit "unattended" LLM-generated contributions - that is,
prompt-generated contributions that received no further human vetting, and more broadly
any submission produced with little to no meaningful human review, understanding, or
involvement - unless the project has an area explicitly designated for such
contributions. If no such area exists, unattended contributions are forbidden.

Contributors are expected to follow the standard gbdev contribution process and community
guidelines, as well as any project-specific guidelines or rules where applicable.

## Why This Matters

gbdev is more than just code: it is an open source community built on a shared interest
in Game Boy development, and that community grows largely through mentorship. Education and
guidance of new contributors are part of our mission. Maintainers spend
their limited time reviewing new contributors' work not only to get a given change
merged, but to help those contributors become effective, self-sufficient contributors
in their own right (see ["Contributor Poker"](https://kristoff.it/blog/contributor-poker-and-ai/)).

Heavily AI-assisted contributions undermine this. A new contributor submitting
largely LLM-generated output places an outsized review burden on maintainers, who
must scrutinize code the contributor may not fully understand, which can contribute
to reviewer burnout. Just as importantly, a contributor who leans on an LLM instead
of working through a project's internals does not build the understanding needed to
become an effective contributor, so the time invested in reviewing and mentoring
them produces a return for the project that is not only less lasting, but potentially
damaging.

::: tip A Living Document

This policy reflects our current thinking and is not final. AI tooling, community norms, and the legal landscape around generative AI are all still shifting, and we may revise these guidelines as new facts, tools, and experiences warrant. An open RFC can be found [here](https://github.com/gbdev/gbdev.github.io/issues/103).

:::

## Licensing and Legal Requirements

All contributions MUST comply with the licensing terms of the project you are contributing to.
Verify that any AI-generated content does not introduce incompatible or unclear licensing.
Contributors are responsible for ensuring the contribution is clean.

## Commit authorship

AI agents MUST NOT author git commits.

The human submitter is responsible for:

* Reviewing all AI-generated code
* Ensuring compliance with licensing requirements
* Taking full responsibility for the contribution

## Attribution

When AI tools have meaningfully assisted in producing a contribution, it MUST be disclosed with an `Assisted-by` tag in the git commit message, in the following format:

```
  Assisted-by: AGENT_NAME:MODEL_VERSION [TOOL1] [TOOL2]
```

Where:

* `AGENT_NAME` is the name of the AI tool or framework
* `MODEL_VERSION` is the specific model version used
* `[TOOL1] [TOOL2]` are optional specialized analysis tools used
  (e.g., coccinelle, sparse, smatch, clang-tidy)

Basic development tools (git, gcc, make, editors) should not be listed.

Example:

```
  Assisted-by: Claude:claude-3-opus coccinelle sparse
```

## References

Adapted from [Linux Kernel - AI Coding Assistants](https://docs.kernel.org/process/coding-assistants.html),
some proposals in [General Resolution: LLM usage in Debian](https://www.debian.org/vote/2026/vote_002) and
[SF Conservancy - Recommendations When Using LLM-backed Generative AI Systems for FOSS Contributions](https://sfconservancy.org/llm-gen-ai/llm-backed-generative-ai-recommendations.html).

August 16, 2026 - gbdev AI policy working group.

