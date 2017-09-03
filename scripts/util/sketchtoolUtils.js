const exec = require('child_process').exec;

/**
 * @param {JSON} artboardsJSON - artboards JSON metadata from sketch file
 * @param {String} platform- the sketch "page" from which to get artboards
 * @returns {Array} list of artboard ids for given platform
 */
const getArtboardIds = (artboardsJSON, platform) => {
	const platformPage = JSON.parse(artboardsJSON)
		.pages
		.filter(page => page.name.toUpperCase() === platform.toUpperCase())
		.pop();

	if (!platformPage) return false;

	return platformPage
		.artboards
		.map(board => board.id);
};

/**
 * Writes `filePath` file to `destination` with given export `format`
 *
 * @param {String} filePath - path to individual sketch file
 * @param {String} destination - dest for export
 * @param {String} platform - `ios` or `web`
 * @param {String} format - `svg` or `pdf`
 */
exports.exportArtboardsFromFile = (filePath, destination, platform, format) => {
	const exportCmdBase = `sketchtool export artboards ${filePath}`;
	const exportCmdOptions = `--scales=1.0 --output=${destination} --formats=${format}`;

	// First, list the artboards in the given file.
	// Sketch can contain any number of artbords in one file.
	//
	// We use different artboards for different variants of the same
	// icon. For example, `location.sketch` contains:
	//    - "location" arboard
	//    - "location--small" artboard
	exec(
		`sketchtool list artboards ${filePath}`,
		(error, result) => {

			if (error !== null) throw new Error(`exec error: ${error}`);

			const itemsOption = getArtboardIds(result, platform);

			console.log('itemsOption: ', itemsOption);

			// Run the export command with the list of arboards
			// for the given file.
			//
			// `sketchtool` will generate an export file for each artboard.
			if (itemsOption) {
				exec(
					`${exportCmdBase} ${exportCmdOptions} --items=${itemsOption}`,
					(error, result) => {
						if (error !== null) throw new Error(`exec error: ${error}`);
						console.info(result);
					}
				);
			}
		}
	);
};
