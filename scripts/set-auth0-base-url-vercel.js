#!/usr/bin/env node

/**
 * Set AUTH0_BASE_URL in Vercel via REST API
 *
 * Usage:
 *   VERCEL_TOKEN=your-token node scripts/set-auth0-base-url-vercel.js
 */

const https = require('https');

const AUTH0_BASE_URL = 'https://www.prepflow.org';

function httpsRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ data: parsed, statusCode: res.statusCode });
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${parsed.error?.message || data}`));
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ data, statusCode: res.statusCode });
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        }
      });
    });

    req.on('error', error => {
      reject(error);
    });

    if (postData) {
      req.write(postData);
    }

    req.end();
  });
}

async function getVercelProjects(vercelToken, teamId) {
  const teamParam = teamId ? `?teamId=${teamId}` : '';
  const options = {
    hostname: 'api.vercel.com',
    path: `/v9/projects${teamParam}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${vercelToken}`,
    },
  };

  const result = await httpsRequest(options);
  return result.data.projects || [];
}

async function listVercelEnvVars(vercelToken, projectId, teamId) {
  const teamParam = teamId ? `?teamId=${teamId}` : '';
  const options = {
    hostname: 'api.vercel.com',
    path: `/v9/projects/${projectId}/env${teamParam}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${vercelToken}`,
    },
  };

  const result = await httpsRequest(options);
  return result.data.envs || [];
}

async function createVercelEnvVar(
  vercelToken,
  projectId,
  teamId,
  key,
  value,
  environment = 'production',
) {
  const teamParam = teamId ? `?teamId=${teamId}` : '';
  const postData = JSON.stringify({
    key,
    value,
    type: 'encrypted',
    target: [environment],
  });

  const options = {
    hostname: 'api.vercel.com',
    path: `/v9/projects/${projectId}/env${teamParam}`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${vercelToken}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  const result = await httpsRequest(options, postData);
  return result.data;
}

async function updateVercelEnvVar(
  vercelToken,
  projectId,
  teamId,
  envVarId,
  key,
  value,
  environment = 'production',
) {
  const teamParam = teamId ? `?teamId=${teamId}` : '';
  const postData = JSON.stringify({
    key,
    value,
    type: 'encrypted',
    target: [environment],
  });

  const options = {
    hostname: 'api.vercel.com',
    path: `/v9/projects/${projectId}/env/${envVarId}${teamParam}`,
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${vercelToken}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  const result = await httpsRequest(options, postData);
  return result.data;
}

async function main() {
  try {
    console.log('🔐 Setting AUTH0_BASE_URL in Vercel...\n');

    const vercelToken = process.env.VERCEL_TOKEN;
    if (!vercelToken) {
      console.error('❌ VERCEL_TOKEN environment variable is required');
      console.error('\n💡 Get your token from: https://vercel.com/account/tokens');
      console.error(
        '   Then run: VERCEL_TOKEN=your-token node scripts/set-auth0-base-url-vercel.js',
      );
      process.exit(1);
    }

    const projectId = process.env.VERCEL_PROJECT_ID || 'prj_TC0avSF066KXEO4CrrBpmVvhlDXL';
    const teamId = process.env.VERCEL_TEAM_ID;

    console.log(`📋 Project ID: ${projectId}`);
    if (teamId) {
      console.log(`📋 Team ID: ${teamId}`);
    }

    // Check if AUTH0_BASE_URL already exists
    console.log('\n📥 Checking existing environment variables...');
    const existingVars = await listVercelEnvVars(vercelToken, projectId, teamId);
    const existingAuth0BaseUrl = existingVars.find(
      v => v.key === 'AUTH0_BASE_URL' && v.target.includes('production'),
    );

    if (existingAuth0BaseUrl) {
      console.log('⚠️  AUTH0_BASE_URL already exists in production');
      console.log('   Updating existing variable...');

      await updateVercelEnvVar(
        vercelToken,
        projectId,
        teamId,
        existingAuth0BaseUrl.id,
        'AUTH0_BASE_URL',
        AUTH0_BASE_URL,
        'production',
      );

      console.log('✅ AUTH0_BASE_URL updated successfully!');
    } else {
      console.log('➕ Creating new AUTH0_BASE_URL...');

      await createVercelEnvVar(
        vercelToken,
        projectId,
        teamId,
        'AUTH0_BASE_URL',
        AUTH0_BASE_URL,
        'production',
      );

      console.log('✅ AUTH0_BASE_URL created successfully!');
    }

    console.log(`\n🔑 Base URL: ${AUTH0_BASE_URL}`);
    console.log('\n⚠️  IMPORTANT: You must redeploy for the change to take effect!');
    console.log('   Go to: Vercel Dashboard → Deployments → Redeploy');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.message.includes('401') || error.message.includes('403')) {
      console.error('   Authentication failed. Check your VERCEL_TOKEN');
      console.error('   Get your token from: https://vercel.com/account/tokens');
    } else if (error.message.includes('404')) {
      console.error('   Project not found. Check your VERCEL_PROJECT_ID');
    }
    process.exit(1);
  }
}

main();
