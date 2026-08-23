# Publishing Engineering Atlas to GitHub Pages

Engineering Atlas is a static site and requires no build step. The target repository is `Moshiuzzaman4135/engineering-atlas`, and the expected site is:

<https://moshiuzzaman4135.github.io/engineering-atlas/>

## Workflow

`.github/workflows/pages.yml` deploys on every push to `main` and can also be run manually. It follows GitHub's current custom-workflow shape: checkout, configure Pages, upload the repository root as a Pages artifact, then deploy that artifact with `contents: read`, `pages: write`, and `id-token: write` permissions.

GitHub's official references:

- <https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages>
- <https://github.com/actions/deploy-pages>

## Initial publication

```bash
git branch -M main
git remote add origin https://github.com/Moshiuzzaman4135/engineering-atlas.git
git push -u origin main
```

In repository Settings → Pages, ensure the publishing source is **GitHub Actions**. The workflow environment is `github-pages`, and its deployment step reports the final URL.

## Offline behavior

On Pages, HTTPS allows `sw.js` to cache the app shell after a successful visit. Progress remains in browser `localStorage`, independent of the service worker. Export progress from Sources / Settings before clearing site data or changing browsers.

Direct-file use remains available through `START_HERE.html`, but `file://` pages do not install a service worker.

## Updating

Run `./tests/run-all.sh`, commit to `main`, and push. The workflow redeploys automatically. After every production change, verify the public title, navigation, at least one lesson and lab, local progress, mobile layout, console output, and resource responses.

