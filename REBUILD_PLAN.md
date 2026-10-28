# Easy Life Tools rebuild

The rebuild is being developed on `feat/flutter-firebase-rebuild` so the existing app remains available on `main` while the new stack is prepared.

## Target architecture

- **Android + iOS:** Flutter / Dart in `apps/mobile/`
- **Website:** React + TypeScript (planned; shared API contract)
- **Identity:** Firebase Authentication (email/password and Google)
- **API:** Node.js + Express + TypeScript in `backend/`
- **Database:** MongoDB Atlas
- **API authentication:** clients send Firebase ID tokens as `Authorization: Bearer <token>`; the API verifies them with Firebase Admin SDK.
- **Authorization:** records are scoped to the verified Firebase UID on the server. Never trust a UID supplied in the request body.

## Current starter implementation

- Flutter app sign-in/create-account, Google provider button, password reset, and signed-in state.
- TypeScript API health endpoint, verified Firebase token middleware, `/api/me`, and owner-scoped task list/create/update/delete endpoints.
- Zod request validation, Helmet, CORS allowlist, rate limiting, MongoDB connection and environment template.

## Required setup (manual console steps)

1. Use the provided Firebase project `management-tool-be37b`: https://console.firebase.google.com/project/management-tool-be37b/overview. Confirm it is intended for Easy Life Tools before enabling providers.
2. In Authentication → Sign-in method, enable **Email/Password** and **Google**.
3. Register Android package ID and iOS bundle ID as `com.keynoteinfotech.easylifetools`. Add Android debug/release SHA-1 and SHA-256 fingerprints in Firebase.
4. From `apps/mobile/`, run `dart pub global activate flutterfire_cli` and `flutterfire configure`. This generates the local `lib/firebase_options.dart` required to run the app. Do not share service-account private keys.
5. Create/configure MongoDB Atlas, create a least-privilege database user, and allow network access only as required by the deployment.
6. Copy `backend/.env.example` to `backend/.env`, set `MONGODB_URI`, `FIREBASE_PROJECT_ID=management-tool-be37b`, and exact comma-separated `CORS_ORIGINS`.
7. For local Firebase Admin authentication, use Application Default Credentials (for example `gcloud auth application-default login`) or configure `GOOGLE_APPLICATION_CREDENTIALS` to a service-account JSON file stored outside Git. In production, prefer the hosting platform's workload identity/application credentials.
8. In `backend/`, run `npm install`, `npm run check`, `npm run build`, then `npm run dev`.
9. Run the mobile app with `flutter pub get` and `flutter run`. Verify Google sign-in on physical Android and iOS devices.

## Security/release gates

- Never commit Firebase service-account keys, database credentials, production secrets, or signing keys.
- Firebase client configuration is not a substitute for API authorization. The backend must verify ID tokens on every private route.
- Test invalid/expired tokens, account deletion/disabled users, CORS, validation, rate limiting, and cross-user task access.
- Configure Firebase authorized domains for web sign-in when the website is added.
- Configure backups, monitoring, TLS, secret management, and store signing before production.
- The Flutter app currently establishes authentication only; its task UI is not yet connected to the API. Notes, calculator, website migration, automated tests, and production deployment remain follow-up work.
