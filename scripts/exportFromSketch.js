const fs = require('fs');
const exportArtboards = require('./util/sketchtoolUtils').exportArtboardsFromFile;
const exec = require('child_process').exec;

/**
 * Generates icon distributions from sketch files in `src/sketch`
 *
 * <src dir path> - location of sketch files
 * <dest dir path> - location to export artboards
 * <platform> - must be one of: 'ios', 'web'
 * <export format> - must be one of: 'svg', 'pdf'
 *
 * Usage:
 * `node exportFromSketch <src dir path> <dest dir path> <platform> <export format>'`
 */

const SRC_DIR = process.argv[2];
const DEST_DIR = process.argv[3];
const PLATFORM = process.argv[4];
const FORMAT = process.argv[5];

/**
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

// only build files that have changed
//
// we can't assume that the sketch files are committed before
// running the build, so we must `diff` against master _and_
// `status` the sketch source dir
exec(
	`git diff master --name-only ${SRC_DIR}`,
	(error, committedFiles) => {
			if (error !== null) throw new Error(`exec error: ${error}`);

			exec(
				`git status --porcelain ${SRC_DIR}`,
				(error, localModFiles) => {
						if (error !== null) throw new Error(`exec error: ${error}`);

					const filesToExport = Array.from(
						new Set([
							...diffToArray(committedFiles),
							...diffToArray(localModFiles)
						])
					);

					if (filesToExport.length) {
						console.info(`Exporting ${filesToExport} as ${FORMAT} for ${PLATFORM}`);
						exportFiles(filesToExport);

					} else {
						console.info('No sketch changes found, halting build');
					}

				}
			);

	}
);
