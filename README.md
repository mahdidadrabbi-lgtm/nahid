# RUAA Store

Bangladesh modest-fashion storefront with product color variants, one-page checkout, order tracking, and an admin dashboard.

## Production architecture

- Vercel serves the files in `public/` and runs the Node.js functions in `api/`.
- Firebase Firestore stores orders and store settings. The browser never accesses Firestore directly.
- Admin sign-in uses `ADMIN_PASSWORD`; API sessions are signed with `JWT_SECRET`.
- New order updates are checked by the admin dashboard every 10 seconds; browser notifications and sound require the admin to enable them while the dashboard is open.
- Production checkout requires Cloudflare Turnstile. Configure the production widget's `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in Vercel before deploying; the secret must never be exposed in browser code or committed. Order tokens are accepted only when Siteverify confirms the `order` action and exact hostname `ruaaborqa.vercel.app`.
- Courier booking is disabled until a real provider integration and server-side credentials are configured. The API returns `503` rather than pretending a parcel was booked.

## Requirements

- Node.js 20 or later and npm
- A Vercel account and a GitHub repository
- A Firebase project with Cloud Firestore enabled
- A Firebase service account for server-side Firestore access

## Firebase setup

1. In Firebase Console, create a Firestore database in production mode.
2. In Project settings, create a service account key. Keep its JSON private; never commit it or put it in browser code.
3. Firebase Analytics is currently disabled because the old web API key is invalid. If you want Analytics, copy the current Firebase Web app config from Project settings before enabling it.
4. Optionally publish the deny-by-default Firestore rules with `npx firebase-tools deploy --only firestore:rules` after selecting the Firebase project with `npx firebase-tools use --add`.

## GitHub setup

From this project directory, connect the empty GitHub repository and push the files:

```powershell
git init
git branch -M main
git remote add origin https://github.com/mahdidadrabbi-lgtm/nahid.git
git add .
git commit -m "Prepare RUAA Store for Vercel"
git push -u origin main
```

If `git remote add` says `origin` already exists, inspect it with `git remote -v` instead of adding another remote.

## Vercel setup

1. In Vercel, choose **Add New Project** and import `mahdidadrabbi-lgtm/nahid`.
2. Use the repository root as the project root. Vercel should detect Node.js; no separate build command is needed.
3. Add these Environment Variables for Production and Preview:
   - `ADMIN_PASSWORD`: a unique password with at least 12 characters.
   - `JWT_SECRET`: a random value with at least 32 characters.
   - `FIREBASE_SERVICE_ACCOUNT`: the complete Firebase service-account JSON.
   - `TURNSTILE_SITE_KEY`: public site key from your Cloudflare Turnstile widget, configured for your production domain.
   - `TURNSTILE_SECRET_KEY`: private secret from the same widget. Keep it only in Vercel Environment Variables.
4. Deploy. Vercel serves the storefront at `/`, tracking at `/track`, and the protected dashboard at `/sys-portal-mgt-v2`. Production order creation is rejected until both Turnstile keys are configured.
5. Test one checkout, verify it appears in the dashboard, update its status, and track it by order ID. Delete any test order afterward.

The Firebase Web config and Meta Pixel ID are public browser identifiers, not server credentials. The Firebase Admin service-account JSON, `ADMIN_PASSWORD`, and `JWT_SECRET` must remain Vercel Environment Variables and must not be committed.

## Local Vercel development

```powershell
npm install
npm test
npx vercel link
npx vercel env pull .env.local
npm run vercel:dev
```

Set the three required Environment Variables in the linked Vercel project before pulling them. `.env.local`, local JSON data, and Vercel build output are excluded from Git.

## Current limits

- The existing local `server.ps1` and JSON files are for local use only; production requests use the Vercel API and Firestore.
- Existing local orders are not automatically migrated to Firestore.
- The dashboard refreshes order changes every 10 seconds while open, and flags repeat orders with the same phone number within two minutes. Browser notifications and sound are opt-in and only work while the admin dashboard is open.
- Daily/monthly dashboard totals are order counts and COD order value (excluding cancelled orders), not confirmed cash received.
- Pathao and Steadfast live booking need separate provider-specific API integration and credentials. The current Vercel functions return an explicit not-configured response.
- Meta Pixel browser events are configured in the storefront; Conversions API (CAPI) is not configured. Verify the Pixel ID and incoming events in Meta Events Manager before starting paid campaigns.
- The sitemap uses the current Vercel production alias. Replace its URLs in `public/robots.txt` and `public/sitemap.xml` if the production domain changes.
- Real customer reviews and stock counts should only be displayed once supplied and kept up to date.
