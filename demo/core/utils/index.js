
const axios = require('axios');
const { getNetworkIdentifier } = require("@liskhq/lisk-cryptography");
const { configDevnet, genesisBlockDevnet } = require("../config");

const apiURL = "http://localhost:4003/api";

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

module.exports.getAccountByAddress = async(address) => {
  try {
    const res = await axios.get(`${apiURL}/accounts?address=${address}`);
    if (res.data.data.length === 0) return undefined;
    return res.data.data[0];
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

module.exports.postTransaction = async(tx) => {
  try {
    const res = await axios.post(`${apiURL}/transactions`, tx);
    console.log(res);
    return res.data;
  } catch (err) {
    console.log(err);
    return undefined;
  }
}