# interactive intelligence website

This is an Astro project for the i2 website. i2 is UW's student-led NeuroAI education and research organization.

## development guidelines

- Write simple, clean code.
- Use latest framework conventions and best practices.
- The site is configured with `base: '/website/'` in `astro.config.mjs`. Any URL pointing to a `public/` asset (e.g. `<img src="/images/...">`) must be prefixed with `import.meta.env.BASE_URL`, otherwise the dev server throws a router error. Use Astro helpers (`<Image />`, `<a href>` with the `base` import from `astro:config/client`) or prepend `BASE_URL` manually for raw `<img src>` strings.
