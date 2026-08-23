# Publish to GitHub Pages

This project is static: HTML, CSS, JavaScript, Markdown and images. There is no build step.

## Create and push

```bash
git init
git add .
git commit -m "feat: add engineering learning os"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## Enable Pages

The repository includes `.github/workflows/pages.yml`.

1. Open GitHub repository **Settings**.
2. Open **Pages**.
3. Under **Build and deployment**, choose **GitHub Actions**.
4. Push to `main` or manually run the Pages workflow.

The action publishes the repository root directly.

## PWA/offline behavior

When served over HTTPS by GitHub Pages, `sw.js` caches the app shell after the first visit. Progress is still kept in browser localStorage, so use **Sources / Settings → Export progress JSON** if you want to move progress between browsers/devices.

## Updating later

Add new topics to `js/expanded-data.js`, add interactive behavior to `js/simulations.js`/`js/app.js`, run `./tests/run-all.sh`, then commit and push. The workflow redeploys automatically.
