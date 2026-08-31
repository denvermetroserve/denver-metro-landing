# DenverMetroServe launch plan

## Goal

Launch the supplied DenverMetroServe information architecture as the canonical site experience. The primary routes replace the previous DealScale landing and navigation pages, while `/DenverMetroServe` remains temporarily available as a compatibility alias.

## Scope

1. Create a scoped DenverMetroServe theme and shared site shell.
2. Build the home, How It Works, Pricing, Coverage, and Contact routes from reusable React sections.
3. Build `/DenverMetroServe/start` as an accessible, client-side six-step intake prototype with local file selection and a calculated order summary.
4. Add page metadata and use local components/icons rather than CDN scripts, remote mockup assets, or copied document markup.
5. Verify with TypeScript and a production build where environment configuration permits.

## Route map

| Route | Purpose |
| --- | --- |
| `/` | Conversion landing page |
| `/how-it-works` | Operational workflow explanation |
| `/pricing` | Service tiers and add-ons |
| `/coverage` | Service cities and court expertise |
| `/contact` | Direct-contact form and hours |
| `/start` | Intake prototype |

## Delivery constraints

- Preserve `/DenverMetroServe` as a temporary compatibility alias while canonical navigation uses the routes above.
- Do not use Tailwind's CDN, Material Symbols CDN, or externally hosted placeholder artwork.
- Payment fields are intentionally not implemented as ordinary inputs. Production payment requires Stripe Elements or Checkout, a server-side order endpoint, and webhook verification.
- Document uploads remain browser-local until storage, malware scanning, authorization, retention, and audit requirements are approved.

## Follow-up for production activation

1. Move the route set to the DenverMetroServe domain (or make it the root route) after approval.
2. Connect intake steps to authenticated request APIs and managed document storage.
3. Create Stripe PaymentIntents server-side and confirm payments through webhooks.
4. Add approved business identity, phone/email, legal policies, service pricing, and licensed imagery.
5. Add route-level analytics events and end-to-end tests for completed intake and payment.
