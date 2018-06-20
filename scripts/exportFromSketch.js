const fs = require('fs');
const exportArtboards = require('./util/sketchtoolUtils').exportArtboardsFromFile;
const exec = require('child_process').exec;

/**
 * Exports artboards from sketch files in `src/sketch` in the formats
 * specified in this projects `exportConfig.json`.
 *
 * Config example:
 * ```
 * {
 * 	"name": <name of export set for reference>,
 * 	"options": {
 * 		"destination": <destination for exported files>,
 * 		"platform": <name of platform "page" in sketch file>,
 * 		"format": <export file format>
 * 	}
 * }
 * ```
 *
 * Usage:
 * `node exportFromSketch <exportConfig.json>`
 */

//
// Because we `diff` against `master` to select which files to export,
// bail out if `src/sketch/` is in dirty state.
//
exec(
	`git status --porcelain ${SRC_DIR}`,
	(error, result) => {
			if (error !== null) throw new Error(`exec error: ${error}`);

			const localChanges = result
				.split('\n')
				.filter(f => f);

			if (localChanges.length) {
				console.error('\n---------------------------------------------------------------');
				console.error(`${SRC_DIR} is in a dirty state.`);
				console.error('You must commit sketch files before exports can build.');
				console.error(`Please commit your changes in ${SRC_DIR} and try again.`);
				console.error('---------------------------------------------------------------\n');
				process.exit(1);
			}
	}
);

const config = JSON.parse(fs.readFileSync(process.argv[2]));
const SRC_DIR = config.source;

/**
 * Uses sketchtoolUtils to export `fileNames` sketch files
 * to specified format and platform
 *
 * @param {Array} fileNames - list of modified files from SRC_DIR
 * @param {String} srcDir - source directory of sketch files
 * @param {String} destDir - destination for file exports
 * @param {String} platform - sketch platform page name
 * @param {String} format - export file format
 */
const exportFiles = (fileNames, srcDir, destDir, platform, format) => {
	fileNames
		.forEach(file => {
			exportArtboards(
				`${SRC_DIR}${file}`,
				DEST_DIR,
				PLATFORM,
				FORMAT
			);
		});
};

/**
 * @param {String} stdout - produced by git command
 * @returns {Array} - array of file names
 */
const diffToArray = stdout => stdout
	.split('\n')        // array from stdout lines
	.filter(f => f)     // filter empty strings
	.map(f => f         // take only the file name and extension
		.split(/\//)
		.pop()
	);


//
// only build files that have changed
//
// `--diff-filter=ACMRT`
// A - added
// C - copied
// M - modified
// T - type (mode) change
exec(
	`git diff master --diff-filter=ACMT --name-only ${SRC_DIR}`,
	(error, result) => {
		if (error !== null) throw new Error(`exec error: ${error}`);

		const filesToExport = diffToArray(result);

		if (filesToExport.length) {
			config.distributions.forEach(dist => {
				const {
					destination,
					platform,
					format,
				} = dist.options;

				console.info(`Exporting ${filesToExport} as ${format} for ${platform}`);

				exportFiles(
					filesToExport,
					SRC_DIR,
					destination,
					platform,
					format
				);
			});
		} else {
			console.info('\nNo sketch changes found, skipping build\n');
		}

	}
);
