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
 * @param {Array} modifiedFiles - list of modified files from SRC_DIR
 */
const exportFiles = modifiedFiles => {
	modifiedFiles
		.forEach(file => {
			exportArtboards(
				`${SRC_DIR}${file}`,
				DEST_DIR,
				PLATFORM,
				FORMAT
			);
		});
};

// only build files that have changed
exec(
	`git diff master --name-only ${SRC_DIR}`,
	(error, result) => {
			if (error !== null) throw new Error(`exec error: ${error}`);

			modifiedFiles = result
				.split('\n')        // array from stdout lines
				.filter(f => f)     // filter empty strings
				.map(f => f         // take only the file name and extension
					.split(/\//)
					.pop()
				);

			if (modifiedFiles.length) {
				console.info(`Exporting ${modifiedFiles} as ${FORMAT} for ${PLATFORM}`);
				exportFiles(modifiedFiles);
			} else {
				console.info('No sketch changes found, halting build');
			}
	}
);
