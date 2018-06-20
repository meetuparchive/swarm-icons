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

const config = JSON.parse(fs.readFileSync(process.argv[2]));
const SRC_DIR = config.source;

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

		if (!filesToExport.length) {
			console.info('\nNo sketch changes found, skipping build\n');
			return;
		}

		if (!config.distributions.length) {
			console.info('\nNo distributions found in config.json\n');
			return;
		}

		// run export for each distribution
		config.distributions.forEach(dist => {
			const {
				destination,
				platform,
				format,
			} = dist.options;

			console.info(`\n${dist.name}:`);
			console.info(`Queuing export of ${format} files for ${platform}...`);

			// run export on all sketch files with current dist config
			filesToExport.forEach(file => {
				exportArtboards(
					`${SRC_DIR}/${file}`,
					destination,
					platform,
					format
				);
			});

		});
	}
);
