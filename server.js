const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API = 'https://generativelanguage.googleapis.com';

app.use(express.json());

// 所有 request forward 去 Gemini
app.all('/*', async (req, res) => {
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

app.options('*', (req, res) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.sendStatus(204);
});

app.listen(PORT, () => console.log('Gemini proxy on', PORT));
