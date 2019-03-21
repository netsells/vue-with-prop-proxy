module.exports = function(config) {
  config.set({
    mutator: 'javascript',
    packageManager: 'yarn',
    reporters: ['html', 'progress', 'dashboard'],
    testRunner: 'jest',
    transpilers: ['babel'],
    coverageAnalysis: 'off',
    mutate: ['src/**/*.js'],
    babelrcFile: '.babelrc',
    thresholds: {
        break: 100,
        high: 100,
        low: 99,
    },
  });
};
