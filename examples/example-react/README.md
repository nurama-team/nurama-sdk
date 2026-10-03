# Nurama SDK React Example

This example demonstrates how to use the Nurama SDK in a React application, showcasing authentication, data fetching, WebSocket connections, and file uploads.

## Features

- **Authentication**: Login with your Nurama credentials
- **User Data**: Fetch and display user information
- **WebSocket Connections**: Connect to project channels and receive real-time notifications
- **File Upload**: Upload files to projects with progress tracking
- **File Download**: Download previously uploaded files

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your configuration:
   ```
   REACT_APP_API_URL=https://orama-staging-api.23rdc.com
   REACT_APP_FILE_BASEPATH=https://orama-files-staging.23rdc.com
   REACT_APP_WEBSOCKET_URL=https://orama-socket-staging.23rdc.com
   # Optional: Add your test credentials for easier development
   # REACT_APP_TEST_EMAIL=your-email@example.com
   # REACT_APP_TEST_PASSWORD=your-password
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## WebSocket Functionality

The example includes real-time WebSocket connections using Socket.IO:

1. **Connect to Project Channels**: Connect to specific project channels with creator or reviewer visibility.
2. **Real-time Notifications**: Receive and display notifications in real-time.
3. **Event Visualization**: See events in a formatted, timestamped display.

When you're connected to a project channel and perform actions (like uploading a file), you'll see the related events appear in real-time in the WebSocket Events section.

## Using the Example

1. **Login**: Enter your credentials and click Login
2. **View User Data**: Click "Get User Data" to fetch and display your user information
3. **Connect to WebSocket**: Enter a project ID, select visibility and connect to receive real-time events
4. **Upload Files**: Select a project, choose a file, and upload it
5. **Download Files**: Download your uploaded files

## Notes

- This example uses the Nurama SDK from npm. Make sure you have the latest version.
- You need valid Nurama credentials to use this example.
- WebSocket connections are automatically disconnected when you navigate away or close the page.

## Troubleshooting

- If you encounter connection issues, check your API URL and credentials.
- For WebSocket connection problems, verify your WebSocket URL and check console for detailed error messages.
- File upload errors often relate to project permissions - ensure you have proper access to the project.

## Key Files

- `src/App.js`: Main application component that manages state and SDK interaction
- `src/components/LoginForm.js`: Form component for authentication
- `src/components/UserData.js`: Component for displaying user information
- `public/index.html`: HTML template with SDK script import 