// Local-only dev helper: runs the site (via Vite) AND the /api/* serverless
// functions together on one URL, WITHOUT needing `vercel dev` or a Vercel
// login. This exists purely so paid-game/payment testing works on localhost
// before deploying. Not used in production — Vercel runs api/*.ts natively
// there.
//
// Usage: npx tsx scripts/dev-with-api.mjs
// Then open the URL it prints (usually http://localhost:3000).

import { createServer as createViteServer } from 'vite';
import http from 'node:http';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const API_PORT = 3001;
const APP_PORT = 3000;

const apiServer = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${API_PORT}`);

  if (!url.pathname.startsWith('/api/')) {
    res.writeHead(404, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: 'Not an API route' }));
    return;
  }

  const routeName = url.pathname.slice('/api/'.length);
  if (!routeName || routeName.startsWith('_')) {
    res.writeHead(404, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: `No such API route: ${routeName}` }));
    return;
  }

  let mod;
  try {
    mod = await import(`../api/${routeName}.ts`);
  } catch (err) {
    console.error(`[local-api] failed to load api/${routeName}.ts`, err);
    res.writeHead(404, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: `No such API route: ${routeName}` }));
    return;
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks).toString('utf-8');
  const contentType = req.headers['content-type'] || '';

  let body = {};
  if (contentType.includes('application/json')) {
    try {
      body = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      body = {};
    }
  } else if (contentType.includes('application/x-www-form-urlencoded')) {
    body = Object.fromEntries(new URLSearchParams(rawBody));
  }

  req.body = body;
  req.query = Object.fromEntries(url.searchParams);
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(data));
  };

  try {
    await mod.default(req, res);
  } catch (err) {
    console.error(`[local-api] /api/${routeName} threw:`, err);
    if (!res.headersSent) {
      res.status(500).json({ ok: false, error: 'Internal error' });
    }
  }
});

apiServer.listen(API_PORT, () => {
  console.log(`[local-api] serving /api/* internally on http://localhost:${API_PORT}`);
});

const vite = await createViteServer({
  server: {
    port: APP_PORT,
    strictPort: true,
    proxy: {
      '/api': {
        target: `http://localhost:${API_PORT}`,
        changeOrigin: true,
      },
    },
  },
});

await vite.listen();
console.log('');
vite.printUrls();
console.log('\n(API routes are proxied through automatically — just use the URL above.)');
