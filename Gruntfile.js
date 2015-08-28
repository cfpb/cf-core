module.exports = function(grunt) {

  'use strict';

  require('time-grunt')(grunt);

  var path = require('path');
  var extend = require('node.extend');


  /**
   * Load the tasks we want to use, which are specified as dependencies in
   * the package.json file of cf-grunt-config.
   */

  // Loads all Grunt tasks in the node_modules directory within the new CWD.
  require('jit-grunt')(grunt, {
    // Below line needed because task name does not match package name
    bower: 'grunt-bower-task'
  })({
    // Options
    pluginsRoot: 'node_modules/cf-grunt-config/node_modules'
  });


  /**
   * Initialize a variable to represent the Grunt task configuration.
   */
  var config = {

    // Define a couple of utility variables that may be used in task options.
    pkg: grunt.file.readJSON('bower.json'),
    env: process.env,
    opt: {
      // Include path to compiled extra CSS for IE7 and below.
      // Definitely needed if this component depends on an icon font.
      // ltIE8Source: 'static/css/main.lt-ie8.min.css',

      // Include path to compiled alternate CSS for IE8 and below.
      // Definitely needed if this component depends on media queries.
      // ltIE9AltSource: 'static/css/main.lt-ie9.min.css',

      // Set whether you'd like to use a JS hack to force a redraw in the browser
      // to avoid an IE8 bug where fonts do not appear or appear as boxes on load.
      // ie8FontFaceHack: true,

      // Set whether or not to include Modernizr for demoing a component.
      // Run the grunt-modernizr task to generate the custom modernizr build.
      // html5shiv is included with modernizr.
      modernizr: true,

      // Set a path to a concatenated JS file that you'd like to add before the
      // closing body tag.
      // jsBody: 'static/js/component.min.js',

      // Here's a banner with some template variables.
      // We'll be inserting it at the top of minified assets.
      banner: grunt.file.read('./node_modules/cf-grunt-config/cfpb-banner.txt'),
    },

    // Define tasks specific to this project here
    less: {
      core: {
        options: {
          paths: grunt.file.expand('src/**'),
          sourceMap: true
        },
        files: {
          'demo/static/css/main.css': [
            'src/cf-core.less'
          ]
        }
      }
    },

    modernizr: {

      dist: {
        // [REQUIRED] Path to the build you're using for development.
        "devFile" : "src/vendor/modernizr-dev/index.js",

        // Path to save out the built file.
        "outputFile" : "demo/static/js/modernizr-custom.js",

        // Based on default settings on http://modernizr.com/download/
        "extra" : {
          "shiv" : true,
          "printshiv" : true,
          "load" : false,
          "mq" : false,
          "cssclasses" : true
        },

        // Based on default settings on http://modernizr.com/download/
        "extensibility" : {
          "addtest" : false,
          "prefixed" : false,
          "teststyles" : false,
          "testprops" : false,
          "testallprops" : false,
          "hasevents" : false,
          "prefixes" : false,
          "domprefixes" : false,
          "cssclassprefix": ""
        },

        // By default, source is uglified before saving
        "uglify" : true,

        // Define any tests you want to implicitly include.
        "tests" : [],

        // By default, this task will crawl your project for references to Modernizr tests.
        // Set to false to disable.
        "parseFiles" : true,

        // When parseFiles = true, this task will crawl all *.js, *.css, *.scss and *.sass files,
        // except files that are in node_modules/.
        // You can override this by defining a "files" array below.
        "files" : {
          "src": ['src/*.less']
        },

        // This handler will be passed an array of all the test names passed to the Modernizr API, and will run after the API call has returned
        // "handler": function (tests) {},

        // When parseFiles = true, matchCommunityTests = true will attempt to
        // match user-contributed tests.
        "matchCommunityTests" : false,

        // Have custom Modernizr tests? Add paths to their location here.
        "customTests" : []
      }

    }

  };


  /**
   * Define a function that, given the path argument, returns an object
   * containing all JS files in that directory.
   */
  function loadConfig(path) {
    var glob = require('glob');
    var object = {};
    var key;

    glob.sync('*', {cwd: path}).forEach(function(option) {
      key = option.replace(/\.js$/,'');
      object[key] = require(path + option);
      grunt.verbose.writeln("External config item - " + key);
    });

    return object;
  }


  /**
   * Combine the config variable defined above with the results of calling the
   * loadConfig function with the given path, which is where our external
   * task options get installed by npm.
   */
  config = extend(true, loadConfig('./node_modules/cf-grunt-config/tasks/options/'), config);

  grunt.initConfig(config);


  /**
   * Load any project-specific tasks installed in the customary location.
   */
  require('load-grunt-tasks')(grunt);


  /**
   * Create custom task aliases for our component build workflow.
   */
  grunt.registerTask('vendor', ['copy:component_assets', 'copy:docs_assets']);
  grunt.registerTask('default', ['less:core', 'autoprefixer', 'modernizr', 'copy:docs', 'topdoc']);

};
