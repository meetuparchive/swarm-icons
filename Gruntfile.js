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
			all: [DIST_OPTIMIZED, DIST_IOS, DIST_SPRITE, DOC_DEST],
			icons: [DIST_ICONS_IOS, DIST_ICONS_WEB]
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
					cwd: 'dist/svg/raw',
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
					src: ['dist/svg/optimized/*.svg'],
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
		},

		'export': {
			target: {
				src: ['src/sketch/*.sketch']
			},
		}

	});


	grunt.registerTask('optimize', ['svgmin']);
  grunt.registerTask('export', ['clean:icons', 'export']);
	grunt.registerTask('dist', ['optimize', 'svgstore', 'exec:jsConstants']);

	grunt.registerTask('default', ['clean:all', 'dist', 'preprocess']);
	grunt.registerTask('ghpages', ['default', 'gh-pages']);

	grunt.registerTask('export_artboards', 'export artboards', function(artboardNames, src, platform) {
		var done = this.async();
		var platformOptions = {};
		var platformName = platform.toUpperCase();
		var destination;

		switch(platformName){
			case 'WEB':
				destination = DIST_ICONS_WEB
				platformOptions = {
					formats: 'svg',
					scales: '1.0'
				}
				break;
			case 'IOS':
				destination = DIST_ICONS_IOS
				platformOptions = {
					formats: 'pdf',
					scales: '1.0'
				}
				break;

			default:
				console.log('platform is invalid')
		}

		grunt.util.spawn({
			cmd: 'sketchtool',
			args: [
				'export',
				'artboards',
				src,
				'--items=' + artboardNames,
				'--scales=' + platformOptions.scales,
				'--output=' + destination,
				'--formats=' + platformOptions.formats
				]
		}, function(error, result, code){
			done();
		});
	});

	var getArtboards = function(artboardJSON, artboardNames) {
		return artboardJSON.map(board => {
			artboardNames.push(board.name);
		});
	};

	grunt.registerMultiTask('export', 'list artboards', function(){
		var done = this.async();
		var options = this.options();
		var platform = grunt.option('platform') ? grunt.option('platform').toUpperCase() : 'ALL';
		var platformDistributions = ['IOS', 'WEB'];
		var isValidPlatform = ['ALL', ...platformDistributions].includes(platform);

		var exportFn = function(platform, filepath) {
			grunt.util.spawn({
				cmd: 'sketchtool',
				args: ['list', 'artboards', filepath]
			}, function(error, result, code) {
				var sketchData = JSON.parse(result);
				var artboardData = [];
				var artboardNames = [];

				for (var i = 0; i < sketchData.pages.length; i++) { //TODO: artboardData = sketchData.pages.forEach...
					if(sketchData.pages[i].name.toUpperCase() == platform){
						artboardData.push(sketchData.pages[i].artboards);
					}
				}
				var artboardDataFlat = [].concat.apply([], artboardData);

				grunt.task.run([
					'export_artboards'
						+ ':' + getArtboards(artboardDataFlat, artboardNames)
						+ ':' + filepath
						+ ':' + platform
				]);

				done();
			});
		};

		var errorMsg = '\n \n Try running:  \
		\n grunt export \
		\n grunt export --platform iOS \
		\n grunt export --platform Web';

		if (!isValidPlatform){
			grunt.log.error('"' + platform + '"' + ' is not a valid platform name', errorMsg);
			return false;
		}

		// We should probably add a way to just export a single icon
		// by passing in a filepath to some kind of 'src' option
		this.files.forEach(function(f) {
			var src = f.src.filter(function(filepath) {

				// Maybe we don't need this since we're only supporting generating all files at once?
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Sketch file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}

			});

			src.forEach(filePath => {
				if (platform !== 'ALL') {
					exportFn(platform, filePath);
				} else {
					for (var i = 0; i < platformDistributions.length; i++) {
						exportFn(platformDistributions[i], filePath);
					}
				}
			});



		});

	});
};
