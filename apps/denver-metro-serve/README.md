# Denver Metro Serve Vercel app

This is the production deployment target for Denver Metro Serve. It defines only
the public Denver route tree and the Stripe payment-intent endpoint.

## Vercel setup

1. In the Denver Metro Serve Vercel project, open **Settings → Build and Deployment**.
2. Set **Root Directory** to `apps/denver-metro-serve`.
3. Enable **Include files outside the Root Directory** because the Denver app uses
   shared implementation files under the repository's `src/` directory.
4. Set the required Stripe environment variables for Production and Preview.
5. Redeploy `main`.

Vercel will build this app's route tree only. Shared source is traced only when it
is imported by a Denver route; legacy DealScale routes are not compiled.
