# AGENTS.md

## Purpose

This repository is a GitHub Pages personal site with:

- a simple professional front page
- project highlights
- occasional blog posts

## Stack Decision

Use the default GitHub Pages static-site approach unless requirements change.

- Content: Markdown
- Templates/layouts: HTML with Jekyll Liquid
- Styling: SCSS/CSS
- Client-side behavior: minimal vanilla JavaScript

Do not use raw TypeScript in the published site. Browsers need JavaScript. If TypeScript is introduced later, it must be compiled to JavaScript as part of a separate build step.

## Frameworks And Plugins

- Static site generator: Jekyll
- Deployment target: GitHub Pages
- Theme approach: custom theme/layouts rather than a stock supported theme

Preferred GitHub Pages-compatible plugins:

- `jekyll-feed`
- `jekyll-seo-tag`
- `jekyll-sitemap`

Optional only if needed:

- `jekyll-paginate`
- `jekyll-redirect-from`

## Default Guidance For Future Work

Prefer the simplest stack that preserves a polished result.

- Start with Jekyll, Markdown, Liquid, SCSS, and minimal JS.
- Avoid React, Next.js, Tailwind, or other heavy frontend tooling unless the site requirements clearly justify the extra build complexity.
- If we later need unsupported Jekyll plugins, TypeScript, or more advanced asset processing, switch deployment from the default GitHub Pages Jekyll build to a custom GitHub Actions build while still publishing a static site.

## Nix Development Environment

This repository includes a Nix flake-based development shell.

- Enter it with `nix develop`.
- The shell is defined in `flake.nix`.
- `flake.lock` now exists and should be committed alongside `flake.nix`.

Current dev shell contents:

- Ruby `3.3`
- Bundler
- Node.js `22`
- `git`
- native build dependencies commonly needed by Jekyll gems on NixOS

Bundler is configured to install gems into a repo-local `.bundle` directory via shell environment variables. This keeps Ruby dependencies local to the project.

Status:

- Nix environment setup is finished and evaluates successfully.
- The site itself is not bootstrapped yet.
- We still need to add a `Gemfile`, install Jekyll/GitHub Pages gems, and create the actual site structure.

## References

- GitHub Pages: <https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site>
- GitHub Pages and Jekyll: <https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll>
- GitHub Pages dependency versions: <https://pages.github.com/versions/>
