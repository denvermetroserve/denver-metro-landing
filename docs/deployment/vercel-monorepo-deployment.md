# Deploying Denver Metro Serve from This Monorepo

This repository contains legacy DealScale code and a dedicated Denver Metro Serve
deployment target. Deploy the dedicated app so Vercel compiles the Denver route
tree instead of the legacy root application.

## Deployment target

| Item | Value |
| --- | --- |
| Vercel Root Directory | `apps/denver-metro-serve` |
| Workspace package | `denver-metro-serve-web` |
| Build command | `pnpm build` |
| Public checkout endpoints | `/api/stripe/intent`, `/api/servemanager/intake` |

The dedicated app exposes only Denver Metro Serve pages:

- `/`
- `/start`
- `/pricing`
- `/how-it-works`
- `/coverage`
- `/contact`
- `/our-expertise` and its case studies
- `/privacy`, `/tos`, and `/sla`
- `/success` and `/failed`

Other application routes and API endpoints return `404` from the dedicated app's
middleware.

## One-time Vercel setup

1. In Vercel, create a project from this Git repository, or open the existing
   Denver Metro Serve project.
2. Go to **Settings → Build and Deployment**.
3. Set **Root Directory** to `apps/denver-metro-serve`.
4. Enable **Include files outside the Root Directory**. The dedicated app imports
   only the shared Denver implementation it needs from the repository's `src/`
   directory.
5. Leave the framework preset as **Next.js**.
6. Set the build command to `pnpm build` if Vercel does not detect it from
   `apps/denver-metro-serve/package.json`.
7. Add the required environment variables for both Preview and Production.
8. Deploy the `main` branch.

## Required environment variables

Configure these in **Settings → Environment Variables**. Never commit keys to
the repository.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Loads Stripe Elements in the browser. |
| `STRIPE_SECRET_KEY` | Yes | Creates the payment intent on the server. |
| `STRIPE_WEB_SECRET` | If webhooks are enabled | Verifies Stripe webhook signatures. |
| `SERVEMANAGER_API_KEY` | Yes for ServeManager | ServeManager account-owner API key; server-only. |
| `SERVEMANAGER_WEBHOOK_SECRET` | Yes for inbound ServeManager webhooks | Shared secret required by the webhook receiver. |
| `SERVEMANAGER_INITIAL_JOB_STATUS` | No | Draft job status; defaults to `On Hold`. |
| `SERVEMANAGER_PAID_JOB_STATUS` | No | Status after a successful Stripe payment; defaults to the initial status. |

Use matching Stripe modes in each environment:

- Preview: `pk_test_...` and `sk_test_...`
- Production: `pk_live_...` and `sk_live_...`

## Local verification

From the repository root:

```bash
pnpm install --lockfile-only
pnpm --filter denver-metro-serve-web build
```

To run the dedicated app locally:

```bash
pnpm --filter denver-metro-serve-web dev
```

Check the following before production promotion:

1. `/`, `/pricing`, `/how-it-works`, `/coverage`, and `/contact` load.
2. `/start` accepts the intake data and displays the payment review.
3. Stripe opens using test keys in Preview.
4. `/dashboard`, `/blogs`, `/marketplace`, and other legacy paths return `404`.
5. `/api/stripe/intent` and `/api/servemanager/intake` work; legacy API paths return `404`.

## ServeManager setup

The browser never receives `SERVEMANAGER_API_KEY`. At review, the app validates
the intake on the server, creates an `On Hold` ServeManager job, and returns only
the short-lived upload URLs supplied for that job. The browser uploads each PDF
directly to those URLs, then the Stripe payment intent stores the internal
ServeManager job ID in its metadata.

Create a Stripe webhook endpoint at:

```text
https://<your-domain>/api/servemanager/stripe-webhook
```

Subscribe it to `payment_intent.succeeded`. The verified webhook updates the
matching ServeManager job using the configured paid status and records Stripe's
payment ID as the client transaction reference.

For operational updates from ServeManager, configure its webhook target as:

```text
https://<your-domain>/api/servemanager/webhook
```

Copy the generated ServeManager webhook `secret_key` into
`SERVEMANAGER_WEBHOOK_SECRET`. The endpoint verifies the documented
`X-SM-HMAC-SHA256` signature against the untouched request body before accepting
payloads. It currently acknowledges and logs authenticated job/attempt/note
payloads; connect a durable event store before using those events to drive
client-visible status history.

To provision or update the webhook safely (the same client reference prevents
duplicates), run this from a secure terminal after setting the API key and the
deployed target URL:

```bash
SERVEMANAGER_WEBHOOK_TARGET_URL="https://<your-domain>/api/servemanager/webhook" \
pnpm exec tsx tools/servemanager/sync-webhook.ts
```

In PowerShell, use:

```powershell
$env:SERVEMANAGER_WEBHOOK_TARGET_URL = "https://<your-domain>/api/servemanager/webhook"
pnpm exec tsx tools/servemanager/sync-webhook.ts
```

The command prints the one-time ServeManager `secret_key`; add it to Vercel as
`SERVEMANAGER_WEBHOOK_SECRET` and never save it in source control.

## How the deployment stays isolated

The dedicated app has its own `app/` route tree, `middleware.ts`, package manifest,
Next configuration, and Vercel configuration under `apps/denver-metro-serve`.
It reuses only the shared source modules imported by those Denver routes. Next.js
does not compile the legacy root application's routes when Vercel uses this app as
its Root Directory.

The root application's middleware allowlist remains a separate safety net for any
deployment that still uses the repository root.

## Rollback

If the dedicated deployment has a problem:

1. In Vercel, open **Deployments** and promote the most recent known-good
   deployment.
2. If necessary, temporarily set the Root Directory back to the repository root.
   The root deployment has its own Denver-only public route guard.
3. Fix the dedicated app on a branch, verify its preview deployment, then merge
   and redeploy `main`.

## References

- [Vercel monorepo deployments](https://vercel.com/docs/monorepos)
- [Vercel Root Directory configuration](https://vercel.com/docs/builds/configure-a-build)
