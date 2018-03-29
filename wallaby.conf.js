
module.exports = function (wallaby) {

  return {
    files: [
      {pattern: 'src/**/*.js*', load: true},
      { pattern: 'src/**/*Spec.js*', ignore: true }
    ],

    tests: [
      {pattern: 'src/**/*Spec.js*', load: true},
    ],

    compilers: {
      '**/*.js*': wallaby.compilers.babel( )
    },

    env: {
      type: "node",
      runner: "node"
  },
    //debug:true,

    testFramework: 'jest',
    setup: function (wallaby) {
      var jestConfig = require('./package.json').jest;
      // for example:
      // jestConfig.globals = { "__DEV__": true };
      wallaby.testFramework.configure(jestConfig);
    }
  };
};