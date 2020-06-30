const genesisBlockDevnet = require("./genesis_block_devnet");
const configDevnet = require("./config_devnet");

const baseURL = "http://localhost:3000";
const apiURL = "http://localhost:4003/api";

module.exports = {
	configDevnet,
	genesisBlockDevnet,
	baseURL,
	apiURL
}
