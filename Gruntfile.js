module.exports = function(grunt) {

    grunt.initConfig({
        // pkg: grunt.file.readJSON('package.json'),

        karma: {
            options: {
                basePath: '',

                frameworks: ['jasmine', 'browserify'],

                preprocessors: {
                    'src/jasmine-react.js': ['browserify'],
                    'test/support/react.js': ['browserify'],
                    'test/documentation-spec.js': ['react-jsx'],
                    'test/jasmine-react-spec.js': ['react-jsx']
                },

                files: [
                    'test/**/*.js',
                    'src/index.html',
                    'src/js/**/**',
                ],

            },

            dev: {
                browsers: ['Chrome'],
                autoWatch: true
            },
        }
    });

    grunt.loadNpmTasks('grunt-karma');

};