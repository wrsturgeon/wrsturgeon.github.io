# Site Plan

## Objective

Build a personal GitHub Pages site for Will Sturgeon using the default Jekyll-based GitHub Pages stack.

Initial implementation scope:

- a minimal home page
- a working `Writing` section for blog posts
- RSS feed support
- no `About` page yet
- no `Projects` page yet

For now, `About` and `Projects` may remain linked from the home page even if they return 404 responses.

## Product Direction

The site should feel:

- simple
- professional
- polished
- personally shareable

The home page should remain intentionally sparse rather than trying to explain everything at once.

## Stack

Use the default GitHub Pages-compatible stack:

- content: Markdown
- templates: HTML with Jekyll Liquid
- styling: SCSS/CSS
- client-side behavior: minimal vanilla JavaScript

Do not introduce:

- React
- Next.js
- Tailwind
- raw TypeScript in published output

## Publishing Model

The blog should be native to the website rather than delegated to an external platform.

Decision:

- posts live in the repository
- posts are authored as Markdown files in Jekyll `_posts/`
- the site exposes an RSS/Atom feed through `jekyll-feed`
- Substack or cross-posting can be considered later, but is not part of the first build

## Information Architecture

### Home Page

Path:

- `/`

Content:

- top navigation with links to `About`, `Writing`, and `Projects`
- large serif display of the name `Will Sturgeon`

Non-goals for the first pass:

- no biography block unless later requested
- no project grid on the home page yet
- no social icon cluster unless later requested
- no heavy animation or interactive behavior

### Writing Index

Path:

- `/writing/`

Purpose:

- list blog posts in reverse chronological order
- provide a clear, minimal place for visitors to browse writing

Content:

- page title
- short intro line or no intro if the page feels stronger without it
- post list with title, date, and optional excerpt

### Individual Posts

Path pattern:

- `/:categories/:year/:month/:day/:title/` or a simpler custom permalink if we prefer

Recommendation for first pass:

- use a clean blog-style permalink pattern that keeps dates visible in feeds and archives

Content:

- post title
- publication date
- Markdown-rendered body

### Future Pages

Not in scope yet:

- `/about/`
- `/projects/`

These can be added later without changing the home page concept.

## Authoring Workflow

New posts should be created directly in the repository.

Standard Jekyll workflow:

- create a Markdown file in `_posts/`
- use filename format `YYYY-MM-DD-slug.md`
- include YAML front matter bounded by `---`
- commit and push
- GitHub Pages rebuilds the site automatically

Example post file:

```md
---
layout: post
title: "Example Post"
date: 2026-04-17
excerpt: "Optional short summary."
---

Post content goes here.
```

We should not build a custom parser or a sync process from another content directory in the first pass. Jekyll already handles front matter and Markdown natively.

## Required Jekyll Features

Core:

- layouts
- includes
- posts collection via `_posts/`
- Markdown rendering
- SCSS compilation

Plugins:

- `jekyll-feed`
- `jekyll-seo-tag`
- `jekyll-sitemap`

Optional later:

- `jekyll-paginate`
- `jekyll-redirect-from`

## Implementation Plan

### Phase 1: Bootstrap

Create the base Jekyll site structure and configuration.

Files expected:

- `_config.yml`
- `Gemfile`
- `index.md` or `index.html`
- `writing.md` or `writing/index.html`
- `_layouts/default.html`
- `_layouts/home.html`
- `_layouts/post.html`
- `_includes/head.html`
- `_includes/header.html`
- `_posts/` with at least one example post
- `assets/css/main.scss`

Configuration tasks:

- set site title and description
- set canonical site URL once known
- enable feed, sitemap, and SEO plugins
- configure permalink structure
- configure Markdown engine defaults if needed

### Phase 2: Home Page

Build the minimal home page.

Requirements:

- top navigation containing `About`, `Writing`, `Projects`
- prominent serif typography for `Will Sturgeon`
- careful spacing and visual restraint
- responsive behavior that works on mobile and desktop

Design direction:

- avoid generic startup-site styling
- use typography and spacing as the main visual language
- keep the page light and fast

### Phase 3: Writing Section

Build the writing index and post template.

Requirements:

- `/writing/` page lists posts
- posts render from `_posts/`
- each post uses a clean reading layout
- feed output is enabled

Content model for posts:

- `layout`
- `title`
- `date`
- optional `excerpt`
- optional `tags`

### Phase 4: Validation

Before considering the first implementation complete:

- local Jekyll serve/build works
- generated writing index includes the sample post
- feed is generated
- home page links render as expected
- `About` and `Projects` links are intentionally unresolved for now

## Design Constraints

The initial design should emphasize:

- typography over decoration
- whitespace over density
- confidence over feature count

Avoid:

- cluttered home page sections
- premature project showcases on the front page
- ornamental JavaScript
- unnecessary build complexity

## Open Decisions

These should be resolved during implementation or immediately before it:

- exact site `title` and `description` metadata
- final permalink pattern for posts
- whether the home page should use `index.html` or `index.md`
- whether `/writing/` should be a standalone page or collection-driven index template
- whether to include one seed post at bootstrap time

## Recommended Next Action

Bootstrap the actual site with:

- GitHub Pages-compatible Jekyll configuration
- a custom minimal home page
- a working `Writing` page
- one example post
- RSS, sitemap, and SEO plugins enabled
