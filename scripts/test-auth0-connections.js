/**
 * Test script to list all Auth0 connections
 * Run: node scripts/test-auth0-connections.js
 * Note: Requires AUTH0_ISSUER_BASE_URL, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET in environment
 */
const { ManagementClient } = require('auth0');

const issuerBaseUrl = process.env.AUTH0_ISSUER_BASE_URL;
const clientId = process.env.AUTH0_CLIENT_ID;
const clientSecret = process.env.AUTH0_CLIENT_SECRET;

if (!issuerBaseUrl || !clientId || !clientSecret) {
  console.error('Missing Auth0 environment variables');
  process.exit(1);
}

const domain = issuerBaseUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
const applicationClientId = clientId;

async function listConnections() {
  try {
    const client = new ManagementClient({
      domain,
      clientId,
      clientSecret,
    });

    console.log('\n🔍 Fetching all Auth0 connections...\n');

    const connectionsResponse = await client.connections.getAll();
    const connections = Array.isArray(connectionsResponse)
      ? connectionsResponse
      : connectionsResponse?.data || [];

    if (!connections || !Array.isArray(connections)) {
      console.log('❌ No connections found or invalid response format');
      return;
    }

    console.log(`✅ Found ${connections.length} total connections\n`);

    // Filter for Apple and Microsoft
    const appleConnections = connections.filter(
      conn => conn.strategy === 'apple' || conn.name?.toLowerCase().includes('apple'),
    );
    const microsoftConnections = connections.filter(
      conn =>
        conn.strategy === 'windowslive' ||
        conn.strategy === 'waad' ||
        conn.strategy === 'microsoft-account' ||
        conn.name?.toLowerCase().includes('microsoft') ||
        conn.name?.toLowerCase().includes('windows'),
    );

    console.log('🍎 APPLE CONNECTIONS:');
    if (appleConnections.length === 0) {
      console.log('   ❌ No Apple connections found\n');
    } else {
      appleConnections.forEach(conn => {
        const enabled = conn.enabled_clients?.includes(applicationClientId) || false;
        console.log(`   ${enabled ? '✅' : '⚠️'} ${conn.name} (${conn.strategy})`);
        console.log(`      ID: ${conn.id}`);
        console.log(`      Enabled for app: ${enabled}`);
        console.log(`      Enabled clients: ${conn.enabled_clients?.length || 0}`);
        console.log('');
      });
    }

    console.log('🔷 MICROSOFT CONNECTIONS:');
    if (microsoftConnections.length === 0) {
      console.log('   ❌ No Microsoft connections found\n');
    } else {
      microsoftConnections.forEach(conn => {
        const enabled = conn.enabled_clients?.includes(applicationClientId) || false;
        console.log(`   ${enabled ? '✅' : '⚠️'} ${conn.name} (${conn.strategy})`);
        console.log(`      ID: ${conn.id}`);
        console.log(`      Enabled for app: ${enabled}`);
        console.log(`      Enabled clients: ${conn.enabled_clients?.length || 0}`);
        console.log('');
      });
    }

    console.log('\n📋 ALL CONNECTIONS (first 20):');
    connections.slice(0, 20).forEach(conn => {
      const enabled = conn.enabled_clients?.includes(applicationClientId) || false;
      console.log(
        `   ${enabled ? '✅' : '⚠️'} ${conn.name || 'N/A'} (${conn.strategy}) - Enabled: ${enabled}`,
      );
    });

    if (connections.length > 20) {
      console.log(`   ... and ${connections.length - 20} more connections`);
    }

    console.log('\n💡 Connection names to use in URL:');
    if (appleConnections.length > 0) {
      appleConnections.forEach(conn => {
        console.log(`   Apple: /api/auth/login?connection=${conn.name}`);
      });
    }
    if (microsoftConnections.length > 0) {
      microsoftConnections.forEach(conn => {
        console.log(`   Microsoft: /api/auth/login?connection=${conn.name}`);
      });
    }
  } catch (error) {
    console.error('❌ Error fetching connections:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
  }
}

listConnections();
