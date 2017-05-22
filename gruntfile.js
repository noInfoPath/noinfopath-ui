module.exports = function(grunt) {
  var DEBUG = !!grunt.option("debug");
  // Project configuration.
  grunt.initConfig(
    {
      pkg: grunt.file.readJSON("package.json"),
      copy: {
        wiki: {
          files: [
            {
              expand: true,
              flatten: true,
              src: ["docs/*.md", "!docs/global.md"],
              dest: "../wikis/<%= pkg.shortName %>.wiki/"
            }
          ]
        }
      },
      shell: {
        wiki1: {
          command: [
            "cd ../wikis/<%= pkg.shortName %>.wiki",
            "git stash",
            "git pull"
          ].join(" && ")
        },
        wiki2: {
          command: [
            "cd ../wikis/<%= pkg.shortName %>.wiki",
            "git add .",
            "git commit -m \"Wiki Updated\"",
            "git push"
          ].join(" && ")
        }
      },
      concat: {
        noinfopath: {
          src: [
            "src/home.js",
            "src/progressbar.js",
        	"src/autocomplete.js",
            "src/breadcrumb.js",
            //"src/editable-grid.js",
            //"src/grid.js",
            "src/resize.js",
            "src/menu.js",
            "src/shared-datasource.js",
            //"src/datepicker.js",
            "src/lookup.js",
            "src/input.js",
            //"src/tabs.js",
            "src/btn-group.js",
            "src/data-panel.js",
            "src/misc.js",
            "src/file-upload.js",
            "src/file-viewer.js",
            "src/show.js",
            "src/listview.js",
            "src/thumbnail-viewer.js",
            "src/dnd-cover.js",
            "src/notify.js",
			"src/prompt.js",
			"src/checkbox.js",
			"src/no-list-source.js"
          ],
          dest: "dist/<%= pkg.shortName %>.js"
        },
        readme: {
          src: ["docs/noinfopath-ui.md"],
          dest: "readme.md"
        },
        wikiHome: {
          src: ["docs/global.md"],
          dest: "docs/home.md"
        }
      },
      karma: {
        unit: {
          configFile: "karma.conf.js",
          singleRun: true
        },
        menu: {
          configFile: "karma.conf.menu.js"
        },
        continuous: {
          configFile: "karma.conf.js",
          singleRun: true,
          browsers: ["Chrome"]
        }
      },
      bumpup: {
        file: "package.json"
      },
      version: {
        options: {
          prefix: "@version\\s*"
        },
        defaults: {
          src: ["src/**.js"]
        }
      },
      watch: {
        dev: {
          files: ["src/**/*.*", "test/**/*.spec.js"],
          tasks: ["concat:noinfopath"]
        },
        document: {
          files: ["src/**/*.*"],
          tasks: ["document"]
        }
      },
      nodocs: {
        internal: {
          options: {
            src: "src/*.js",
            dest: "docs/noinfopath-ui.md",
            start: ["/*","/**"],
            multiDocs: {
              multiFiles: true,
              dest: "docs/"
            }
          }
        },
        makeReadme: {
          options: {
            src: "src/home.js",
            dest: "README.md",
            start: ["/*"]
          }
        },
        public: {
          options: {
            src: "dist/noinfopath-ui.js",
            dest: "docs/noinfopath-ui.md",
            start: ["/*"]
          }
        },
        wiki: {
          options: {
            src: "src/*.js",
            dest: "docs/<%= pkg.shortName %>.md",
            start: ["/*", "/**"],
            multiDocs: {
              multiFiles: true,
              dest: "docs/"
            }
          }
        }
      }
    }
  );

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-karma");
  grunt.loadNpmTasks("grunt-bumpup");
  grunt.loadNpmTasks("grunt-version");
  grunt.loadNpmTasks("grunt-nodocs");
  grunt.loadNpmTasks("grunt-shell");

  //Default task(s).
  grunt.registerTask("compile", ["karma:continuous", "concat:noinfopath", "nodocs:internal", "concat:readme"]);
  grunt.registerTask("notest", ["concat:noinfopath", "copy:test"]);
  grunt.registerTask("test-menu", ["karma:menu"]);
  grunt.registerTask("build", ["karma:continuous", "bumpup","version","concat:noinfopath","nodocs:internal","concat:readme"]);
  grunt.registerTask("document", ["concat:noinfopath", "nodocs:wiki"]);
  grunt.registerTask("release", ["bumpup", "version", "updateWiki", "concat:noinfopath", "copy:wiki", "concat:wikiHome", "concat:readme"]);
  grunt.registerTask("updateWiki", ["document", "wikiWack"]);
  grunt.registerTask("wikiWack", ["shell:wiki1", "concat:wikiHome", "copy:wiki", "shell:wiki2"]);
};
