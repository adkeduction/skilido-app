# Skilido One (demo)

Mobile-first Skilido website. Every visit starts at the Skilido sign-in; after sign-in the dashboard opens. Static files only: `index.html`, `styles.css`, `app.js`, `reference.css`, `assets/`. No backend. Current website: https://one.skilido.com/. This workspace prepares the reference-design release.

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
| Learn · 3L learning ecosystem | `#/learn/overview`, `stories`, `leap`, `assess` (quizzes, self-check, activities), `home` |
| Ayati Academy · teacher training and certification (teachers only) | `#/ayati/overview`, `programs`, `modules`, `live`, `certificates` |
| Skill Passport | `#/passport/overview`, `skills`, `timeline`, `journey`, `recs`, `badges` |
| LifeLab | `#/lifelab/challenges` (stars, deadlines, submit), `open` (join), `post` |

## Platforms (open their own landing page directly, no role screens)
| Platform | URL |
|---|---|
| FLY | https://fly.skilido.com/ |
| FLY Bazaar | https://fly.skilido.com/bazaar |
| Spotlight | https://spotlight.skilido.com/ |
| Family Club | https://club.skilido.com/ |

AP LEAPs has been removed. All links are in the `PLATFORMS` object at the top of `app.js`.

## Deploy (only after approval)
Upload `index.html`, `styles.css`, `reference.css`, `app.js` and `assets/` to the root of a subdomain. When files change, bump `?v=` on the CSS and JS links in `index.html`.

## Generated reference design · 23 November 2026

Built on current production source commit `1005fd4`, preserving Learn assessments, teacher-only Ayati and LifeLab stars/deadlines. The Home, Learn, Stories and Ayati interfaces are semantic components. The reference images are not pasted into the site. Newly generated transparent student, kits, educators and a 16-icon atlas are composed within coded backgrounds and layouts. Production assets live in `assets/generated`; prompt specifications are in `assets/generated/PROMPTS.md`.

JavaScript syntax, CSS parsing, and DOM interaction checks passed across 14 routes, including sign-in, search, tasks and registration. Browser visual QA covered desktop Home/Learn/Stories/Ayati, phone Home/Ayati, and tablet Stories. Generated assets loaded, with no horizontal page overflow at the checked phone/tablet widths. Hosting publication requires an authenticated Hostinger session; a GitHub push alone is not proof of a live deployment.
