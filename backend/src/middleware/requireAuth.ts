import type { NextFunction, Request, Response } from 'express';
import { firebaseAuth } from '../firebase.js';

declare global {
  namespace Express {
    interface Request {
      user?: { uid: string; email?: string };
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.header('authorization');
  const match = header?.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const decoded = await firebaseAuth.verifyIdToken(match[1], true);
    req.user = { uid: decoded.uid, ...(decoded.email ? { email: decoded.email } : {}) };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
}
