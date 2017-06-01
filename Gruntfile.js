module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-svgmin');
	grunt.loadNpmTasks('grunt-svgstore');
	grunt.loadNpmTasks('grunt-gh-pages');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-exec');

	var SRC = 'src/',
		SRC_SKETCH = `${SRC}sketch/`;

	var DIST = 'dist/',
		DIST_JS = `${DIST}js/`,
		DIST_SVG = `${DIST}svg/`,
		DIST_OPTIMIZED = `${DIST}optimized/`,
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
			all: [
				DIST_SVG,
				DIST_OPTIMIZED,
				DIST_SPRITE,
				DOC_DEST
			],
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
					{ removeViewbox: false },
					{
						removeAttrs: {
							attrs: ['fill']
						}
					}
				]
			},
			dist: {
				files: [{
					expand: true,
					cwd: DIST_SVG,
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
					src: [`${DIST_OPTIMIZED}*.svg`],
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
			exportSVG: {
				cmd: `node scripts/exportFromSketch.js ${SRC_SKETCH} ${DIST_SVG} web svg`
			},
			jsConstants: {
				cmd: `node scripts/generateConstants.js '${DIST_OPTIMIZED}' '${DIST_JS}'`
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


	grunt.registerTask('dist', [
		'exec:exportSVG'      // 0. build SVG dist from sketch files
	]);
		/*
		 *'svgmin',              // 1. build optimized dist from SVG dist
		 *'exec:jsConstants',    // 2. js valid shape constants from optimized dist
		 *'svgstore'             // 3. build sprite from optimized dist
		 */

	grunt.registerTask('default', ['clean:all', 'dist']);
	grunt.registerTask('ghpages', ['default', 'gh-pages']);
};
