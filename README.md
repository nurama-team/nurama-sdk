# Nurama SDK

Provides API, web-socket, and additional utilities for interfacing with the Nurama platform.

## Installation

```bash
npm install nurama-sdk
```

## Usage

### Basic API Usage

```javascript
import NuramaClient from 'nurama-sdk';

// Create client instance
const client = new NuramaClient('https://api.nurama.com', {
  debug: true, // Optional: Enable debug logging
});

// Login to get token
await client.auth.login({
  email: 'user@example.com',
  password: 'yourpassword',
});

// Make API calls using the client
const workspaces = await client.workspace.listWorkspaces();
console.log(workspaces);
```

### WebSocket Support

The SDK provides WebSocket functionality for real-time notifications and events. Socket.IO is used under the hood, which handles protocol conversion automatically.

```javascript
import NuramaClient from 'nurama-sdk';

// Create client instance with a separate WebSocket server URL if needed
const client = new NuramaClient('https://api.nurama.com', {
  websocketURL: 'https://ws.nurama.com', // Optional: Can use HTTP/HTTPS URLs (Socket.IO handles protocol)
  browserMode: false, // Set to true for browser environments that need localStorage
});

// Login first to authenticate
await client.auth.login({
  email: 'user@example.com',
  password: 'yourpassword',
});

// Connect to a user channel
const userId = '123456789';
await client.socket.connect(`/user/${userId}`);

// Connect to a channel with a different WebSocket URL just for this connection
await client.socket.connect('/workspace/456', {
  websocketURL: 'https://alt-ws.nurama.com' // Can use HTTP/HTTPS URLs
});

// Subscribe to notifications
await client.socket.subscribe(`/user/${userId}`, 'notification', (event) => {
  console.log('Received notification:', event);
  
  // Handle different notification types
  switch (event.type) {
    case 'workspaceCreate':
      console.log('New workspace created:', event.changes?.create?.[0]?.resource);
      break;
    case 'projectUpdate':
      console.log('Project updated:', event.changes?.update?.[0]?.resource);
      break;
    // Handle other event types
  }
});

// Disconnect when done
await client.socket.disconnect(`/user/${userId}`);
```

#### WebSocket Methods

- `connect(channel, options)`: Connect to a WebSocket channel
- `disconnect(channel)`: Disconnect from a channel
- `disconnectAll()`: Disconnect from all channels
- `subscribe(channel, event, callback)`: Subscribe to an event on a channel
- `unsubscribe(channel, event, callback?)`: Unsubscribe from an event
- `isConnected(channel)`: Check if connected to a channel

#### Connection Options

```javascript
const options = {
  autoRefresh: true,           // Auto refresh token when expired
  autoReconnect: true,         // Auto reconnect on disconnection
  autoReconnectOnTokenExpiry: true, // Auto reconnect when token expires
  debug: false,                // Enable debug logging
  websocketURL: 'https://custom-ws.nurama.com' // Override WebSocket URL for this connection
};

await client.socket.connect('/user/123', options);
```

## Documentation

For detailed API documentation, see the [API Reference](https://docs.nurama.com).

## Bot SDK

For programmatic / integration use cases, import `BotClient` from the `/bot` subpath. It authenticates with a long-lived API key (`nrm_bot_...`) instead of a JWT, defaults `baseURL` to the bot subdomain, and skips token refresh logic.

```javascript
import BotClient from '@nurama/sdk/bot';

const bot = new BotClient(process.env.NURAMA_BOT_API_KEY);
const workspaces = await bot.workspace.listWorkspaces();
```

### Constructor

```ts
new BotClient(apiKey: string, options?: {
  baseURL?: string;              // Default: 'https://bot.nurama.com'
  websocketURL?: string;         // Default: 'https://bot-ws.nurama.com'
  fetch?: typeof fetch;          // Custom fetch implementation
  debug?: boolean;
  enableCache?: boolean;         // Default: true
  cacheDurationSeconds?: number; // Default: 5
});
```

### Exposed Namespaces

`workspace`, `project`, `asset`, `chat`, `folder`, `invite`, `membership`, `notification`, `storage`, `task`, `tag`, `settings`, `shortlink`, `convo`, `board`, `version`, `config`, `product`, `public`, `socket`.

### WebSocket Subscriptions

Bots can subscribe to real-time events using the same `socket` API as the regular SDK. Connections go to the bot WS subdomain (`bot-ws.nurama.com` by default) and authenticate with the API key as the query param `token`.

```ts
import BotClient from '@nurama/sdk/bot';

const bot = new BotClient(process.env.NURAMA_BOT_API_KEY!);

await bot.socket.subscribe(`/workspace/${workspaceId}`, 'notification', (event) => {
  console.log('Bot received:', event.type, event);
});
```

API keys don't expire client-side, so the SDK skips the JWT-refresh path. If the server emits `tokenEvent: TokenExpired` or `tokenBlacklisted` for a bot connection (e.g., the key was revoked), the SDK disconnects without retrying.

The following namespaces are intentionally omitted (the server rejects bot calls to them with `botAccountRestricted`):

- `auth` — login, MFA, password, OAuth
- `user` — profile editing
- `payment`, `subscription` — billing
- `device` — push notification routing

Bot management (creating / rotating / deleting other bots) is also restricted server-side and is not exposed here. Workspace admins manage bots via the regular `NuramaClient` with their JWT.

### Browser Usage

```html
<script src="https://cdn.nurama.com/nurama-bot-sdk.min.js"></script>
<script>
  const bot = new NuramaBotClient('nrm_bot_...');
  bot.workspace.listWorkspaces().then(console.log);
</script>
```

## Distribution Formats

The SDK is distributed in multiple formats:

- **ES Module**: `dist/NuramaClient.js` - For modern JavaScript environments with module support
- **Bot ES Module**: `dist/BotClient.js` — API-key client for bots, imported via `@nurama/sdk/bot`
- **Browser bundle**: `dist/browser/nurama-sdk.js` - IIFE bundle for direct browser usage
- **Bot Browser bundle**: `dist/browser/nurama-bot-sdk.js` — IIFE bot bundle (exposes `window.NuramaBotClient`)
- **TypeScript definitions**: `dist/NuramaClient.d.ts` - Type definitions for TypeScript projects

## Initiation Options

The `NuramaClient` constructor accepts various options for customization:

```javascript
// Import the client
import NuramaClient from 'nurama-sdk';

// Initialize with options
const nurama = new NuramaClient('https://api.nurama.com', {
  // Custom fetch implementation (optional)
  fetch: customFetchFunction,
  
  // Storage key names (optional)
  tokenStorageKey: 'custom_access_token',
  refreshTokenStorageKey: 'custom_refresh_token',
  
  // Whether to run in browser mode (uses localStorage for token storage)
  browserMode: false, // Default: false - set to true for browser environments
  
  // WebSocket server URL (if different from API URL)
  websocketURL: 'https://ws.nurama.com', // Socket.IO handles protocol conversion
  
  // Token refresh settings
  tokenExpiryBufferSeconds: 60,
  tokenRefreshRetryDelayMs: 100,
  tokenRefreshMaxWaitMs: 1000,
  refreshLockTimeoutMs: 1000,
  
  // Response caching settings
  enableCache: true,           // Enable/disable caching (default: true)
  cacheDurationSeconds: 5,     // Cache duration in seconds (default: 5)
  
  // Enable debug mode
  debug: false
});
```

## Response Caching

The Nurama SDK includes a built-in response caching mechanism that can improve performance by avoiding redundant API calls.

### Configuration

The caching system is configured through constructor options:

```typescript
const client = new NuramaClient('https://api.nurama.com', {
  enableCache: true,           // Enable/disable caching (default: true)
  cacheDurationSeconds: 5,     // Cache duration in seconds (default: 5)
  debug: true                  // Enable debug logging to see cache hits
});
```

### Default Behavior

- **Enabled by default**: Caching is enabled unless explicitly disabled
- **5-second cache**: Responses are cached for 5 seconds by default
- **GET/HEAD and select POST requests**: GET and HEAD requests are cached, plus specific read-only POST endpoints
- **Notification endpoints**: POST requests to notification endpoints (`/v1/notifications/count`, `/v1/notifications/count/bulk`, etc.) are cached since they are read-only query operations
- **Concurrent request handling**: Multiple identical requests will share the same response

### Usage Examples

#### Basic Usage

```typescript
// First call - makes API request and caches response
const users1 = await client.user.getUserSelf();

// Second call within 5 seconds - returns cached response
const users2 = await client.user.getUserSelf(); // Cache hit!
```

#### Bypassing Cache

Some route methods may support a `bypassCache` option:

```typescript
// This would bypass cache if the method supports it
const freshData = await client.user.getUserSelf({ bypassCache: true });
```

#### Concurrent Requests

```typescript
// Both requests will share the same API call and response
const [users1, users2] = await Promise.all([
  client.user.getUserSelf(),
  client.user.getUserSelf()
]);
// Only one actual API request is made
```

#### Cache Management

```typescript
// Clear all cached responses
client.clearCache();

// Get cache statistics for debugging
const stats = client.getCacheStats();
console.log(`Cache size: ${stats.size}`);
console.log('Cache entries:', stats.entries);
```

### Chat Reactions

The SDK supports creating and removing reactions on chat messages:

```javascript
// Add a reaction to a message
await client.chat.createReaction('messageId123', {
  emoji: '👍'
});

// Update an existing reaction (replaces user's previous reaction)
await client.chat.createReaction('messageId123', {
  emoji: '❤️'
});

// Remove your reaction from a message
await client.chat.removeReaction('messageId123');
```

### Upload Progress Persistence

The SDK now includes built-in upload progress persistence and cross-tab synchronization for multipart uploads. This feature allows uploads to continue tracking their progress even after page refreshes or when switching between browser tabs.

#### Features

- **Automatic Progress Persistence**: Upload progress is saved to localStorage during upload
- **Project Isolation**: Each project maintains separate upload sessions
- **Cross-Tab Synchronization**: Upload progress syncs across all browser tabs in real-time
- **Session Recovery**: Retrieve and resume tracking uploads after page refresh
- **Automatic Cleanup**: Old and completed sessions are cleaned up automatically

#### Usage

Enable progress persistence when uploading files:

```javascript
// Upload with progress persistence enabled
const uploadResult = await client.asset.multipartUpload(
  file,
  signedUrls,
  key,
  uploadId,
  {
    // Enable automatic progress persistence
    enableProgressPersistence: true,
    
    // Required: Project ID for session isolation
    projectId: 'project123',
    
    // Optional: Custom session ID (auto-generated if not provided)
    sessionId: 'custom-session-id',
    
    // Optional: Additional metadata
    fileName: 'video.mp4',
    fileSize: 50 * 1024 * 1024, // 50MB
    assetId: 'asset123', // Once available from backend
    
    // Your existing progress callback still works
    onProgress: (progress) => {
      console.log(`Upload progress: ${progress.totalPercentComplete}%`);
    }
  }
);
```

#### Managing Upload Sessions

Retrieve active upload sessions for a project:

```javascript
// Get all upload sessions for a project
const sessions = client.asset.getUploadSessions('project123');
sessions.forEach(session => {
  console.log(`Upload ${session.fileName}: ${session.progress}% complete`);
  console.log(`Status: ${session.status}`); // 'uploading', 'completing', 'completed', 'failed', 'cancelled'
});

// Get specific upload session
const session = client.asset.getUploadSession('project123', 'session-id');

// Remove a session manually
client.asset.removeUploadSession('project123', 'session-id');

// Clean up old sessions (default: 24 hours)
client.asset.cleanupUploadSessions('project123');
// Or specify custom age threshold
client.asset.cleanupUploadSessions('project123', 7 * 24 * 60 * 60 * 1000); // 7 days
```

#### Cross-Tab Synchronization

Listen for upload progress updates from other tabs:

```javascript
// Register a listener for cross-tab messages
client.asset.onUploadSessionMessage('my-listener', (message) => {
  console.log(`Upload event from another tab:`, message);
  
  switch (message.type) {
    case 'upload_progress_update':
      console.log(`Progress update for ${message.sessionId}: ${message.data.progress}%`);
      break;
    case 'upload_status_change':
      console.log(`Status change for ${message.sessionId}: ${message.data.status}`);
      break;
    case 'upload_cleanup':
      console.log(`Upload ${message.sessionId} was removed`);
      break;
  }
});

// Unregister listener when done
client.asset.offUploadSessionMessage('my-listener');
```

#### Upload Session Data Structure

Each upload session contains the following information:

```typescript
interface UploadSessionData {
  sessionId: string;         // Unique session identifier
  projectId: string;         // Project ID for isolation
  uploadId: string;          // S3 multipart upload ID
  key: string;               // S3 object key
  assetId?: string;          // Backend asset ID (once available)
  
  // Progress tracking
  progress: number;          // Overall progress (0-100)
  partNumber: number;        // Current part being uploaded
  totalParts: number;        // Total number of parts
  completedParts: number[];  // Array of completed part numbers
  
  // Metadata
  fileName: string;          // Original file name
  fileSize: number;          // File size in bytes
  timestamp: number;         // Last update timestamp
  status: 'uploading' | 'completing' | 'completed' | 'failed' | 'cancelled';
  
  // Optional error information
  error?: string;            // Error message if failed
}
```

#### Complete Example

```javascript
// Start an upload with persistence
const file = document.getElementById('fileInput').files[0];
const { signedUrlData } = await client.project.createAssets('project123', {
  files: [{ name: file.name, sizeInMB: file.size / 1024 / 1024, checksum: 'abc123' }]
});

// Upload with progress persistence
await client.asset.multipartUpload(
  file,
  signedUrlData.urls,
  signedUrlData.key,
  signedUrlData.uploadId,
  {
    enableProgressPersistence: true,
    projectId: 'project123',
    fileName: file.name,
    fileSize: file.size,
    onProgress: updateProgressBar
  }
);

// Complete the upload
await client.asset.completeUpload({
  key: signedUrlData.key,
  uploadId: signedUrlData.uploadId,
  parts: uploadResult.parts
});

// Mark session as completed
client.asset.completeUploadSession('project123', sessionId);
```

### File System Operations

The SDK now supports advanced file system operations for organizing and managing project assets and folders:

```javascript
// Create a folder with file system integration
await client.project.createFolder('projectId123', 'creator', {
  name: 'New Folder',
  basePath: '/project/projectId123/creator'
});

// Get items at a specific file system path
const items = await client.project.getItemsAtPath(
  'projectId123', 
  'creator', 
  '/project/projectId123/creator/folder1',
  {
    limit: 20,
    mediaTypes: ['image', 'video'],
    nameSearch: 'test'
  }
);

// Move items to a new location
await client.project.moveItemsToPath('projectId123', 'creator', {
  itemPaths: ['/project/projectId123/creator/folder1/asset1'],
  destinationPath: '/project/projectId123/creator/folder2'
});

// Publish items with file system support
await client.project.publishItems('projectId123', {
  resourceIds: ['assetId1', 'folderId1'],
  basePath: '/project/projectId123/creator',
  sendEmailNotification: true
});

// Copy items to a new location
await client.project.copyItemsToPath('projectId123', 'creator', {
  itemPaths: ['/project/projectId123/creator/folder1/asset1'],
  destinationPath: '/project/projectId123/creator/folder2'
});
```

### Tag Management

The SDK supports tagging and untagging assets and folders:

```javascript
// Tag an asset
await client.asset.tagAsset('assetId123', {
  tagId: 'tagId123'
});

// Remove a tag from an asset
await client.asset.untagAsset('assetId123', {
  tagId: 'tagId123'
});

// Tag a folder
await client.folder.tagFolder('folderId123', {
  tagId: 'tagId123'
});

// Remove a tag from a folder
await client.folder.untagFolder('folderId123', {
  tagId: 'tagId123'
});
```

### Debug Output

When `debug: true` is enabled, you'll see cache-related log messages:

```
[DEBUG] Cache hit for key: {"endpoint":"/v1/users","method":"GET","params":{},"body":null}
[DEBUG] Cached response for key: {"endpoint":"/v1/users","method":"GET","params":{},"body":null}
[DEBUG] Returning pending promise for concurrent request: {"endpoint":"/v1/users","method":"GET","params":{},"body":null}
[DEBUG] Cache cleared
```

### Cache Key Generation

Cache keys are generated based on:
- Endpoint URL
- HTTP method
- Query parameters (sorted)
- Request body

This ensures that different requests are cached separately while identical requests share the same cache entry.

### Limitations

- Only GET and HEAD requests are cached
- Cache is in-memory only (cleared when client is destroyed)
- No persistent storage across page reloads in browser mode
- Authentication/refresh token requests are never cached

## URL Parameter Handling

The Nurama SDK includes a sophisticated URL parameter utility that automatically transforms complex JavaScript objects into URL-safe query parameters for all API requests.

### Automatic Integration

The URL parameter handling is **automatically applied to ALL routes** through the `NuramaClient._request()` method. Every route that accepts parameters benefits from this functionality without requiring individual updates. You can pass complex parameter objects containing arrays, nested objects, and various data types, and they will be properly serialized:

```javascript
// Complex parameters are automatically handled
const assets = await client.project.getAssets('project123', 'creator', {
  page: 1,
  limit: 20,
  search: 'test query',
  tags: ['important', 'urgent'],           // Arrays become comma-separated
  filters: {                               // Objects become JSON strings
    status: ['active', 'pending'],
    dateRange: {
      start: '2024-01-01',
      end: '2024-12-31'
    }
  },
  sort: { createdAt: -1, priority: 1 },
  active: true,                            // Booleans converted to strings
  startDate: new Date('2024-01-01')        // Dates properly formatted
});
```

### Default Configuration

The SDK uses optimized defaults for the Nurama API:

- **arrayFormat**: `'comma'` - Arrays are serialized as comma-separated values
- **objectFormat**: `'bracket'` - Objects are serialized using bracket notation  
- **encode**: `true` - All values are URL encoded

### Route Coverage

**All routes automatically inherit this functionality**, including:

- ✅ **Authentication routes** (`client.auth.*`)
- ✅ **Asset routes** (`client.asset.*`)
- ✅ **Chat routes** (`client.chat.*`)
- ✅ **Folder routes** (`client.folder.*`)
- ✅ **Invite routes** (`client.invite.*`)
- ✅ **Membership routes** (`client.membership.*`)
- ✅ **Notification routes** (`client.notification.*`)
- ✅ **Package routes** (`client.package.*`)
- ✅ **Project routes** (`client.project.*`)
- ✅ **Storage routes** (`client.storage.*`)
- ✅ **Subscription routes** (`client.subscription.*`)
- ✅ **Task routes** (`client.task.*`)
- ✅ **User routes** (`client.user.*`)
- ✅ **Version routes** (`client.version.*`)
- ✅ **Workspace routes** (`client.workspace.*`)

### Supported Data Types

| Type | Behavior | Example Input | Example Output |
|------|----------|---------------|----------------|
| **String** | URL encoded | `"John Doe"` | `"John%20Doe"` |
| **Number** | Converted to string | `25` | `"25"` |
| **Boolean** | Converted to string | `true` | `"true"` |
| **Array** | Comma-separated, encoded | `["a", "b", "c"]` | `"a%2Cb%2Cc"` |
| **Object** | Dot notation, encoded | `{x: 1}` | `"obj.x=1"` |
| **Date** | toString(), encoded | `new Date()` | `"Mon%20Jan%2001..."` |
| **null/undefined** | Filtered out | `null` | (not included) |

### Real-World Examples

#### Asset Search with Complex Parameters
```javascript
await client.project.getAssets('project123', 'creator', {
  mediaTypes: ['image', 'video'],           // → "image%2Cvideo"
  includeChats: true,                       // → "true"
  folderId: 'folder123',                    // → "folder123"
  sort: { name: 1, createdAt: -1 },        // → "sort[name]=1&sort[createdAt]=-1"
  search: 'test query'                      // → "test%20query"
});
```

#### Chat Parameters
```javascript
await client.chat.getMessages('chat123', {
  limit: 50,                                // → "50"
  sort: { createdAt: -1 },                 // → "sort[createdAt]=-1"
  replies: 10,                             // → "10"
  mentions: ['user1', 'user2']             // → "user1%2Cuser2"
});
```

#### Notification Queries
```javascript
await client.notification.getNotifications({
  channels: ['project:123', 'workspace:456'], // → "project%3A123%2Cworkspace%3A456"
  types: ['comment', 'mention'],              // → "comment%2Cmention"
  paginate: 'cursor',                         // → "cursor"
  limit: 20,                                  // → "20"
  createdAfter: Date.now() - 86400000        // → "1704067200000"
});
```

### Manual Usage

The URL parameter utility can also be used independently:

```javascript
import { parseUrlParams, paramsToUrlSearchParams } from 'nurama-sdk/utils/urlParams';

// Convert parameters to string record
const stringParams = parseUrlParams({
  tags: ['a', 'b', 'c'],
  filter: { status: 'active' }
});
// Result: { tags: 'a%2Cb%2Cc', filter: '%7B%22status%22%3A%22active%22%7D' }

// Create URLSearchParams object
const urlParams = paramsToUrlSearchParams({
  page: 1,
  limit: 10,
  active: true
});
console.log(urlParams.toString()); // "page=1&limit=10&active=true"
```

### Configuration Options

The utility supports configuration options (though the defaults work well for the Nurama API):

```javascript
import { parseUrlParams } from 'nurama-sdk/utils/urlParams';

const result = parseUrlParams(params, {
  arrayFormat: 'comma',      // 'comma' or 'brackets' (key[]=val1&key[]=val2)
  objectFormat: 'bracket',   // 'bracket', 'dot', or 'json' (JSON stringified)
  encode: true               // Whether to URL encode values (default: true)
});
```

### Technical Implementation

- **Minimal overhead**: Parameter processing only occurs when parameters are provided
- **Efficient encoding**: Uses native `encodeURIComponent()` 
- **Caching friendly**: Encoded parameters work properly with response caching
- **Proper encoding**: Manual query string building to avoid double-encoding issues
- **Comprehensive test coverage**: 36 total tests (26 unit + 10 integration)

### Migration Notes

The implementation provides backward compatibility with all existing route method signatures remaining unchanged. Only the URL encoding behavior has been updated to be more robust and consistent with `encode: true` by default.

## API Client Methods

This section lists the methods available under `client.<module>`. Full API documentation can be found in the Nurama backend repo or its Swagger/OpenAPI definition.

### Authentication (`client.auth`)

*   `async register(userData)`: Registers a new user (`firstName`, `lastName`, `email`, `password`).
*   `async login(credentials)`: Logs in a user (`login`, `password`). Handles MFA challenges.
*   `async logout(refreshToken?)`: Clears stored tokens and invalidates the refresh token.
*   `async refreshTokens(refreshToken?)`: Exchanges a refresh token for new access and refresh tokens.
*   `async forgotPassword(email)`: Sends a password reset email.
*   `async resetPassword({ token, newPassword })`: Resets the password using a token.
*   `async sendVerificationEmail()`: Sends an email verification link to the logged-in user.
*   `async verifyEmail(token)`: Verifies the user's email using a token.
*   `async enableMfa()`: Enables multi-factor authentication, returns setup details.
*   `async verifyMfa(mfaToken)`: Verifies an MFA token (during setup or login).
*   `async disableMfa(mfaToken)`: Disables MFA using a current MFA token.
*   `tokenValid()`: Checks if the current JWT token exists and is valid. Returns `true` if the token exists and is not expired, `false` otherwise.

### Cache Management (`client`)

*   `clearCache()`: Clears all cached responses.
*   `getCacheStats()`: Returns cache statistics including size and entry details for debugging.

### User (`client.user`)

*   `async getUserSelf()`: Retrieves the full profile of logged in user.
*   `async getUser(userId)`: Retrieves the public profile of a specific user.
*   `async updateSelf(updateData)`: Updates the profile of the currently logged-in user (`email`, `userName`, `password`, `firstName`, `middleName`, `lastName`, `company`, `displayName`).
*   `async deleteCurrentUser()`: Marks the logged-in user's account for deletion.
*   `async createAvatar(fileData)`: Creates a new avatar asset for the user, returns signed URL data.
*   `async updateAvatar(fileData)`: Updates the user's avatar asset, returns signed URL data.
*   `async updatePreferences(preferenceData)`: Updates user preferences (e.g., `hide` array).

### Workspace (`client.workspace`)

*   `async createWorkspace(data)`: Creates a new workspace (`name`, `description?`).
*   `async getWorkspace(workspaceId)`: Gets workspace details by ID.
*   `async listWorkspaces(sortParams?)`: Gets all workspaces for the current user, with optional sorting.
*   `async updateWorkspace(workspaceId, updateData)`: Updates workspace details (`name?`, `description?`, `updateSlug?`).
*   `async deleteWorkspace(workspaceId)`: Marks a workspace for deletion.
*   `async createLogo(workspaceId, fileData)`: Creates a logo asset, returns signed URL data.
*   `async updateLogo(workspaceId, fileData)`: Updates the logo asset, returns signed URL data.
*   `async createIcon(workspaceId, fileData)`: Creates an icon asset, returns signed URL data.
*   `async updateIcon(workspaceId, fileData)`: Updates the icon asset, returns signed URL data.
*   `async listProjects(workspaceId)`: Retrieves projects within a workspace.
*   `async updateSetting(workspaceId, settingName, value)`: Updates a specific boolean workspace setting.

### Project (`client.project`)

*   `async createProject(projectData)`: Creates a new project (`name`, `workspaceId`).
*   `async getProjects()`: Retrieves projects accessible by the user (no pagination).
*   `async getProject(projectId)`: Retrieves a specific project by ID.
*   `async updateProject(projectId, updateData)`: Updates project details (`name?`, `description?`, `updateSlug?`).
*   `async deleteProject(projectId)`: Marks a project for deletion.
*   `async createLogo(projectId, logoData)`: Creates a logo asset for the project, returns signed URL data.
*   `async updateLogo(projectId, logoData)`: Updates the project logo asset, returns signed URL data.
*   `async createAssets(projectId, fileUploadBody)`: Creates multiple assets from file data, returns signed URL data for each.
*   `async getAssets(projectId, visibility, params?)`: Gets assets for one visibility tier (`'creator'` or `'reviewer'`) with pagination, sorting and filtering.
*   `async getHomeFeed(projectId, visibility, params?)`: Gets the feed (assets with inline chat data) for one visibility tier.
*   `async getHomeFeed(projectId, visibility, params?)`: Gets feed based on visibility.
*   `async getFolders(projectId, visibility, params?)`: Gets folders for one visibility tier.
*   `async getFolders(projectId, visibility, params?)`: Gets folders based on visibility.
*   `async getProjectChat(projectId, visibility, params?)`: Gets the project chat for one visibility tier.
*   `async getProjectChat(projectId, visibility, params?)`: Gets chat based on visibility.
*   `async createSubmission(projectId, submissionData)`: Creates a new submission.
*   `async getSubmissions(projectId, params?)`: Gets submissions for the project.
*   `async getSubmission(projectId, submissionId)`: Gets a specific submission.
*   `async getSubmissionAssets(projectId, submissionId, params?)`: Gets assets within a submission.
*   `async publishAssets(projectId, assetData)`: Publishes a list of assets.
*   `async unpublishAssets(projectId, assetData)`: Unpublishes a list of assets.
*   `async createFolder(projectId, visibility, folderData)`: Creates a folder with file system integration (`name`, `basePath?`).
*   `async publishItems(projectId, publishData)`: Publishes items (assets/folders) with file system support (`resourceIds`, `basePath?`, `sendEmailNotification?`).
*   `async unpublishItems(projectId, unpublishData)`: Unpublishes items from file system (`resourceIds`).
*   `async getItemsAtPath(projectId, visibility, path, params?)`: Gets items at a specific file system path with advanced filtering and pagination.
*   `async moveItemsToPath(projectId, visibility, moveData)`: Moves items to a new file system path (`itemPaths`, `destinationPath`).
*   `async copyItemsToPath(projectId, visibility, copyData)`: Copies items to a new file system path (`itemPaths`, `destinationPath`).
*   `async deleteItemsAtPath(projectId, visibility, deleteData)`: Deletes items from file system path (`itemPaths`).

### Folder (`client.folder`)

*   `async getFolder(folderId)`: Retrieves folder details.
*   `async updateFolder(folderId, data)`: Updates the folder's name and/or color (`name?`, `color?`).
*   `async updateFolderIcon(folderId, data)`: Updates the folder's icon (`name`, `checksum`, `sizeInMB`).
*   `async deleteFolder(folderId)`: Deletes a folder.
*   `async getFoldersAssets(folderId, params?)`: Gets assets within a folder (pagination, sorting).
*   `async tagFolder(folderId, tagData)`: Tags a folder with a specific tag (`tagId`).
*   `async untagFolder(folderId, untagData)`: Removes a tag from a folder (`tagId`).
*   `async updateFolderName(folderId, data)`: **@deprecated** Use `updateFolder` instead. Updates the folder's name.

### Asset (`client.asset`)

*   `async getAsset(assetId)`: Retrieves asset details.
*   `async updateAsset(assetId, updateData)`: Updates asset details (`name?`, `meta?`, `tags?`, `folderId?`).
*   `async deleteAsset(assetId)`: Marks an asset for deletion.
*   `async getFile(assetId, fileId)`: Retrieves a specific file object within an asset.
*   `async getFilesByFunctionType(assetId, functionType)`: Gets files by function type (e.g., 'thumbnail').
*   `async completeUpload(uploadData)`: Completes a multipart upload initiated elsewhere.
*   `async multipartUpload(file, signedUrls, key, uploadId, options?)`: Handles multipart file upload using pre-signed URLs with optional progress persistence.
*   `async getAssetPage(assetId, params?)`: Gets the page number an asset appears on based on filter/sort.
*   `async repairAssets(assetIds)`: Initiates repair process for assets.
*   `async downloadAssets(assetIds)`: Initiates download process for assets.
*   `async tagAsset(assetId, tagData)`: Tags an asset with a specific tag (`tagId`).
*   `async untagAsset(assetId, untagData)`: Removes a tag from an asset (`tagId`).

**Upload Session Management Methods:**
*   `getUploadSessions(projectId)`: Get all active upload sessions for a project.
*   `getUploadSession(projectId, sessionId)`: Get a specific upload session.
*   `removeUploadSession(projectId, sessionId)`: Remove an upload session.
*   `cleanupUploadSessions(projectId, olderThanMs?)`: Clean up old upload sessions.
*   `onUploadSessionMessage(listenerId, callback)`: Register a cross-tab message listener.
*   `offUploadSessionMessage(listenerId)`: Unregister a cross-tab message listener.
*   `completeUploadSession(projectId, sessionId)`: Mark an upload session as completed.

### Chat (`client.chat`)

*   `async createTopicChat(data)`: Creates a chat linked to a topic (project or asset).
*   `async getChatByTopicId(topicId, params)`: Gets chat details by its topic ID.
*   `async createMemberChat(data)`: Creates a direct/group chat between members.
*   `async getUsersMemberChats(params?)`: Gets member chats the user is part of.
*   `async getMemberChat(chatId)`: Gets details of a specific member chat.
*   `async updateMemberChat(chatId, data)`: Updates a member chat (subject, color, etc.).
*   `async deleteMemberChat(chatId)`: Deletes a member chat.
*   `async getAddableMembers(chatId)`: Gets users that can be added to a member chat.
*   `async addMembers(chatId, data)`: Adds members (`memberIds`) to a chat.
*   `async removeMembers(chatId, data)`: Removes members (`memberIds`) from a chat.
*   `async getChat(chatId)`: Retrieves details for any chat type by ID.
*   `async updateChatSubject(chatId, data)`: Updates the subject of any chat type.
*   `async deleteChat(chatId)`: Deletes any chat type.
*   `async createMessage(chatId, data)`: Creates a new message in a chat.
*   `async createAssetChatAndMessage(assetId, visibility, data, params?)`: Creates a message in an asset's chat (potentially creating the chat).
*   `async getMessages(chatId, params?)`: Gets messages in a chat (pagination, sorting).
*   `async getMessage(messageId, params?)`: Gets a specific message by ID.
*   `async reviseMessage(messageId, data)`: Updates the content/mentions of a message.
*   `async deleteMessage(messageId)`: Deletes a message.
*   `async getMessagePage(messageId, params?)`: Gets the page number a message appears on.
*   `async getReplies(messageId, params?)`: Gets replies to a specific message.
*   `async addAttachments(messageId, attachments)`: Adds file attachments to a message.
*   `async removeAttachment(messageId, assetId)`: Removes an attachment from a message.
*   `async getMentions(params?)`: Gets messages where the current user is mentioned.
*   `async generateSummary(chatId, data)`: Generates an AI summary for a chat.
*   `async getSummaries(chatId, params?)`: Retrieves previously generated summaries for a chat.
*   `async createReaction(messageId, data)`: Creates or updates a reaction on a chat message (`emoji`).
*   `async removeReaction(messageId)`: Removes the authenticated user's reaction from a chat message.

### Membership (`client.membership`)

*   `async getMyMemberships()`: Retrieves the logged-in user's membership records.
*   `async getWorkspaceMemberships(workspaceId, params?)`: Gets memberships for a workspace.
*   `async getProjectMemberships(projectId, params?)`: Gets memberships for a project.
*   `async deleteMembership(membershipId)`: Deletes a specific membership record.
*   `async leaveResource(resourceId)`: Allows the user to leave a workspace or project.
*   `async addRole(data)`: Adds a role to a membership (`membershipId`, `role`).
*   `async removeRole(data)`: Removes a role from a membership (`membershipId`, `role`).
*   `async getProjectMentionableUsers(projectId, visibility)`: Gets users mentionable in a project.

### Invite (`client.invite`)

*   `async inviteUser(data)`: Invites a user (`inviteeEmail`) to a resource (`resourceType`, `resourceId`) with a specific `role`.
*   `async getInvites(params?)`: Retrieves invites involving the current user (as inviter or invitee).
*   `async getInviteById(inviteId)`: Gets details of a specific invite.
*   `async cancelInvite(inviteId)`: Cancels an active invite.
*   `async getInvitesForResource(resourceId, params?)`: Gets invites associated with a specific resource.
*   `async acceptInvite(inviteId)`: Accepts an invite.
*   `async resendInvite(inviteId)`: Resends an invite email.

### Notification (`client.notification`)

*   `async getNotifications(data)`: Retrieves notifications for channels (pagination, filtering).
*   `async getNewNotifications(data)`: Gets new notifications since last seen.
*   `async getNewNotificationCount(data)`: Gets the count of new notifications for channels.
*   `async getNewNotificationCountBulk(data)`: Gets counts for multiple channel queries.
*   `async getUsersLastNotificationsSeen(data)`: Retrieves the last seen timestamp for channels.
*   `async updateUsersLastSeen(data)`: Updates the last seen timestamp for channels.

### Subscription (`client.subscription`)

*   `async getWorkspaceSubscriptions(workspaceId, params?)`: Retrieves subscriptions for a workspace.
*   `async getMySubscriptions(params?)`: Retrieves subscriptions owned by the user.
*   `async getResourceLimits(resourceId)`: Gets storage/seat limits for a resource (workspace).
*   `async getSeatUsage(resourceId)`: Gets seat usage for a resource (workspace).
*   `async getStorageUsage(resourceId)`: Gets storage usage for a resource (workspace).

### Package (`client.package`)

*   `async getWorkspacePackages(workspaceId)`: Retrieves available subscription packages for a workspace.

### Task (`client.task`)

*   `async getMyTasks(params?)`: Retrieves tasks assigned to the user (pagination, sorting, filtering).
*   `async updateTaskStatus(taskId, data)`: Updates the status of a task.
*   `async acknowledgeTask(taskId)`: Toggles the acknowledgement status of a task.
*   `async getUnacknowledgedTaskCount(projectId)`: Gets the count of unacknowledged tasks in a project.

### Storage (`client.storage`)

*   `async getStorageChart(resourceType, resourceId, params?)`: Retrieves storage usage chart data.
*   `async getStorageRecord(resourceType, resourceId)`: Retrieves the latest storage record for a resource.

### Tag (`client.tag`)

*   `async createTag(data)`: Creates a new tag (`name`, `ownerResourceType`, `ownerResourceId`, `color`).
*   `async getTags(resourceType, resourceId, params?)`: Retrieves tags for a resource (pagination, sorting).
*   `async updateTag(tagId, updateData)`: Updates tag details (`name?`, `color?`).
*   `async deleteTag(tagId)`: Deletes a tag.

### Config (`client.config`)

*   `async getConfig()`: Get platform configuration data (limits, colors, etc.).

### Version (`client.version`)

*   `async getCommitHash()`: Retrieves the latest git commit hash of the deployed backend application.
*   `getVersion()`: Returns SDK version information including version number, build timestamp, build hash, and git commit. This is a synchronous method that returns the version info embedded during the build process.

### WebSocket (`client.socket`)

*   `connect(channel, options?)`: Connect to a WebSocket channel (e.g., `/user/123`, `/workspace/456`).
*   `disconnect(channel)`: Disconnect from a specific channel.
*   `disconnectAll()`: Disconnect from all connected channels.
*   `subscribe(channel, event, callback)`: Subscribe to an event (e.g., 'notification') on a channel.
*   `unsubscribe(channel, event, callback?)`: Unsubscribe from an event on a channel.
*   `isConnected(channel)`: Check if currently connected to a specific channel.

## SDK Version Tracking

Releases follow [semantic versioning](https://semver.org/) and are published
automatically: every production deploy that changes the SDK publishes the next
patch version. Building the SDK never changes `package.json`.

`getVersion()` reports what the running bundle was built from:

- **Published releases** report their version, e.g. `1.4.3`.
- **Any other build** reports `<base version>+<source hash>`, e.g.
  `1.4.0+60ddbec0`, so it is never mistaken for a release. The same source gives
  the same string on any machine.

Alongside the version it carries `buildTimestamp`, `buildHash` (MD5 of the SDK
source), `gitCommit`, and `dirty` (the build included uncommitted SDK source
changes).

**Generated files:** `src/version.ts` is written by
`scripts/generate-version-info.cjs` before each build (git-ignored).

**Watch mode:** `pnpm dev` rebuilds `dist/` on every source change and keeps the
dev version current. Inside the Nurama monorepo it starts automatically with the
web app's dev server.

### Usage in Frontend Code

```typescript
import nuramaClient from '@/lib/nuramaSdk';

// Get SDK version information
const versionInfo = nuramaClient.getVersion();

console.log('SDK Version:', versionInfo.version);
console.log('Built:', new Date(versionInfo.buildTimestamp).toLocaleString());
console.log('Build Hash:', versionInfo.buildHash);
console.log('Git Commit:', versionInfo.gitCommit);

// Example output:
// SDK Version: 1.4.0
// Built: 10/11/2025, 2:01:01 AM
// Build Hash: 7db059000a1af183dbfe27dd73017015
// Git Commit: d13a1e0
```

**TypeScript Type:**

```typescript
import { type SDKVersionInfo } from 'nurama-sdk';

interface SDKVersionInfo {
  version: string;           // Semantic version (e.g., "1.3.3")
  buildTimestamp: string;   // ISO timestamp of build
  buildHash: string;        // MD5 hash of source files
  gitCommit: string;        // Short git commit hash
}
```

### Build Examples

**First Build (or after code changes):**
```bash
$ npm run build

[Build Hash] Calculating source code hash...
[Build Hash] Current hash: 7db059000a1af183dbfe27dd73017015
[Build Hash] 🔄 Changes detected - version will be updated
[Version Gen] Incrementing version: 1.3.2 → 1.3.3
[Version Gen] ✅ Version info generated successfully
...
[Build Metadata] ✅ Build metadata saved successfully
[Build Metadata] Version: 1.3.3
```

**Rebuild Without Changes:**
```bash
$ npm run build

[Build Hash] Calculating source code hash...
[Build Hash] Current hash: 7db059000a1af183dbfe27dd73017015
[Build Hash] ✅ No changes detected - using existing version
[Build Hash] Version: 1.3.3
[Build Hash] Build time: 2025-10-11T09:01:01.521Z
[Version Gen] No code changes - reusing previous version info
...
```

### Benefits

1. **No Unnecessary Version Bumps**: Same code = same version
2. **Automatic Versioning**: Patch version auto-increments on code changes
3. **Build Traceability**: Hash + timestamp + git commit for debugging
4. **Frontend Visibility**: Easy version checking in production
5. **CI/CD Friendly**: Works in automated build pipelines

### Debugging

If you encounter issues:

1. **Check build metadata exists**:
   ```bash
   cat dist/.build-metadata.json
   ```

2. **Manually run scripts**:
   ```bash
   node scripts/check-build-hash.cjs
   node scripts/generate-version-info.cjs
   ```

3. **Force new version**: Delete metadata file
   ```bash
   rm dist/.build-metadata.json
   npm run build
   ```

4. **Check version.ts was generated**:
   ```bash
   cat src/version.ts
   ```

## File System

The file system is a separate collection of reference paths to assets and folders. It is designed this way so we can provide fast filterable/sortable virtual file systems across the platform that are organized and behave like a local file system. This allows us to replicate local file system functionality with complex file hierarchy.

### Key Features

- **Path-based organization**: Each file-system entry contains a reference to either an asset or folder as well as shared, indexed keys between assets and folders (keys that exist in both collections) like name, tags, etc.
- **Fast searching**: This allows us to rapidly search for folders or assets with the same tag or partial-name matches for both folders and assets without using a complex and slow aggregation query.
- **Multiple references**: Assets may have multiple file system entries. For example an asset may exist at `/project/:projectId/creator`, `/project/:projectId/reviewer` and `/submission/:submissionId` - each reference will point to the same asset.
- **Unique folders**: Folders may only have one reference. If you copy a folder to a new location you will create a new folder (duplicating the original) and new file-system path.

### Path Structure

The path in the File-System object represents the path to but not including the file system item (Asset or Folder). So the path to asset-1 may be `/project/:projectId/creator` NOT `/project/:projectId/creator/asset-1`.

### SDK Support

The SDK now provides comprehensive file system operations through the `client.project` namespace:

- **Navigation**: `getItemsAtPath()` for browsing file system paths
- **Organization**: `createFolder()`, `moveItemsToPath()`, `copyItemsToPath()`, `deleteItemsAtPath()`
- **Publishing**: `publishItems()`, `unpublishItems()` with file system integration
- **Search**: Advanced filtering by path, media type, tags, and name search