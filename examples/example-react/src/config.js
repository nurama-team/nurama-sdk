// API Configuration

// Use environment variables with fallbacks
const API_URL = process.env.REACT_APP_API_URL || 'https://orama-staging-api.23rdc.com';
const FILE_BASEPATH = process.env.REACT_APP_FILE_BASEPATH || 'https://orama-files-staging.23rdc.com';
const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL || 'https://orama-socket-staging.23rdc.com';

// Export as a configuration object
const config = {
  apiUrl: API_URL,
  fileBasepath: FILE_BASEPATH,
  websocketUrl: WEBSOCKET_URL
};

export default config; 