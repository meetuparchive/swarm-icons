module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-svgmin');
	grunt.loadNpmTasks('grunt-svgstore');
	grunt.loadNpmTasks('grunt-gh-pages');

	var SRC = 'src/',
		SRC_SKETCH = `${SRC}sketch/`;

	var DIST = 'dist/',
		DIST_JS = `${DIST}js/`,
		DIST_WEB_SVG = `${DIST}svg/`,
		DIST_ANDROID_SVG = `${DIST}svg/android/`,
		DIST_WEB_OPTIMIZED = `${DIST}optimized/`,
		DIST_ANDROID_OPTIMIZED = `${DIST}optimized/android/`,
		DIST_SPRITE = `${DIST}sprite/`,
		DOC_SRC = 'doc/template/',
		DOC_DEST = 'doc/build/';


	grunt.initConfig({
		package: grunt.file.readJSON('package.json'),

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
			web: {
				files: [{
					expand: true,
					cwd: DIST_WEB_SVG,
					src: ['**/*.svg'],
					dest: DIST_WEB_OPTIMIZED
				}]
			},
			android:{
				files: [{
					expand: true,
					cwd: DIST_ANDROID_SVG,
					src: ['**/*.svg'],
					dest: DIST_ANDROID_OPTIMIZED
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
					src: [`${DIST_WEB_OPTIMIZED}*.svg`],
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

	var platform = grunt.option('platform') || 'web';
	grunt.registerTask('minifySvg', ['svgmin:' + platform]);

};
