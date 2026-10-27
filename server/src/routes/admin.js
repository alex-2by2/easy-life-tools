import { Router } from 'express';
import User from '../models/User.js';
import { requireAuth, requireOwner } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth, requireOwner);

router.get('/overview', async (_req, res, next) => {
  try {
    const [users, activeUsers, premiumUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: 'active' }),
      User.countDocuments({ plan: 'premium' })
    ]);
    res.json({ overview: { users, activeUsers, premiumUsers } });
  } catch (error) { next(error); }
});

router.get('/users', async (_req, res, next) => {
  try {
    const users = await User.find({})
      .select('name email role plan status createdAt')
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    res.json({ users });
  } catch (error) { next(error); }
});

export default router;
