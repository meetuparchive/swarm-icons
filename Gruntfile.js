module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-svgmin');
	grunt.loadNpmTasks('grunt-svgstore');
	grunt.loadNpmTasks('grunt-gh-pages');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-exec');

	var DIST = 'dist/',
		DIST_OPTIMIZED = `${DIST}optimized/`,
		DIST_ANDROID = `${DIST}android/`,
		DIST_IOS = `${DIST}iOS/`,
		DIST_SPRITE = `${DIST}sprite/`,
		DOC_SRC = 'doc/template/',
		DOC_DEST = 'doc/build/';


	grunt.initConfig({
		package: grunt.file.readJSON('package.json'),

		//
		// CLEAN
		// removes all distrubtions prior to rebuilding
		//
		'clean': {
			all: [DIST_OPTIMIZED, DIST_ANDROID, DIST_IOS, DIST_SPRITE, DOC_DEST]
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
					cwd: 'src/svg',
					src: ['**/*.svg'],
					dest: DIST_OPTIMIZED
				}]
			}
		},

		'generateConstants': {
			dist: {
				files: [{
					src: ['src/svg/*.svg'],
					dest: `${DIST}js/`
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
					src: ['src/svg/*.svg'],
					dest: `${DIST_SPRITE}sprite.inc`
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
					'VERSION': '<%= package.version %>',
					'STYLESHEET_SQ': 'https://meetup.github.io/sassquatch2/bundle/sassquatch.css',
					'STYLESHEET_FONT': 'https://secure.meetupstatic.com/fonts/graphik.css'
				},
				srcDir: DIST_SPRITE // resovle @include directive to built sprite
			},
			docs: {
				src: `${DOC_SRC}index.html`,
				dest: `${DOC_DEST}index.html`
			}
		},

		//
		// Other build scripts
		//
		exec: {
			jsConstants: {
				cmd: `node scripts/generateConstants.js '${DIST_OPTIMIZED}' '${DIST}/js/'`
			}
		},

		//
		// LIVE DOCS
		// gh-pages task to move built doc html
		// to root dir of gh-pages branch
		//
		'gh-pages': {
			options: {
				base: DOC_DEST
			},
			src: ['**']
		}

	});


	grunt.registerTask('optimize', ['svgmin']);
	grunt.registerTask('dist', ['optimize', 'svgstore', 'exec:jsConstants']);

	grunt.registerTask('default', ['clean', 'dist', 'preprocess']);
	grunt.registerTask('ghpages', ['default', 'gh-pages']);
};
