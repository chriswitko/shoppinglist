// karma.conf.js
module.exports = function(config) {
  config.set({
    basePath: '../..',
    frameworks: ['jasmine', 'mocha'],
    files: [
      // 'chriswitko/React/shoppinglist/src/*.js'
    ],
          preprocessors: {
                    'test/support/react.js': ['browserify'],
                    'test/documentation-spec.js': ['react-jsx'],
                    'test/jasmine-react-spec.js': ['react-jsx'],
                    'src/jasmine-react.js': ['browserify']
                },
    proxies: {
    // '/web': 'http://localhost:3333',
    // '/css/': 'http://localhost:3005/css/',
    // '/assets/': 'http://localhost:3005/assets/',
    // '/js/': 'http://localhost:3005/js/',
    // '/img/': 'http://localhost:3005/img/',
    // '/fonts/': 'http://localhost:3005/fonts/',
    // '/api/': 'http://localhost:3005/api/'
    },
  });
};