# ServeManager mock mode

Use mock mode to test the complete Denver Metro Serve intake workflow without a
ServeManager API key or external ServeManager records.

Set this environment variable locally or in a Vercel Preview environment:

```text
SERVEMANAGER_MOCK_MODE=true
```

Keep valid Stripe **test** keys configured if you want to open the Stripe test
payment sheet. Do not enable mock mode in Production.

## What is exercised

1. `/start` validates every intake step.
2. The intake endpoint returns one deterministic mock job per servee.
3. Every selected PDF is PUT to a temporary mock upload endpoint and validated
   for non-empty bytes.
4. Stripe receives the same job-ID metadata shape used in production.
5. The Stripe webhook acknowledges payment in mock mode without calling
   ServeManager.

Mock uploads are discarded immediately; no legal document bytes are persisted.

## Local setup

In PowerShell:

```powershell
$env:SERVEMANAGER_MOCK_MODE = "true"
pnpm --filter denver-metro-serve-web dev
```

Then complete a `/start` request with at least one PDF, one servee, and one
service address. You do not need `SERVEMANAGER_API_KEY` for this test.
