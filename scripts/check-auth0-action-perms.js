const https = require('https');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
      }
    });
  }
}

async function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  loadEnv();
  const domain = 'dev-7myakdl4itf644km.us.auth0.com';
  const client_id = process.env.AUTH0_M2M_CLIENT_ID;
  const client_secret = process.env.AUTH0_M2M_CLIENT_SECRET;

  console.log(`Checking domain: ${domain}`);

  const tokenRes = await request(
    {
      hostname: domain,
      path: '/oauth/token',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      client_id,
      client_secret,
      audience: `https://${domain}/api/v2/`,
      grant_type: 'client_credentials',
    },
  );

  if (tokenRes.statusCode !== 200) {
    console.error('Failed to get token:', tokenRes.body);
    return;
  }

  const token = JSON.parse(tokenRes.body).access_token;

  // Check actions
  const actionsRes = await request({
    hostname: domain,
    path: '/api/v2/actions/actions',
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log('Actions status:', actionsRes.statusCode);
  if (actionsRes.statusCode === 200) {
    console.log('Successfully listed actions. We have read:actions scope.');
  } else {
    console.log('Failed to list actions:', actionsRes.body);
  }
}

main();
