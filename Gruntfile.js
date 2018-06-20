module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-svgmin');
	grunt.loadNpmTasks('grunt-svgstore');
	grunt.loadNpmTasks('grunt-gh-pages');
	grunt.loadNpmTasks('grunt-contrib-clean');

	var SRC = 'src/',
		SRC_SKETCH = `${SRC}sketch/`;

	var DIST = 'dist/',
		DOC_SRC = 'doc/template/',
		DOC_DEST = 'doc/build/';

	var distPaths = {
		DIST_JS: `${DIST}js/`,
		DIST_WEB_SVG: `${DIST}svg/`,
		DIST_ANDROID_SVG: `${DIST}svg/android/`,
		DIST_WEB_OPTIMIZED: `${DIST}optimized/`,
		DIST_ANDROID_OPTIMIZED: `${DIST}optimized/android/`,
		DIST_SPRITE: `${DIST}sprite/`,
	};

	var DIST_PATHS_TO_CLEAN = Object.keys(distPaths)
		.map(k => distPaths[k] + '*');

	var svgminOptions = {
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
	};

	var svgminOptionsAndroid = {plugins: svgminOptions['plugins'].concat([{ convertPathData: { floatPrecision: 2, makeArcs: false } }])};

	grunt.initConfig({
		package: grunt.file.readJSON('package.json'),

		//
		// Cleans `dist/` dir
		//
		'clean': {
			contents: DIST_PATHS_TO_CLEAN
		},

		//
		// SVG optimization step
		// (writes to "optimized" distribution)
		//
		'svgmin': {
			web: {
				options: svgminOptions,
				files: [{
					expand: true,
					cwd: distPaths.DIST_WEB_SVG,
					src: ['*.svg'],
					dest: distPaths.DIST_WEB_OPTIMIZED
				}]
			},
			android:{
				options: svgminOptionsAndroid,
				files: [{
					expand: true,
					cwd: distPaths.DIST_ANDROID_SVG,
					src: ['*.svg'],
					dest: distPaths.DIST_ANDROID_OPTIMIZED
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
					src: [`${distPaths.DIST_WEB_OPTIMIZED}*.svg`],
					dest: `${distPaths.DIST_SPRITE}sprite.inc`
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
				srcDir: distPaths.DIST_SPRITE // resovle @include directive to built sprite
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
