
const { getNetworkIdentifier } = require("@liskhq/lisk-cryptography");
const { configDevnet, genesisBlockDevnet } = require("password-lock-transaction-core-config");

module.exports.getTimestamp = () => {
    let now = new Date();
    const millisSinceEpoc = now.getTime() - Date.parse(configDevnet.app.genesisConfig.EPOCH_TIME) - 30;
    const inSeconds = ((millisSinceEpoc) / 1000).toFixed(0);
    return parseInt(inSeconds);
}

module.exports.networkIdentifier = getNetworkIdentifier(
  genesisBlockDevnet.payloadHash,
  genesisBlockDevnet.communityIdentifier
);