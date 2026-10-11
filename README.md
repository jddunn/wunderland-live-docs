# Wunderland documentation

The source of [docs.wunderland.sh](https://docs.wunderland.sh), the documentation of [Wunderland](https://github.com/jddunn/wunderland), an open-source framework and CLI for autonomous AI agents. The site is built with [Docusaurus](https://docusaurus.io/) and served by GitHub Pages.

It holds two kinds of pages:

- **Guides**, written by hand as Markdown under `docs/`.
- **The API reference**, generated at build time by TypeDoc from the source of the `wunderland` package. It is not stored in this repository.

## Develop

You need Node.js 22, the version the workflows use, and npm.

```bash
git clone https://github.com/jddunn/wunderland-live-docs.git
cd wunderland-live-docs
npm install
npm start
```

`npm start` puts the `wunderland` source the API reference is generated from in `.source/`, then serves the site and reloads it when a file changes. The first run clones that source. Later runs reuse the clone, so delete `.source/` to fetch it again.

## Build

```bash
npm run build
```

The build runs [`scripts/pull-source.mjs`](https://github.com/jddunn/wunderland-live-docs/blob/master/scripts/pull-source.mjs) first, which clones the source when `.source/` does not hold it, then generates the API reference and writes the static site to `build/`. `npm run serve` serves that folder.

## What is where

| Path | Contents |
|---|---|
| `docs/` | The guides: getting started, tutorials, guides, architecture, use cases, deployment and the API overview |
| `sidebars.js` | The sidebar, which lists every page by hand |
| `docusaurus.config.ts` | The site's configuration, including the two TypeDoc runs that generate the API reference |
| `scripts/pull-source.mjs` | Puts the `wunderland` source in `.source/` and copies four of its documents into this site |
| `src/` | The home page, the 404 page, React components and the theme's styles |
| `static/` | Images, screenshots, demo videos, `CNAME` and `robots.txt` |

## Deployment

Every push to `master` builds the site and publishes `build/` to GitHub Pages ([`deploy-docs.yml`](https://github.com/jddunn/wunderland-live-docs/blob/master/.github/workflows/deploy-docs.yml)).

## Contributing

See [CONTRIBUTING.md](https://github.com/jddunn/wunderland-live-docs/blob/master/CONTRIBUTING.md). Questions go to [Discord](https://wilds.ai/discord).

## License

[Apache-2.0](https://github.com/jddunn/wunderland-live-docs/blob/master/LICENSE)
