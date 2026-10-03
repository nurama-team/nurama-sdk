/* eslint-disable no-console */

/**
 * Example of using the WebSocket functionality in the Nurama SDK.
 * 
 * This example demonstrates:
 * - Connecting to user notifications
 * - Using a separate WebSocket URL
 * - Subscribing to notification events
 * - Handling different notification types
 * - Proper cleanup of connections
 */

import NuramaClient from 'nurama-sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create the client with environment variables, including separate WebSocket URL
const client = new NuramaClient(process.env.API_BASE_URL || 'https://api.nurama.com', {
  debug: true,
  websocketURL: process.env.WS_URL || 'https://orama-socket-staging.23rdc.com', // Use separate WS URL
});

async function main() {
  try {
    // Login to get authenticated
    const loginResult = await client.auth.login({
      login: process.env.TEST_USER_EMAIL,
      password: process.env.TEST_USER_PASSWORD,
    });
    
    console.log('Login successful');
    console.log(loginResult);
    
    // Get the current user ID
    const userId = loginResult.user.id;
    console.log(`User ID: ${userId}`);
    
    // Connect to the user channel
    await client.socket.connect(`/user/${userId}`);
    console.log(`Connected to user channel: /user/${userId}`);
    
    // Subscribe to notification events
    await client.socket.subscribe(`/user/${userId}`, 'notification', handleNotification);
    console.log('Subscribed to notifications');
    
    // Keep the process running to receive notifications
    console.log('Listening for notifications. Press Ctrl+C to exit.');
    
    // Handle cleanup on exit
    process.on('SIGINT', async () => {
      console.log('Cleaning up connections...');
      await client.socket.disconnectAll();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

/**
 * Handler for notification events
 */
function handleNotification(event) {
  console.log('\n--- New Notification ---');
  console.log(`Type: ${event.type}`);
  console.log(`Resource Type: ${event.resourceType}`);
  console.log(`Resource ID: ${event.resourceId}`);
  console.log(`Initiator Type: ${event.initiatorType}`);
  
  if (event.initiator) {
    console.log(`Initiator: ${event.initiator.displayName || event.initiator.name || 'Unknown'}`);
  }
  
  // Process changes based on event type
  if (event.changes) {
    if (event.changes.create && event.changes.create.length > 0) {
      console.log('Created resources:');
      event.changes.create.forEach(item => {
        console.log(`- ${item.resourceType} (ID: ${item.resourceId})`);
      });
    }
    
    if (event.changes.update && event.changes.update.length > 0) {
      console.log('Updated resources:');
      event.changes.update.forEach(item => {
        console.log(`- ${item.resourceType} (ID: ${item.resourceId})`);
      });
    }
    
    if (event.changes.delete && event.changes.delete.length > 0) {
      console.log('Deleted resources:');
      event.changes.delete.forEach(item => {
        console.log(`- ${item.resourceType} (ID: ${item.resourceId})`);
      });
    }
  }
  
  // Handle specific notification types
  switch (event.type) {
  case 'workspaceCreate': {
    const workspace = event.changes?.create?.[0]?.resource;
    if (workspace) {
      console.log(`New workspace created: ${workspace.name}`);
    }
    break;
  }
      
  case 'projectCreate': {
    const project = event.changes?.create?.[0]?.resource;
    if (project) {
      console.log(`New project created: ${project.name}`);
    }
    break;
  }
      
  case 'assetCreate': {
    const assets = event.changes?.create?.filter(item => item.resourceType === 'asset') || [];
    if (assets.length > 0) {
      console.log(`${assets.length} new assets created`);
    }
    break;
  }
      
  case 'membershipCreate':
    console.log('New membership created');
    break;
      
  case 'chatMessageCreate': {
    const message = event.changes?.create?.[0]?.resource;
    if (message) {
      console.log(`New message: ${message.content}`);
    }
    break;
  }
  }
}

// Run the example
main().catch(console.error); 