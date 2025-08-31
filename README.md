# Backend for GeekHaven

This backend implements core marketplace endpoints and assignment-required features.

Environment variables:
- MONGO_URI - MongoDB connection string
- ASSIGNMENT_SEED - required seed (e.g. GHW25-XXXX)
- ROLLNO - used to expose /<rollno>/healthz
 - REDIS_URL - optional Redis connection URL for idempotency and logs
 - ADMIN_EMAILS - optional comma-separated emails that will be set as admin on startup

Notable routes added:
- POST /api/checkout - checkout endpoint (rate-limited, idempotent support)
- GET  /logs/recent - returns recent request logs (redacted)
- GET  /<ROLLNO>/healthz - health check

Notes:
- Idempotency: send `Idempotency-Key` header for retries (responses cached for 5 minutes)
- Checkout rate limit: 7 requests/min per IP
- Checkout responses include `X-Signature` header (HMAC-SHA256 with ASSIGNMENT_SEED)

To run:
1. Install deps: `npm install`
2. Start: `npm run start`

Replace environment variables as needed.
