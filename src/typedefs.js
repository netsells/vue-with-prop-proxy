/** @module TypeDefinitions */

/**
 * Define a raw prop proxy.
 *
 * @memberof module:TypeDefinitions
 * @typedef {object} ParsedPropProxyDefinition
 * @property {string} prop - The prop to proxy.
 * @property {string} via - The name to proxy it by.
 * @property {boolean} [optional=false] - Whether to add an optional data element.
 */

/**
 * Define a prop proxy.
 *
 * @memberof module:TypeDefinitions
 * @typedef {ParsedPropProxyDefinition|string} PropProxyDefinition
 */

/**
 * Define many prop proxies.
 *
 * @memberof module:TypeDefinitions
 * @typedef {PropProxyDefinition|PropProxyDefinition[]} PropProxyDefinitions
 */

/**
 * Prop proxy options.
 *
 * @memberof module:TypeDefinitions
 * @typedef {object} PropProxyOptions
 * @property {string} [suffix='Proxy'] - Suffix for basic proxies.
 */

/**
 * Proxy mixin.
 *
 * @memberof module:TypeDefinitions
 * @typedef {object} ProxyMixin
 * @property {function} data
 * @property {object} computed
 * @property {object} watch
 */
