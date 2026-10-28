import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { z } from 'zod';
import { requireAuth } from './middleware/requireAuth.js';
import { Task } from './models/Task.js';

const app = express();
const port = Number(process.env.PORT ?? 8080);
const allowedOrigins = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '32kb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.get('/api/me', requireAuth, (req, res) => {
  res.json({ uid: req.user!.uid, email: req.user!.email ?? null });
});

const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
});
const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  completed: z.boolean().optional(),
}).refine((value) => Object.keys(value).length > 0);

app.get('/api/tasks', requireAuth, async (req, res, next) => {
  try {
    const tasks = await Task.find({ ownerUid: req.user!.uid }).sort({ createdAt: -1 }).lean();
    res.json({ tasks });
  } catch (error) { next(error); }
});

app.post('/api/tasks', requireAuth, async (req, res, next) => {
  const parsed = createTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid task', details: parsed.error.flatten() });
    return;
  }
  try {
    const task = await Task.create({ ownerUid: req.user!.uid, title: parsed.data.title });
    res.status(201).json({ task });
  } catch (error) { next(error); }
});

app.patch('/api/tasks/:id', requireAuth, async (req, res, next) => {
  const parsed = updateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid task update', details: parsed.error.flatten() });
    return;
  }
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, ownerUid: req.user!.uid },
      { $set: parsed.data },
      { new: true, runValidators: true },
    );
    if (!task) { res.status(404).json({ error: 'Task not found' }); return; }
    res.json({ task });
  } catch (error) { next(error); }
});

app.delete('/api/tasks/:id', requireAuth, async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, ownerUid: req.user!.uid });
    if (!task) { res.status(404).json({ error: 'Task not found' }); return; }
    res.status(204).end();
  } catch (error) { next(error); }
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof Error && error.message === 'Origin not allowed by CORS') {
    res.status(403).json({ error: 'Origin not allowed' });
    return;
  }
  console.error('Unhandled API error', error);
  res.status(500).json({ error: 'Internal server error' });
});

async function start() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGODB_URI must be configured');
  await mongoose.connect(mongoUri);
  app.listen(port, () => console.info(`Easy Life Tools API listening on port ${port}`));
}

start().catch((error: unknown) => {
  console.error('Failed to start API', error);
  process.exit(1);
});
