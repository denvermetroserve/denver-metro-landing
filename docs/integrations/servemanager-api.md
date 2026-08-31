# ServeManager endpoint reference

Denver Metro Serve exposes only purpose-built routes. It does not expose a
browser-accessible proxy for the ServeManager account API: that would let a
visitor create, edit, or read operational records. The API key stays on the
server in `SERVEMANAGER_API_KEY`.

## App endpoints

| Method | Endpoint | Intended caller | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/servemanager/health` | Operators and health checks | Reports whether the integration and inbound webhook secret are configured; never returns a key. |
| `POST` | `/api/servemanager/intake` | The validated `/start` form | Creates an `On Hold` job and returns one short-lived upload URL per PDF. Requests must be same-origin. |
| `POST` | `/api/servemanager/stripe-webhook` | Stripe | Verifies the Stripe signature, then associates a successful payment with the ServeManager job stored in payment metadata. |
| `POST` | `/api/servemanager/webhook` | ServeManager | Verifies `X-SM-HMAC-SHA256` against the raw payload using `SERVEMANAGER_WEBHOOK_SECRET`. |

For a deployed site, replace `<domain>` below with the production hostname:

```text
GET  https://<domain>/api/servemanager/health
POST https://<domain>/api/servemanager/intake
POST https://<domain>/api/servemanager/stripe-webhook
POST https://<domain>/api/servemanager/webhook
```

## Server-only ServeManager resources

The typed integration client lives at
`src/lib/servemanager/client.ts`. It covers the ServeManager resources supplied
in the API documentation:

- Account and employees
- Companies
- Courts and court cases
- Jobs, documents/uploads, and cancellation
- Attempts and notes
- Invoices
- Webhook registration and updates

Use it only from a route handler, server action, cron task, or trusted CLI. Do
not import it from a Client Component or build a generic public proxy around it.

## Webhook provisioning

Run `tools/servemanager/sync-webhook.ts` with `SERVEMANAGER_API_KEY` and
`SERVEMANAGER_WEBHOOK_TARGET_URL` configured. It uses a stable
`client_reference_key` so repeated runs update the same webhook instead of
creating duplicates. Save the returned ServeManager `secret_key` in
`SERVEMANAGER_WEBHOOK_SECRET`.
