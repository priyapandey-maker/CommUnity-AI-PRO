import express, { Application } from 'express';
import cors from 'cors';
import {
  healthRouter,
  incidentRouter,
  analyzeRouter,
  decisionRouter,
  ledgerRouter,
  authRouter,
  notificationRouter,
  analyticsRouter,
} from './routes';
import { authMiddleware } from './middleware/authMiddleware';
import { roleMiddleware } from './middleware/roleMiddleware';
import { Role } from '@community-ai/shared';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

// ── Middleware ──────────────────────────────────────────────
// Restrict CORS origin via CORS_ORIGIN env var in production.
// Falls back to '*' in development so local dev works out of the box.
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────
app.use('/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/incident', incidentRouter); // Keep for backwards compatibility
app.use('/api/incidents', incidentRouter); // New route matching REST pattern
app.use('/analyze', authMiddleware, roleMiddleware([Role.AUTHORITY, Role.ADMIN]), analyzeRouter);
app.use('/decision', authMiddleware, decisionRouter);
app.use('/api/decision', authMiddleware, decisionRouter);
app.use('/ledger', authMiddleware, ledgerRouter);
app.use('/api/ledger', authMiddleware, ledgerRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/analytics', analyticsRouter);

// ── Error handler (must be last) ────────────────────────────
app.use(errorHandler);

export default app;
