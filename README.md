# Riley Burrell Development website redesign

This build uses folder-based pages such as `about/index.html`, `faq/index.html`, and `android/index.html`.

For reliability, every internal navigation link points to the real `index.html` file inside the destination folder. This works when previewing locally and when deployed on GitHub Pages. After a page loads over HTTP/HTTPS, `script.js` removes `index.html` from the visible browser address, giving clean URLs such as `/about/` and `/faq/`.

Shared files remain at the site root:
- `styles.css`
- `script.js`
- `assets/`

The homepage tagline **Apps. Games. Innovation.** appears directly under the Riley Burrell Development eyebrow in the main hero and is repeated in the footer.

The `CNAME` file remains configured for the existing custom domain.
