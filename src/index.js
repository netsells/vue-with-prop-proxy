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
    const watch = {};
    const dataProps = [];

    (Array.isArray(proxies) ? proxies : [proxies]).forEach(proxy => {
        if (typeof proxy === 'string') {
            if (!suffix || !suffix.length) {
                throw new Error('You must have a suffix for your proxies props');
            }

            computed[`${ proxy }${ suffix }`] = generateComputedProxy(proxy);
        } else {
            computed[proxy.via] = generateComputedProxy(proxy.prop, proxy.optional);

            if (proxy.optional) {
                dataProps.push(proxy.prop);

                watch[proxy.prop] = {
                    handler(value) {
                        this[getPropOptionalName(proxy.prop)] = value;
                    },
                };
            }
        }
    });

    return {
        data() {
            const optionalData = {};

            dataProps.forEach(prop => {
                optionalData[getPropOptionalName(prop)] = this[prop];
            });

            return optionalData;
        },

        computed,

        watch,
    };
};
