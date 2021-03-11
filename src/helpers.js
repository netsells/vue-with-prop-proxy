/** @module Helpers */

/**
 * Get a props update emitter name
 *
 * @memberof module:Helpers
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
 * @memberof module:Helpers
 *
 * @param {String} prop
 *
 * @returns {String}
 */
export function getPropOptionalName(prop) {
    return `${ prop }Optional`;
}
