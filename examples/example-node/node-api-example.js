/* eslint-disable no-console */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import NuramaClient from '../../dist/NuramaClient.js';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '.env') });

// --- Configuration ---
// Read credentials and API URL from environment variables
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'; // Default if not set
const { TEST_USER_EMAIL, TEST_USER_PASSWORD } = process.env;

if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
  console.error('Error: Please set TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables in .env file or system environment.');
  console.error('Expected environment variables:');
  console.error('  API_BASE_URL - API endpoint (defaults to http://localhost:3000)');
  console.error('  TEST_USER_EMAIL - Your test user email');
  console.error('  TEST_USER_PASSWORD - Your test user password');
  process.exit(1);
}
console.log({
  login: TEST_USER_EMAIL,
  password: TEST_USER_PASSWORD,
});
// --- Test Execution ---
async function runTest() {
  console.log(`Connecting to API at: ${API_BASE_URL}`);
  const client = new NuramaClient(API_BASE_URL, {
    mode: 'node', // Use in-memory token storage for Node.js script
  });

  try {
    console.log(`Attempting login for user: ${TEST_USER_EMAIL}...`);
    const loginResult = await client.auth.login({
      login: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    });

    // Check if login was successful (might require MFA)
    if (loginResult && loginResult.user && loginResult.tokens && loginResult.tokens.access) {
      console.log('Login successful!');
      console.log('User details from login:', loginResult.user);

      // Get user ID from login result to fetch full profile if needed
      const userId = loginResult.user.id;

      console.log(`Fetching data for user ID: ${userId}...`);
      // Note: getUser typically returns public data.
      // For the user fetching their own full profile, a dedicated endpoint
      // like /users/me might be more appropriate in a real API,
      // but we'll use getUser as per the available methods.
      const userData = await client.user.getUser(userId);
      console.log('Fetched user data:');
      console.log(JSON.stringify(userData, null, 2));
    } else if (loginResult && loginResult.tokens && loginResult.tokens.verifyMfa) {
      console.log('Login requires MFA verification. MFA token:', loginResult.tokens.verifyMfa);
      console.warn('Test script cannot complete MFA flow. User data not fetched.');
    } else {
      console.error('Login failed for an unknown reason. Response:', loginResult);
      process.exit(1);
    }
  } catch (error) {
    console.error('\n--- Test Failed ---');
    if (error.response) {
      // Log Axios-like error details if available (depends on fetch implementation)
      console.error(`Status: ${error.response.status}`);
      console.error('Data:', error.response.data);
    } else if (error.status && error.data) {
      // Log details from the custom error thrown by _request
      console.error(`Status: ${error.status}`);
      console.error('Error Data:', error.data);
      console.error(`Message: ${error.message}`);
    } else {
      // Log generic error
      console.error('Error:', error.message);
      console.error(error.stack);
    }
    process.exit(1);
  }
}

runTest();