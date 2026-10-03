import NuramaClient from './NuramaClient.js';
const DEFAULT_BOT_BASE_URL = 'https://bot.nurama.com';
const DEFAULT_BOT_WS_URL = 'https://bot-ws.nurama.com';
const KEY_PREFIX = 'nrm_bot_';
/**
 * Client for interacting with the Nurama API as a bot user.
 *
 * Authenticates with a long-lived API key (`nrm_bot_...`) instead of a JWT.
 * Requests must arrive at the bot subdomain (`bot.nurama.com` by default) so
 * the server can apply bot-specific firewall and rate-limit rules.
 *
 * Exposes only the namespaces a bot is permitted to use — auth, user profile,
 * payment, subscription, device, and bot-administration namespaces are omitted.
 *
 * @example
 * ```ts
 * import BotClient from '@nurama/sdk/bot';
 *
 * const bot = new BotClient(process.env.NURAMA_BOT_API_KEY!);
 * const workspaces = await bot.workspace.listWorkspaces();
 * ```
 */
class BotClient {
    /**
     * @param apiKey - Bot API key in the format `nrm_bot_{prefix}_{secret}`.
     * @param options - Configuration overrides.
     */
    constructor(apiKey, options = {}) {
        if (!apiKey) {
            throw new Error('apiKey is required.');
        }
        if (!apiKey.startsWith(KEY_PREFIX)) {
            throw new Error(`Invalid bot API key. Expected format: ${KEY_PREFIX}{prefix}_{secret}.`);
        }
        this._client = new NuramaClient(options.baseURL || DEFAULT_BOT_BASE_URL, {
            apiKey,
            fetch: options.fetch,
            debug: options.debug,
            enableCache: options.enableCache,
            cacheDurationSeconds: options.cacheDurationSeconds,
            websocketURL: options.websocketURL || DEFAULT_BOT_WS_URL,
        });
        this.workspace = this._client.workspace;
        this.project = this._client.project;
        this.asset = this._client.asset;
        this.chat = this._client.chat;
        this.aiChat = this._client.aiChat;
        this.folder = this._client.folder;
        this.invite = this._client.invite;
        this.membership = this._client.membership;
        this.notification = this._client.notification;
        this.storage = this._client.storage;
        this.task = this._client.task;
        this.taskRelation = this._client.taskRelation;
        this.tag = this._client.tag;
        this.settings = this._client.settings;
        this.shortlink = this._client.shortlink;
        this.convo = this._client.convo;
        this.board = this._client.board;
        this.version = this._client.version;
        this.config = this._client.config;
        this.product = this._client.product;
        this.public = this._client.public;
        this.socket = this._client.socket;
    }
}
export default BotClient;
//# sourceMappingURL=BotClient.js.map