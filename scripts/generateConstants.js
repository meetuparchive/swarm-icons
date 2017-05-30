const fs = require('fs');

/**
 * Generates a js file with an Array constant containing each
 * icon shape name.
 *
 * Usage:
 * `node generateConstants '<src dir path>' '<dest dir path>'`
 */

const SRC_DIR = process.argv[2];
const DEST_DIR = process.argv[3];

const iconNames = fs.readdirSync(SRC_DIR)
	.filter(f => !f.includes('--small'))
	.map(f => f.replace('.svg', ''));

const renderFileContent = iconNames => `const VALID_SHAPES = [${iconNames.map(name => `"${name}"`)}];
export default VALID_SHAPES;
`;

fs.writeFileSync(
	`${DEST_DIR}shapeConstants.js`,
	renderFileContent(iconNames)
);
