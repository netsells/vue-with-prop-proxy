import {
    getPropOptionalName,
    getPropEmitName,
} from './helpers';

/**
 * Build a proxy mixin.
 *
 * @private
 */
class ProxyBuilder {
    /**
     * Constructor.
     *
     * @param {ParsedPropProxyDefinition} proxy
     */
    constructor({ prop, via, optional }) {
        this.prop = prop;
        this.via = via;
        this.optional = optional;
    }

    /**
     * Return the mixin.
     *
     * @returns {ProxyMixin}
     */
    build() {
        return {
            computed: this.computed,
            data: this.data,
            watch: this.watch,
        };
    }

    /**
     * Get the computed property for the mixin.
     *
     * @returns {object}
     */
    get computed() {
        const { optional, prop } = this;

        return {
            [this.via]: {
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
        };
    }

    /**
     * Get the data property for the mixin.
     *
     * @returns {function?}
     */
    get data() {
        if (!this.optional) {
            return null;
        }

        const { prop } = this;

        return function() {
            return {
                [getPropOptionalName(prop)]: this[prop],
            };
        };
    }

    /**
     * Get the watch property for the mixin.
     *
     * @returns {object}
     */
    get watch() {
        if (!this.optional) {
            return {};
        }

        const { prop } = this;

        return {
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
}

/**
 * Get the mixin for a proxy definition
 *
 * @private
 *
 * @param {ParsedPropProxyDefinition} proxy
 *
 * @returns {ProxyMixin}
 */
export function getMixinForProxy(proxy) {
    return new ProxyBuilder(proxy).build();
}

export default ProxyBuilder;
