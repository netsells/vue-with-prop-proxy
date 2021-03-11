import { getMixinForProxy } from './ProxyBuilder';

/**
 * Get parsed proxy config.
 *
 * @private
 *
 * @param {PropProxyDefinitions} proxyOrProxies
 * @param {PropProxyOptions} options
 *
 * @returns {ParsedPropProxyDefinition[]}
 */
function getParsedProxies(proxyOrProxies, {
    suffix = 'Proxy',
} = {}) {
    const proxies = Array.isArray(proxyOrProxies) ? proxyOrProxies : [proxyOrProxies];

    return proxies.map(proxy => {
        if (typeof proxy === 'string') {
            if (!suffix || !suffix.length) {
                throw new Error('You must have a suffix for your proxies props');
            }

            return {
                prop: proxy,
                via: `${ proxy }${ suffix }`,
            };
        }

        return proxy;
    });
}

/**
 * Wrap props with a computed proxy to make it easier to update or use in
 * v-models
 *
 * @param {PropProxyDefinitions} proxies - Props to proxy
 * @param {PropProxyOptions} options
 *
 * @returns {ProxyMixin[]}
 */
function withPropProxy(proxies, options) {
    return {
        mixins: getParsedProxies(proxies, options).map(getMixinForProxy),
    };
}

export default withPropProxy;
