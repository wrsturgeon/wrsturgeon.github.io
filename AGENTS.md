# AGENTS.md

## Purpose

This repository is a GitHub Pages personal site for Will Sturgeon with:

- a minimal professional home page
- a writing section for occasional blog posts
- room for future project highlights

## Current State

The site is bootstrapped and currently includes:

- a minimal home page at `/`
- a `Writing` page at `/writing/`
- individual posts from `_posts/`
- a simple RSS/Atom feed at `/feed.xml`

For now:

- `About` links may 404
- `Projects` links may 404

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

Current implementation:

- custom layouts in `_layouts/`
- custom SCSS in `assets/css/main.scss`
- local `feed.xml` template for RSS/Atom output

Preferred GitHub Pages-compatible plugins for a later pass:

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

## Authoring Workflow

Posts should be created directly in `_posts/` as Markdown files with YAML front matter.

Expected filename format:

- `YYYY-MM-DD-slug.md`

Expected front matter:

- `layout`
- `title`
- `date`
- optional `excerpt`
- optional `tags`

## Development Notes

This repository includes a Nix flake-based development shell.

- Enter it with `nix develop`
- The shell is defined in `flake.nix`
- `flake.lock` should be committed alongside `flake.nix`

The current flake is intentionally minimal. It may be extended with additional packages if the local development workflow requires them.

## Near-Term Priorities

- keep the home page minimal and typographically strong
- improve the writing/post infrastructure as needed
- later add real `About` and `Projects` pages
- optionally move from the local feed template to GitHub Pages-compatible plugins and a `Gemfile`

## References

- GitHub Pages: <https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site>
- GitHub Pages and Jekyll: <https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll>
- GitHub Pages dependency versions: <https://pages.github.com/versions/>
