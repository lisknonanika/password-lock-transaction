const genesisBlockDevnet = require("./genesis_block_devnet");
const configDevnet = require("./config_devnet");

const apiURL = `http://localhost:${configDevnet.modules.http_api.httpPort}/api`;

module.exports = {
	configDevnet,
	genesisBlockDevnet,
	apiURL
}
