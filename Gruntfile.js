module.exports = function(grunt) {

    "use strict";

    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-es6-transpiler');
    // grunt.loadNpmTasks("grunt-contrib-connect");

    grunt.initConfig({

        sass: {

            dev: {
                options: {
                    style: "compressed"
                },

                files : {
                    "css/styles.min.css": "sass/*.scss"
                }
            }
        },

        uglify: {

            dev: {
                options: {
                    compress: {},
                    mangle: true,
                    preserveComments: false
                },

                files: {
                    "js/script.min.js" : ["js/script.js"]
                }
            }
        },

        // connect: {

        //     server : {
        //         options: {
        //             port: 8080,
        //             open: {
        //                 target: 'http://localhost:8000'
        //             }
        //         }
        //     }
        // },

        autoprefixer: {
          options: {

            browsers: ['last 3 versions', 'ie 9']
          },
          dist: { 
            files: {
              'css/styles.min.css': 'css/styles.min.css'
            }
          }
        },

        jshint: {

            options: {
               esversion: 6
            },
            all: ['Gruntfile.js', 'javaScript/*.js']
        },

        es6transpiler: {
            dist: {
                files: {
                    'js/script.js': 'javaScript/*.js'
                }
            }
        },

        watch: {

            js: {
                files: ["javaScript/*.js"],
                tasks: ["es6transpiler", "jshint","uglify:dev"]
            },

            scss: {
                files: ["sass/*.scss"],
                tasks: ["sass:dev", "autoprefixer"]
            }
        }
    });

    grunt.registerTask("run", ["sass:dev", "jshint", "es6transpiler",/* "connect:server", */  "uglify:dev", "autoprefixer", "watch"]);
};