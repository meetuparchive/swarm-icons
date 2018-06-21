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
// Export artboards from all sketch files
// based on dist config from `exportConfig.json`
//
exec(
	`ls ${SRC_DIR}`,
	(error, result) => {
		if (error !== null) throw new Error(`exec error: ${error}`);

		const filesToExport = diffToArray(result);

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
