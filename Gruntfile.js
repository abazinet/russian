"use strict";

module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      options: {
        browserifyOptions: {
          debug: true,
          insertGlobals: true
        }
      },

      main: {
        options: {
          preBundleCB: function (b) {
            b.require('./src/app.js', {expose: 'app'});
          }
        },
        src: './src/app.js',
        dest: './app-bundle.js'
      },

      spec: {
        src: './test/*.js',
        dest: './spec-bundle.js'
      }
    },

    jasmine: {
      spec: {
        options: {
          vendor: ['./lib/sinon/sinon.js'],
          specs: './spec-bundle.js',
          outfile: './SpecRunner.html'
        }
      }
    },

    open: {
      dev: {
        file: './SpecRunner.html'
      }
    },

    watch: {
      scripts: {
        files: ['./src/**/*.js', './test/**/*.js'],
        tasks: ['browserify', 'jasmine:spec:build'],
        options: {
          spawn: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['browserify', 'jasmine:spec:build', 'open:dev', 'watch:scripts']);
  grunt.registerTask('build', ['browserify', 'jasmine:spec']);
};