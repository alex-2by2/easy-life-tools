# Easy Life Tools

Easy Life Tools is being rebuilt with a native Flutter mobile app, Firebase Authentication, a TypeScript API, and MongoDB Atlas. The existing React/Express application remains on main; the new work is isolated on feat/flutter-firebase-rebuild.

## New architecture

- **Android + iOS:** Flutter / Dart — apps/mobile/
- **Backend:** Node.js + Express + TypeScript — backend/
- **Login:** Firebase Authentication (email/password and Google)
- **Database:** MongoDB Atlas
- **Security:** Firebase ID token verification in the backend, per-user data ownership, validated API inputs, Helmet, CORS allowlist and rate limiting.

## Getting started

- Read REBUILD_PLAN.md for Firebase and MongoDB setup.
- Mobile setup: apps/mobile/README.md
- API setup: copy backend/.env.example to backend/.env, configure secrets and Firebase Admin credentials, then run npm install, npm run check, npm run build, and npm run dev inside backend/.
- Flutter setup: install Flutter, run flutterfire configure inside apps/mobile/, then flutter pub get and flutter run.

## Current status

This is a starter implementation, not a production release. Firebase project setup and credentials require the project owner to configure them. The mobile authentication flow and API task endpoints are scaffolded; the Flutter task UI is not yet connected to the API, and website migration, notes/calculator porting, full automated tests, deployment, and store signing are still pending.

The existing app and its historical data are not automatically migrated by this scaffold. Plan and test any migration before switching users over. Never commit service-account keys, environment files, MongoDB credentials, or signing keys.
