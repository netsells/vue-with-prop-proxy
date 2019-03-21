/**
 * Get a props update emitter name
 *
 * @param {String} prop
 *
 * @returns {String}
 */
const getPropEmitName = prop => prop === 'value'
    ? 'input'
    : `update:${ prop }`;

export default getPropEmitName;
