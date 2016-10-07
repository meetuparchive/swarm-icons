module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-svgmin');
	grunt.loadNpmTasks('grunt-svgstore');
	grunt.loadNpmTasks('grunt-gh-pages');
	grunt.loadNpmTasks('grunt-contrib-clean');

	var DIST = 'dist/',
		DIST_OPTIMIZED = DIST + 'optimized/',
		DIST_ANDROID = DIST + 'android/',
		DIST_IOS = DIST + 'iOS/',
		DIST_SPRITE = DIST + 'sprite/';


	grunt.initConfig({
		package: grunt.file.readJSON('package.json'),

		//
		// CLEAN
		// removes all distrubtions prior to rebuilding
		//
		'clean': {
			css: [DIST_OPTIMIZED, DIST_ANDROID, DIST_IOS, DIST_SPRITE]
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
		}
	});

	grunt.registerTask('dist', ['svgmin']);
	grunt.registerTask('default', ['clean', 'dist']);
};
