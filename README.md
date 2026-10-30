# Prabesh Kafle — Portfolio

A static, no-build personal portfolio website built with HTML, CSS, and JavaScript. It can be previewed with VS Code Live Server or any local HTTP server.

The visual theme uses jet black (`#0A0A0A`), cerulean blue (`#007BA7`), and neon rose (`#FF2D95`) based on the provided color reference. The animated background layers include aurora blobs, a perspective grid, floating code symbols, a cursor spotlight, grain, and a lightweight particle network that pauses when the page is hidden and respects reduced-motion settings.

## Run locally

Open `index.html` with Live Server, or run `python -m http.server 5500` from this folder and visit `http://127.0.0.1:5500/`.

## Before publishing

- Replace `YOUR_FORMSPREE_ID` in the contact form action in `index.html` with the form ID from your Formspree account. Until configured, the form reports that messages cannot be delivered and directs visitors to email.
- Add your real CV at `assets/cv/Prabesh_Kafle_CV.pdf`, then replace the disabled “CV coming soon” label in the hero with a download link.
- Check the existing contact details and social profile URLs in `index.html`.
- Keep project descriptions and links accurate; the two concept projects are explicitly labeled. The portfolio currently displays nine project cards.
- Replace `image/image1.jpg` with your preferred profile photo if needed. The Open Graph preview at `assets/img/social-preview.jpg` is already sized to 1200 × 630.
- Add your school or institution name if you want it shown in the education section. Confirm experience statistics are accurate before publishing.
- Confirm availability, email, phone, title, and canonical domain are still correct.

## Media optimization

These commands create an eight-second, silent, 1280 × 720 video. The bitrate targets keep each output below 3 MB for a typical clip; check the resulting file size before uploading.

```powershell
ffmpeg -i hero-source.mov -t 8 -an -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,format=yuv420p" -c:v libx264 -preset slow -b:v 1800k -maxrate 1800k -bufsize 3600k -movflags +faststart assets/video/hero.mp4
ffmpeg -i hero-source.mov -t 8 -an -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,format=yuv420p" -c:v libvpx-vp9 -b:v 1200k -maxrate 1800k -deadline good -cpu-used 2 -row-mt 1 assets/video/hero.webm
```

Convert the profile photo to smaller WebP or AVIF alternatives when you are ready to update its HTML source:

```powershell
ffmpeg -i image/image1.jpg -vf "scale=900:-2" -frames:v 1 -c:v libwebp -quality 82 image/profile.webp
ffmpeg -i image/image1.jpg -vf "scale=900:-2" -frames:v 1 -c:v libaom-av1 -still-picture 1 -crf 30 -b:v 0 image/profile.avif
```

## Deploy

### cPanel or FTP

1. Back up the current site files and note any hosting-specific configuration.
2. Upload the contents of this project to the domain's document root (commonly `public_html/`), preserving the `assets/`, `css/`, `image/`, and `js/` folders.
3. Keep `index.html`, `robots.txt`, `sitemap.xml`, and `site.webmanifest` at the document root.
4. Visit the HTTPS domain and test the navigation, theme, links, and contact form.
5. If an old version remains visible, hard-refresh with Ctrl+F5, clear the host's page cache, and purge any CDN cache.

### GitHub Pages or Netlify

1. Publish the repository's root as a static site; no build command or output directory is required.
2. Add the custom domain in the hosting provider's Pages/domain settings.
3. Configure DNS using the exact records shown by the provider. For GitHub Pages apex domains, GitHub currently documents four A records (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`) and a `www` CNAME to `<username>.github.io`.
4. Wait for DNS and HTTPS provisioning, then verify both the apex domain and `www` redirect/behavior.

## Release checklist

- Check 360, 480, 768, 1024, 1280, and 1440 px widths; confirm no horizontal overflow.
- Test dark and light themes, mobile menu keyboard controls, section links, project filters, and clipboard behavior.
- Test with keyboard-only navigation and `prefers-reduced-motion` enabled.
- Configure and submit the real Formspree form; verify its success and error states.
- Run Lighthouse for Performance, Accessibility, Best Practices, and SEO. Confirm the deployed canonical URL, social preview, sitemap, and robots file.
- Smoke-test the latest Chrome, Firefox, Safari, and Edge versions.
