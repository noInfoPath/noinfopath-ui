module.exports = function(grunt) {

  	var DEBUG = !!grunt.option("debug");

  	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
        copy: {
			test: {
				files: [
					//{expand:true, flatten:false, src: [ 'lib/js/noinfopath/*.*'], dest: 'build/'},
					{
						expand: true,
						flatten: true,
						src: ['dist/*.js'],
						dest: '/Users/gochinj/ws/fcfn/fcfn-wip-0.7/fcfn-varietydev-forms/lib/js/noinfopath'
					},
				]
			}
		},
	    concat: {
		    noinfopath: {
		        src: [
		        	'src/globals.js',
		        	'src/progressbar.js',
		        	//'src/autocomplete.js',
		        	'src/breadcrumb.js',
		        	//'src/editable-grid.js',
		        	//'src/grid.js',
		        	'src/resize.js',
		        	'src/menu.js',
		        	'src/shared-datasource.js',
		        	//'src/datepicker.js',
		        	'src/lookup.js',
		        	'src/tabs.js',
		        	'src/btn-group.js',
                    'src/data-panel.js'

		        ],
		        dest: 'dist/noinfopath-ui.js'
		    },
            readme: {
                src: ['docs/noinfopath-ui.md'],
		    	dest: 'readme.md'
            }

        },
        karma: {
          unit: {
            configFile: "karma.conf.js"
          },
          menu: {
            configFile: "karma.conf.menu.js",
          },
          continuous: {
            configFile: 'karma.conf.js',
            singleRun: true,
            browsers: ['PhantomJS']
          }
        },
        bumpup: {
        	file: 'package.json'
    	},
    	version: {
    		options: {
        		prefix: '@version\\s*'
      		},
    		defaults: {
    			src: ['src/globals.js']
    		}
    	},
        watch: {
            dev: {
              files: ['src/**/*.*', 'test/**/*.spec.js'],
              tasks: ['test-menu']
            }
        },
        nodocs: {
    		"internal": {
    			options: {
    				src: 'dist/noinfopath-ui.js',
    				dest: 'docs/noinfopath-ui.md',
    				start: ['/*','/**']
    			}
    		},
    		"public": {
    			options: {
    				src: 'dist/noinfopath-ui.js',
    				dest: 'docs/noinfopath-ui.md',
    				start: ['/*']
    			}
    		}
    	},
    });

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-bumpup');
	grunt.loadNpmTasks('grunt-version');
    grunt.loadNpmTasks('grunt-nodocs');

	//Default task(s).
	grunt.registerTask('compile', ['karma:continuous', 'concat:noinfopath', 'nodocs:internal', 'concat:readme']);
    grunt.registerTask('notest', ['concat:noinfopath', 'copy:test']);
    grunt.registerTask('test-menu', ['karma:menu']);
    grunt.registerTask('build', ['karma:continuous', 'bumpup','version','concat:noinfopath','nodocs:internal','concat:readme']);


};
