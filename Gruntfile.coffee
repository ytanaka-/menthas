'use strict'

module.exports = (grunt) ->

  grunt.loadNpmTasks 'grunt-browserify'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'default', [ 'browserify:build', 'watch' ]

  grunt.initConfig
    browserify:
      build:
        options:
          browserifyOptions:
            extensions: ['.coffee', '.cjsx']
            transform: 'coffee-reactify'
        files:
          'public/js/bundle.js': [ 'assets/**.{js,jsx,cjsx,coffee}' ]

    watch:
      files: ['assets/**']
      tasks: 'browserify'