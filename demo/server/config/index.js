const genesisBlockDevnet = require("./genesis_block_devnet");
const configDevnet = require("./config_devnet");

const apiURL = "http://localhost:4003/api";

module.exports = {
	configDevnet,
	genesisBlockDevnet,
	apiURL
}
