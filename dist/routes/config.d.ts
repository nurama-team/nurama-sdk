import type NuramaClient from '../NuramaClient';
export interface ConfigMethods {
    getConfig: () => Promise<any>;
}
/**
 * Creates methods related to configuration endpoints.
 * @param client - The NuramaClient instance.
 * @returns An object with configuration-related methods.
 */
export default function createConfigMethods(client: NuramaClient): ConfigMethods;
//# sourceMappingURL=config.d.ts.map