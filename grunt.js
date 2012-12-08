"use strict";
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    files: [
      'backbrace.js'
    ],
    meta: {
      version: '0.3.0',
      banner: '// Backbrace.js <%= meta.version %>\n\n' +
              '// (c) 2012 Patrick Williams, BitTorrent Inc.\n' +
              '// Backbrace may be freely distributed under the MIT license.\n'
    },
    lint: {
      files: ['<config:files>','spec/**/*.js']
    },
    watch: {
      files: ['<config:jasmine.specs>','*.js'],
      tasks: 'jasmine'
    },
    jasmine : {
      src : [
        'components/underscore/underscore.js', 
        'components/backbone/backbone.js', 
        'backbrace.min.js'
      ],
      specs : ['spec/**/*.js']
    },
    concat: {
      dist: {
        src: ['<config:files>'],
        dest: 'backbrace.concat.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'backbrace.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true,
        validthis:true
      },
      globals: {
        jasmine : false,
        describe : false,
        beforeEach : false,
        afterEach: false,
        waitsFor: false,
        runs: false,
        expect : false,
        it : false,
        spyOn : false,
        _: true,
        Backbone: false,
        Backbrace: false
      }
    }
  });

  grunt.loadNpmTasks('grunt-jasmine-runner');
  grunt.registerTask('default', 'lint concat min jasmine');

};