import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const projectId = process.env.FIREBASE_PROJECT_ID;

if (!projectId) {
  throw new Error('FIREBASE_PROJECT_ID must be configured');
}

const app = getApps()[0] ?? initializeApp({
  credential: applicationDefault(),
  projectId,
});

export const firebaseAuth = getAuth(app);
