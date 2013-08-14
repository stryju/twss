/*global
  module: false,
  require: false
*/
module.exports = function ( grunt ) {
  'use strict';

  require( 'matchdep' )
    .filterDev( 'grunt-contrib*' )
      .forEach( grunt.loadNpmTasks );

  grunt.initConfig({
    pkg : grunt.file.readJSON( 'package.json' ),

    compass : {
      options : {
        sassDir   : 'assets/styles',
        fontsDir  : 'assets/fonts',
        cssDir    : 'public/styles',

        imagesDir          : 'assets/images',
        generatedImagesDir : 'assets/images/sprites',

        httpStylesheetsPath     : '/styles',
        httpImagesPath          : '/images',
        httpGeneratedImagesPath : '/images/sprites',
        httpFontsPath           : '/fonts'
      },

      clean : {
        options : {
          clean : true
        }
      },
      dev : {
        options : {
          outputStyle : 'expanded',
          raw         : 'sass_options = { :debug_info => true }\n'
        }
      },
      dist : {
        options : {
          force       : true,
          outputStyle : 'compressed',
          // assetCacheBuster : false
          raw         : 'asset_cache_buster :none\n'
        }
      }
    },

    jshint : {
      dev : {
        options : {
          jshintrc : 'assets/.jshintrc-dev'
        },
        files : {
          src : [
            'assets/scripts/**/*.js',
            '!assets/scripts/**/vendor/*.js'
          ]
        }
      },

      dist : {
        options : {
          jshintrc : 'assets/.jshintrc'
        },
        files : {
          src : [
            'Gruntfile.js',
            'assets/scripts/**/*.js',
            '!assets/scripts/**/vendor/*.js'
          ]
        }
      }
    },

    watch : {
      options: {
        interrupt : true
      },

      styles : {
        files   : 'assets/styles/**/*.scss',
        tasks   : 'compass:dev',
        options : {
          interrupt : false
        }
      },

      scripts : {
        files : [
          'assets/scripts/**/*.js'
        ],
        tasks : [
          'jshint:dev'
        ]
      }
    }
  });

  grunt.registerTask( 'dev', [
    'compass:clean',
    'compass:dev',
    'jshint:dev'
  ]);

  grunt.registerTask( 'dist', [
    'compass:clean',
    'compass:dist',
    'jshint:dist'
  ]);

  // grunt [default]
  grunt.registerTask( 'default', [
    'dev',
    'watch'
  ]);
};
