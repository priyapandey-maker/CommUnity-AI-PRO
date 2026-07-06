/**
 * Vercel Serverless Function entry point.
 *
 * Vercel routes all requests matching /api/* here (see root vercel.json).
 * This module simply imports the compiled Express app from the server build
 * and exports it as a serverless handler.
 *
 * NOTE: `vercel build` runs `npm run build --workspace=server` first,
 * so `../server/dist/app.js` will already exist when this file is evaluated.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const app = require('../server/dist/app').default;

module.exports = app;
