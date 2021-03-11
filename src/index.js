/**
 * Define a raw prop proxy.
 *
 * @typedef {object} ParsedPropProxyDefinition
 * @property {string} prop - The prop to proxy.
 * @property {string} via - The name to proxy it by.
 * @property {boolean} [optional=false] - Whether to add an optional data element.
 */

/**
 * Define a prop proxy.
 *
 * @typedef {ParsedPropProxyDefinition|string} PropProxyDefinition
 */

/**
 * Define many prop proxies.
 *
 * @typedef {PropProxyDefinition|PropProxyDefinition[]} PropProxyDefinitions
 */

/**
 * Prop proxy options.
 *
 * @typedef {object} PropProxyOptions
 * @property {string} [suffix='Proxy'] - Suffix for basic proxies.
 */

/**
 * Proxy mixin.
 *
 * @typedef {object} ProxyMixin
 * @property {function} data
 * @property {object} computed
 * @property {object} watch
 */

/**
 * Get a props update emitter name
 *
 * @param {String} prop
 *
 * @returns {String}
 */
export function getPropEmitName(prop) {
    return prop === 'value'
        ? 'input'
        : `update:${ prop }`;
}

/**
 * Get a props optional data name
 *
 * @param {String} prop
 *
 * @returns {String}
 */
export function getPropOptionalName(prop) {
    return `${ prop }Optional`;
}

/**
 * Get parsed proxy config.
 *
 * @param {PropProxyDefinitions} proxies
 * @param {PropProxyOptions} options
 *
 * @returns {ParsedPropProxyDefinition[]}
 */
export function getParsedProxies(proxyOrProxies, {
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
 * Get the mixin for a proxy definition
 *
 * @param {ParsedPropProxyDefinition} proxy
 *
 * @returns {ProxyMixin}
 */
export function getMixinForProxy({ prop, via, optional }) {
    const mixin = {
        computed: {
            [via]: {
                /**
                 * Get the existing prop
                 *
                 * @returns {any}
                 * @private
                 */
                get() {
                    if (optional) {
                        return this[getPropOptionalName(prop)];
                    }

                    return this[prop];
                },

                /**
                 * Update the prop to the new value
                 *
                 * @param {any} value
                 * @private
                 */
                set(value) {
                    if (optional) {
                        this[getPropOptionalName(prop)] = value;
                    }

                    this.$emit(getPropEmitName(prop), value);
                },
            },
        },
    };

    if (optional) {
        mixin.data = function() {
            return {
                [getPropOptionalName(prop)]: this[prop],
            }
        }

        mixin.watch = {
            [prop]: {
                /**
                 * Update the optional data prop when the main prop changes
                 *
                 * @param {any} value
                 */
                handler(value) {
                    this[getPropOptionalName(prop)] = value;
                },
            },
        };
    }

    return mixin;
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
