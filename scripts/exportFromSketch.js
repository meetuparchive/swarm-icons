const fs = require('fs');
const exportArtboards = require('./util/sketchtoolUtils').exportArtboardsFromFile;
const exec = require('child_process').exec;

/**
 * Generates icon distributions from sketch files in `src/sketch`
 *
 * <src dir path> - location of sketch files
 * <dest dir path> - location to export artboards
 * <platform> - must be one of: 'ios', 'web', 'android'
 * <export format> - must be one of: 'svg', 'pdf'
 *
 * Usage:
 * `node exportFromSketch <src dir path> <dest dir path> <platform> <export format>'`
 */

const SRC_DIR = process.argv[2];
const DEST_DIR = process.argv[3];
const PLATFORM = process.argv[4];
const FORMAT = process.argv[5];

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
				console.error('You must commit sketch files before exports can build.');
				console.error(`Please commit your changes in ${SRC_DIR} and try again.`);
				console.error('---------------------------------------------------------------\n');
				process.exit(1);
			}
	}
);

/**
 * Uses sketchtoolUtils to export `fileNames` sketch files
 * to specified format and platform
 *
 * @param {Array} fileNames - list of modified files from SRC_DIR
 */
const exportFiles = fileNames => {
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
	`ls ${SRC_DIR}`,
	(error, result) => {
		if (error !== null) throw new Error(`exec error: ${error}`);

		const filesToExport = diffToArray(result);

		if (filesToExport.length) {
			console.info(`Exporting ${filesToExport} as ${FORMAT} for ${PLATFORM}`);
			exportFiles(filesToExport);
		} else {
			console.info('\nNo sketch changes found, skipping build\n');
		}

	}
);
