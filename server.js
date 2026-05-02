const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API = 'https://generativelanguage.googleapis.com';

app.use(express.json());

// CORS preflight — must be before app.all
app.options('*', (req, res) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.sendStatus(204);
});

// Health check
app.get('/', (req, res) => res.send('ok'));

// Proxy all Gemini calls
app.all('/v1beta/*', async (req, res) => {
  const target = GEMINI_API + req.originalUrl;
  try {
    const resp = await fetch(target, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
    });
    const data = await resp.json();
    res.set('Access-Control-Allow-Origin', '*');
    res.status(resp.status).json(data);
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

app.listen(PORT, () => console.log('Gemini proxy on', PORT));
