#!/usr/bin/env node
/**
 * One-time setup: authorize your personal Google account for Drive uploads.
 *
 * Prerequisites (Google Cloud Console, same project as Drive API):
 *   1. APIs & Services → Credentials → Create OAuth client ID
 *   2. Application type: Desktop app (or Web with redirect http://localhost:3333/oauth2callback)
 *   3. Add to umv-adala/backend/.env:
 *        GOOGLE_OAUTH_CLIENT_ID=...
 *        GOOGLE_OAUTH_CLIENT_SECRET=...
 *
 * Then run: node scripts/get-oauth-token.js
 * Copy the printed GOOGLE_OAUTH_REFRESH_TOKEN into .env and restart the backend.
 */
require('dotenv').config();
const http = require('http');
const { URL } = require('url');
const { google } = require('googleapis');

const REDIRECT_URI = process.env.GOOGLE_OAUTH_REDIRECT_URI || 'http://localhost:3333/oauth2callback';
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error('Missing GOOGLE_OAUTH_CLIENT_ID or GOOGLE_OAUTH_CLIENT_SECRET in .env');
  console.error('Create an OAuth 2.0 Client ID in Google Cloud Console first.');
  process.exit(1);
}

const oauth2 = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI);

const authUrl = oauth2.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: SCOPES,
});

console.log('\nAuthorize this app to upload to your Google Drive:\n');
console.log(authUrl);
console.log('\nWaiting for redirect on', REDIRECT_URI, '...\n');

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:3333`);
    if (url.pathname !== '/oauth2callback') {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const code = url.searchParams.get('code');
    if (!code) {
      res.writeHead(400);
      res.end('Missing authorization code');
      return;
    }

    const { tokens } = await oauth2.getToken(code);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Success!</h1><p>You can close this tab and return to the terminal.</p>');

    console.log('Authorization successful. Add this to umv-adala/backend/.env:\n');
    console.log(`GOOGLE_OAUTH_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log('\nThen restart the backend: node index.js\n');

    server.close();
    process.exit(0);
  } catch (err) {
    console.error('Token exchange failed:', err.message);
    res.writeHead(500);
    res.end('Authorization failed');
    server.close();
    process.exit(1);
  }
});

server.listen(3333, () => {
  console.log('Tip: if the browser does not open automatically, copy the URL above into your browser.');
});
