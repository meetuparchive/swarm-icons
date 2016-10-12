module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-svgmin');
	grunt.loadNpmTasks('grunt-svgstore');
	grunt.loadNpmTasks('grunt-gh-pages');
	grunt.loadNpmTasks('grunt-contrib-clean');

	var DIST = 'dist/',
		DIST_OPTIMIZED = DIST + 'optimized/',
		DIST_ANDROID = DIST + 'android/',
		DIST_IOS = DIST + 'iOS/',
		DIST_SPRITE = DIST + 'sprite/',
		DOC_SRC = 'doc/template/',
		DOC_DEST = 'doc/build/';


	grunt.initConfig({
		package: grunt.file.readJSON('package.json'),

		//
		// CLEAN
		// removes all distrubtions prior to rebuilding
		//
		'clean': {
			css: [DIST_OPTIMIZED, DIST_ANDROID, DIST_IOS, DIST_SPRITE, DOC_DEST]
		},

		//
		// SVG optimization step
		// (writes to "optimized" distribution)
		//
		'svgmin': {
			options: {
				plugins: [
					{ removeDesc: true },
					{ collapseGroups: true },
					{ removeEmptyAttrs: true },
					{ removeUselessStrokeAndFill: true },
					{ removeViewbox: false }
				]
			},
			dist: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['**/*.svg'],
					dest: DIST_OPTIMIZED
				}]
			}
		},

		//
		// SVG sprite
		// builds distribution for chapstick
		//
		'svgstore': {
			options: {
				prefix: 'icon-'
			},
			default: {
				files: [{
					src: ['src/*.svg'],
					dest: DIST_SPRITE + 'sprite.inc'
				}]
			}
		},

		//
		// DOCS via preprocess
		// writes an html file to DOC_DEST
		//
		'preprocess': {
			options: {
				context: {
					DEBUG: false,
					'VERSION': '<%= package.version %>'
				},
				srcDir: DIST_SPRITE // resovle @include directive to built sprite
			},
			docs: {
				src: DOC_SRC + 'template/index.html',
				dest: DOC_DEST + 'index.html'
			}
		}

	});


	grunt.registerTask('optimize', ['svgmin']);
	grunt.registerTask('dist', ['optimize', 'svgstore']);
	grunt.registerTask('default', ['clean', 'dist']);
};
