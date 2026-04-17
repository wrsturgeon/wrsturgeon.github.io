# Site Plan

## Objective

Build a personal GitHub Pages site for Will Sturgeon that stays simple, professional, and personally shareable.

## Current State

Implemented:

- home page at `/` with top navigation and large display of `Will Sturgeon`
- `Writing` index at `/writing/`
- posts authored in `_posts/`
- individual post layout
- RSS/Atom feed at `/feed.xml`
- favicon

Intentionally not implemented yet:

- `/about/`
- `/projects/`

## Confirmed Decisions

- Use Jekyll with Markdown, Liquid, HTML, and SCSS.
- Keep JavaScript minimal.
- Keep blog posts native to the site.
- Author posts directly in `_posts/`.
- Keep the home page sparse rather than turning it into a full profile page.

## Current File Structure

- `_config.yml`
- `_layouts/default.html`
- `_layouts/post.html`
- `_posts/`
- `assets/css/main.scss`
- `index.html`
- `writing.md`
- `feed.xml`
- `favicon.svg`

## Posting Workflow

To publish a new post:

1. Create a file in `_posts/` named `YYYY-MM-DD-slug.md`.
2. Add YAML front matter with at least `layout`, `title`, and `date`.
3. Write the post body in Markdown.
4. Commit and push.

## Near-Term Next Steps

- decide whether to keep the current local `feed.xml` or move to `jekyll-feed`
- add a `Gemfile` and GitHub Pages-compatible plugin setup when we want tighter parity with GitHub Pages
- create real `About` and `Projects` pages
- refine the home page visual design without losing simplicity

## Constraints

- Avoid unnecessary frontend tooling.
- Avoid custom content pipelines unless there is a clear need.
- Preserve a fast, static-site workflow.
