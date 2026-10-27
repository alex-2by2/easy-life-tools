# Easy Life Tools: Web, Android and iOS

## Architecture
- Website/PWA: React + Vite in `client/`
- Android and iOS: Capacitor wrapper around the same built frontend
- API: Express in `server/`
- User data: MongoDB; each task/note is scoped to the authenticated user

## Local setup
1. Install Node.js 22+ and npm.
2. Configure `server/.env` using `server/.env.example`; use a strong random `JWT_SECRET` and a non-default owner password.
3. Configure `client/.env` using `client/.env.example` and set `VITE_API_URL` to the HTTPS API URL. A deployed phone app must never use localhost as its API.
4. Install and run the API from `server/`: `npm install`, then `npm run dev`.
5. Install and build the web client from `client/`: `npm install`, then `npm run build`.

## Capacitor
From `client/` after setting `VITE_API_URL`:
```bash
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```
For iOS, on macOS with Xcode installed:
```bash
npx cap add ios
npx cap sync ios
npx cap open ios
```
Commit generated `android/` and `ios/` folders after reviewing them if you want native project changes to persist in the repository. The workflow in `.github/workflows/mobile-build.yml` generates them temporarily for build verification and publishes an Android debug APK artifact on successful runs.

## Security and release checklist
- Deploy the API behind HTTPS; configure `CLIENT_ORIGIN` with exact production website origin(s).
- Use unique production secrets, rotate any secret that may have been exposed, and never commit `.env`.
- Confirm native app origins (`capacitor://localhost` for iOS and `https://localhost`/configured Android scheme) against CORS and cookie behavior on real devices.
- Test login, logout, session persistence, user data isolation, owner authorization, offline/error states, and all API calls on real Android/iOS devices.
- Configure database backups, monitoring, rate limits, and incident response.
- Configure signing credentials privately before creating a Play Store AAB or App Store release. CI debug/simulator builds are not store-ready releases.

## Important limitations
The GitHub Actions workflow is build verification only. It does not deploy the API, configure MongoDB, sign a store release, publish either app, or certify production readiness. Test the generated APK and iOS build on devices before release.
