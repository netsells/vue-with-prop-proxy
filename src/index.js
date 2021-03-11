/**
 * Get a props update emitter name
 *
 * @param {String} prop
 *
 * @returns {String}
 */
export const getPropEmitName = prop => prop === 'value'
    ? 'input'
    : `update:${ prop }`;

/**
 * Get a props optional data name
 *
 * @param {String} prop
 *
 * @returns {String}
 */
export const getPropOptionalName = prop => `${ prop }Optional`;

/**
 * Get a computed proxy based on the prop
 *
 * @param {String} prop
 * @param {Boolean} optional
 *
 * @returns {Object}
 */
export const generateComputedProxy = (prop, optional = false) => ({
    /**
     * Get the existing prop
     *
     * @returns {any}
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
     */
    set(value) {
        if (optional) {
            this[getPropOptionalName(prop)] = value;
        }

        this.$emit(getPropEmitName(prop), value);
    },
});

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
 * Wrap props with a computed proxy to make it easier to update or use in
 * v-models
 *
 * @param {Array<String|Object>|String|Object} proxies - Props to proxy
 *
 * @returns {Object} mixin
 */
export default (proxies, options) => {
    const computed = {};
    const watch = {};
    const dataProps = [];

    getParsedProxies(proxies, options)
        .forEach(proxy => {
            computed[proxy.via] = generateComputedProxy(proxy.prop, proxy.optional);

            if (proxy.optional) {
                dataProps.push({
                    prop: proxy.prop,
                    name: getPropOptionalName(proxy.prop),
                });

                watch[proxy.prop] = {
                    /**
                     * Update the optional data prop when the main prop changes
                     *
                     * @param {any} value
                     */
                    handler(value) {
                        this[getPropOptionalName(proxy.prop)] = value;
                    },
                };
            }
        });

    return {
        data() {
            const data = {};

            dataProps.forEach(({ prop, name }) => {
                data[name] = this[prop];
            });

            return data;
        },

        computed,

        watch,
    };
};
