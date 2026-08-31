# ServeManager callable endpoints

The callable ServeManager gateway is implemented at:

`apps/denver-metro-serve/app/api/servemanager/[...resource]/route.ts`

`GET /api/servemanager` returns this route manifest from the running app.

It forwards only documented, allowlisted ServeManager resource paths while
keeping `SERVEMANAGER_API_KEY` on the server. Every gateway call requires:

```text
Authorization: Bearer <SERVEMANAGER_INTERNAL_API_TOKEN>
```

Set `SERVEMANAGER_INTERNAL_API_TOKEN` to a long random secret in Vercel. Use it
only from a trusted backend, CLI, or automation—not browser code.

## Supported resource paths

- `GET /api/servemanager/account`
- `GET /api/servemanager/employees` and `/employees/:id`
- `GET|POST /api/servemanager/companies`; `GET|PUT /companies/:id`
- `GET|POST /api/servemanager/court_cases`; `GET|PUT /court_cases/:id`
- `GET|POST /api/servemanager/courts`; `GET|PUT /courts/:id`
- `GET|POST /api/servemanager/jobs`; `GET|PUT|POST /jobs/:id`
- `POST /api/servemanager/jobs/:id/uploads`, `/attempts`, `/notes`, `/invoices`
- `GET /api/servemanager/attempts`; `GET|PUT|DELETE /attempts/:id`
- `GET /api/servemanager/notes` and `/jobs/:id/notes`
- `GET /api/servemanager/invoices`; `GET|PUT /invoices/:id`
- `GET|POST /api/servemanager/webhooks`; `PUT|DELETE /webhooks/:id`

Pass ServeManager's documented JSON body unchanged, including its outer `data`
object and resource `type` field. Pagination query parameters pass through.

Example:

```bash
curl "https://<domain>/api/servemanager/jobs?per_page=10" \
  -H "Authorization: Bearer $SERVEMANAGER_INTERNAL_API_TOKEN"
```
