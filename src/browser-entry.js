import NuramaClient from './NuramaClient.js';


const OriginalNuramaClient = NuramaClient;
class BrowserNuramaClient extends OriginalNuramaClient {
  constructor(baseURL, options = {}) {
    // Ensure fetch is properly bound to window
    const browserOptions = {
      ...options,
      // Wrap fetch in a function that explicitly binds to window
      fetch: (url, init) => window.fetch(url, init)
    };
    super(baseURL, browserOptions);
  }
}

// Explicitly assign the constructor to the global window object
window.NuramaClient = BrowserNuramaClient;

export default BrowserNuramaClient; 