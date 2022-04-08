const withTM = require('next-transpile-modules')([
  '@pob-monorepo/protocol',
  '@pob-monorepo/types',
]);

module.exports = withTM({
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
});
