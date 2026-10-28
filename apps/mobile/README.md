# Easy Life Tools — Flutter app

## Prerequisites
- Flutter stable SDK and Android Studio (Android).
- Xcode on macOS for iOS builds.
- A Firebase project with Authentication enabled.

## Connect Firebase
1. Use the Firebase project ID `management-tool-be37b` in the Firebase console: https://console.firebase.google.com/project/management-tool-be37b/overview. Confirm this is the project you intend to use for Easy Life Tools.
2. Register Android package `com.keynoteinfotech.easylifetools` and iOS bundle ID `com.keynoteinfotech.easylifetools`.
3. Enable Email/Password and Google providers in Authentication → Sign-in method.
4. Install the FlutterFire CLI and run from this directory:
   ```sh
   dart pub global activate flutterfire_cli
   flutterfire configure
   ```
   Select `management-tool-be37b` and Android/iOS platforms. This generates `lib/firebase_options.dart`; it is intentionally not committed because it is project-specific.
5. In backend/.env, use `FIREBASE_PROJECT_ID=management-tool-be37b`. Run `flutter pub get`, then `flutter run`.

For native Google sign-in, follow Firebase's platform setup and register each Android signing certificate SHA-1/SHA-256 in Firebase. Verify Google sign-in on physical Android and iOS devices.

## Backend
The API is in `../../backend`. Set its environment variables from `.env.example`, then use `npm install`, `npm run check`, and `npm run dev`.
