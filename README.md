# Sip2Sip

A premium vanilla HTML, CSS and JavaScript e-commerce storefront for the Sip2Sip energy drink brand.

## Features

- Static storefront using HTML, CSS and vanilla JavaScript
- Product catalog stored in JSON
- Dynamic cart with localStorage
- Shop filters, search, sorting and detail page
- Checkout flow with validation
- FAQ accordion and contact form
- Responsive design tuned for desktop, tablet and mobile

## Run locally

Open `index.html` directly in a browser, or serve the folder with a lightweight static server:

```bash
cd Sip2Sip
python3 -m http.server 8000
```

Then visit:

- http://localhost:8000/

## Deploy

Because the site is fully static, it will work on:

- Netlify
- GitHub Pages
- Any static host

## Structure

- `index.html` — homepage
- `pages/` — shop, product, cart, checkout, about, contact, FAQ pages
- `css/` — global styling and responsive rules
- `js/` — storefront logic and interactions
- `data/` — product and FAQ data in JSON
- `assets/` — brand product illustrations and assets

## Notes

- No frameworks or build tools are required.
- All product data is centralized in `data/products.json`.
