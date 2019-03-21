import getPropEmitName from './get-prop-emit-name';

/**
 * Wrap props with a computed proxy to make it easier to update or use in
 * v-models
 *
 * @param {Array<String>|String} props - Props to proxy
 *
 * @returns {Object} mixin
 */
export default (
    props,
    {
        suffix = 'Proxy',
    } = {},
) => {
    const computed = {};

    if (!suffix || !suffix.length) {
        throw new Error('You must have a suffix for your proxies props');
    }

    (Array.isArray(props) ? props : [props]).forEach(prop => {
        computed[`${ prop }${ suffix }`] = {
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
        };
    });

    return { computed };
};
