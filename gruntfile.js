module.exports = function(grunt) {

  	var DEBUG = !!grunt.option("debug");

  	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
	    concat: {
		    noinfopath: {
		        src: [
		        	'src/globals.js',
		        	'src/progressbar.js',
		        	'src/autocomplete.js',
		        	'src/breadcrumb.js',
		        	'src/editable-grid.js',
		        	'src/grid.js',
		        	'src/resize.js',
		        	'src/menu.js',
		        	'src/shared-datasource.js'

		        ],
		        dest: 'dist/noinfopath-ui.js'
		    }
	 	},
        karma: {
          unit: {
            configFile: "karma.conf.js"
          },
          continuous: {
            configFile: 'karma.conf.js',
            singleRun: true,
            browsers: ['PhantomJS']
          }
        }		
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-karma');
 
	//Default task(s).
	grunt.registerTask('build', ['karma:continuous', 'concat:noinfopath']);

};