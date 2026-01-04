const fs = require('fs');

function decodeToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    return payload;
  } catch (e) {
    console.error('Error decoding token:', e.message);
    return null;
  }
}

async function main() {
  const token = process.argv[2];
  if (!token) {
    console.log('Usage: node scripts/verify-id-token.js <YOUR_ID_TOKEN>');
    console.log(
      '\nTo get your token: Pull the latest curbos-app, login, and look for "Auth0 Success! ID Token: ..." in the Android Studio Logcat.',
    );
    return;
  }

  const payload = decodeToken(token);
  if (!payload) return;

  console.log('\n--- Token Payload ---');
  console.log(JSON.stringify(payload, null, 2));
  console.log('---------------------\n');

  if (payload.role === 'authenticated') {
    console.log('✅ SUCCESS: The "role: authenticated" claim is present!');
    console.log('Supabase will recognize this user correctly.');
  } else {
    console.log('❌ FAILED: The "role" claim is missing or incorrect.');
    console.log('Current role:', payload.role || 'undefined');
    console.log('\nMake sure you have:');
    console.log('1. Created the "Add Role to Supabase" Action in Auth0.');
    console.log('2. Deployed the Action.');
    console.log('3. Added it to the "Login" flow.');
  }
}

main();
