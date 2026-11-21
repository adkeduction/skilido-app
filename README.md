# Skilido One (demo)

Mobile-first Skilido website. Every visit starts at the Skilido sign-in; after sign-in the dashboard opens. Static files only: `index.html`, `styles.css`, `app.js`, `assets/brand/`. No backend. Not published anywhere.

## Run locally
```bash
python3 -m http.server 4321
```
- Site: http://localhost:4321
- Side-by-side laptop and phone review: http://localhost:4321/showcase.html (review only, don't deploy)

## Demo sign-in
- Email `demo@skilido.com` or mobile `9848012345`, password `Skilido@2026`
- Or tap "Continue with the demo account"
- "Keep me signed in" keeps the session after the tab closes; otherwise it ends with the tab. Credentials are checked in the browser only.

## Inside Skilido (designed demo pages, sample data)
| Product | Routes |
|---|---|
| Learn · 3L learning ecosystem | `#/learn/overview`, `stories`, `leap`, `home` |
| Ayati Academy · training and certification | `#/ayati/overview`, `programs`, `modules`, `live`, `certificates` |
| Skill Passport | `#/passport/overview`, `skills`, `timeline`, `journey`, `recs`, `badges` |
| LifeLab | `#/lifelab/challenges`, `open`, `post` |

## Platforms (open their own landing page directly, no role screens)
| Platform | URL |
|---|---|
| FLY | https://fly.skilido.com/ |
| FLY Bazaar | https://fly.skilido.com/bazaar |
| Spotlight | https://spotlight.skilido.com/ |
| Family Club | https://club.skilido.com/ |

AP LEAPs has been removed. All links are in the `PLATFORMS` object at the top of `app.js`.

## Deploy (only after approval)
Upload `index.html`, `styles.css`, `app.js` and `assets/` to the root of a subdomain. When files change, bump `?v=` on the CSS and JS links in `index.html`.
