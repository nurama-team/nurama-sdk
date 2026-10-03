import BotClient from './BotClient.js';

const OriginalBotClient = BotClient;
class BrowserBotClient extends OriginalBotClient {
  constructor(apiKey, options = {}) {
    super(apiKey, {
      ...options,
      fetch: options.fetch || ((url, init) => window.fetch(url, init)),
    });
  }
}

window.NuramaBotClient = BrowserBotClient;

export default BrowserBotClient;
