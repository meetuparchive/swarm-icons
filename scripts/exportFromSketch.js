const fs = require('fs');
const exportArtboards = require('./util/sketchtoolUtils').exportArtboardsFromFile;

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

fs.readdirSync(SRC_DIR)
	.forEach(file => {
		exportArtboards(
			`${SRC_DIR}${file}`,
			DEST_DIR,
			PLATFORM,
			FORMAT
		);
	});
