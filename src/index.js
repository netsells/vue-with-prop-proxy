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
 * Get a computed proxy based on the prop
 *
 * @param {String} prop
 *
 * @returns {Object}
 */
export const generateComputedProxy = (prop) => ({
    /**
     * Get the existing prop
     *
     * @returns {any}
     */
    get() {
        return this[prop];
    },

    /**
     * Update the prop to the new value
     *
     * @param {any} value
     */
    set(value) {
        this.$emit(getPropEmitName(prop), value);
    },
});


/**
 * Wrap props with a computed proxy to make it easier to update or use in
 * v-models
 *
 * @param {Array<String|Object>|String|Object} proxies - Props to proxy
 *
 * @returns {Object} mixin
 */
export default (
    proxies,
    {
        suffix = 'Proxy',
    } = {},
) => {
    const computed = {};

    (Array.isArray(proxies) ? proxies : [proxies]).forEach(proxy => {
        if (typeof proxy === 'string') {
            if (!suffix || !suffix.length) {
                throw new Error('You must have a suffix for your proxies props');
            }

            computed[`${ proxy }${ suffix }`] = generateComputedProxy(proxy);
        } else {
            computed[proxy.via] = generateComputedProxy(proxy.prop)
        }
    });

    return { computed };
};
