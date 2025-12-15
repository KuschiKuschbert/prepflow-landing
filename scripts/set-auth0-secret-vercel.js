#!/usr/bin/env node

/**
 * Set AUTH0_SECRET in Vercel via REST API
 *
 * Usage:
 *   VERCEL_TOKEN=your-token node scripts/set-auth0-secret-vercel.js
 *
 * Or set the secret value directly:
 *   VERCEL_TOKEN=your-token AUTH0_SECRET=your-secret node scripts/set-auth0-secret-vercel.js
 */

const https = require('https');

const AUTH0_SECRET =
  process.env.AUTH0_SECRET || '64d10cbb329ba31d4fb59fc58e53ba47c56fa91e9de08e8a3dc84a9909ef66b1';

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
    console.log('🔐 Setting AUTH0_SECRET in Vercel...\n');

    const vercelToken = process.env.VERCEL_TOKEN;
    if (!vercelToken) {
      console.error('❌ VERCEL_TOKEN environment variable is required');
      console.error('\n💡 Get your token from: https://vercel.com/account/tokens');
      console.error('   Then run: VERCEL_TOKEN=your-token node scripts/set-auth0-secret-vercel.js');
      process.exit(1);
    }

    const projectId = process.env.VERCEL_PROJECT_ID;
    const teamId = process.env.VERCEL_TEAM_ID;

    let finalProjectId = projectId;

    // If project ID not provided, list projects and let user choose
    if (!finalProjectId) {
      console.log('📋 Fetching your Vercel projects...');
      const projects = await getVercelProjects(vercelToken, teamId);

      if (projects.length === 0) {
        console.error('❌ No projects found');
        process.exit(1);
      }

      // Try to find prepflow project
      const prepflowProject = projects.find(
        p =>
          p.name.includes('prepflow') ||
          p.name.includes('PrepFlow') ||
          p.name === 'prepflow-landing',
      );

      if (prepflowProject) {
        finalProjectId = prepflowProject.id;
        console.log(`✅ Found project: ${prepflowProject.name} (${finalProjectId})`);
      } else {
        console.log('\nAvailable projects:');
        projects.forEach((p, i) => {
          console.log(`  ${i + 1}. ${p.name} (${p.id})`);
        });
        console.error('\n❌ Please set VERCEL_PROJECT_ID environment variable');
        console.error('   Or update the script to select the correct project');
        process.exit(1);
      }
    }

    console.log(`\n📋 Project ID: ${finalProjectId}`);
    if (teamId) {
      console.log(`📋 Team ID: ${teamId}`);
    }

    // Check if AUTH0_SECRET already exists
    console.log('\n📥 Checking existing environment variables...');
    const existingVars = await listVercelEnvVars(vercelToken, finalProjectId, teamId);
    const existingAuth0Secret = existingVars.find(
      v => v.key === 'AUTH0_SECRET' && v.target.includes('production'),
    );

    if (existingAuth0Secret) {
      console.log('⚠️  AUTH0_SECRET already exists in production');
      console.log('   Updating existing variable...');

      await updateVercelEnvVar(
        vercelToken,
        finalProjectId,
        teamId,
        existingAuth0Secret.id,
        'AUTH0_SECRET',
        AUTH0_SECRET,
        'production',
      );

      console.log('✅ AUTH0_SECRET updated successfully!');
    } else {
      console.log('➕ Creating new AUTH0_SECRET...');

      await createVercelEnvVar(
        vercelToken,
        finalProjectId,
        teamId,
        'AUTH0_SECRET',
        AUTH0_SECRET,
        'production',
      );

      console.log('✅ AUTH0_SECRET created successfully!');
    }

    console.log(`\n🔑 Secret value: ${AUTH0_SECRET.substring(0, 8)}...`);
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

