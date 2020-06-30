
const axios = require('axios');
const { getNetworkIdentifier } = require("@liskhq/lisk-cryptography");
const { configDevnet, genesisBlockDevnet, baseURL, apiURL } = require("../config");

module.exports.getBaseURL = baseURL;

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
    if (err.response) return err.response.data;
    return err;
  }
}

module.exports.getTransactionById = async(id) => {
  try {
    const res = await axios.get(`${apiURL}/transactions?id=${id}`);
    if (res.data.data.length === 0) return undefined;
    return res.data.data[0];
  } catch (err) {
    console.log(err);
    if (err.response) return err.response.data;
    return err;
  }
}

module.exports.postTransaction = async(tx) => {
  try {
    const res = await axios.post(`${apiURL}/transactions`, tx);
    console.log(res);
    return res.data;
  } catch (err) {
    console.log(err);
    if (err.response) return err.response.data;
    return err;
  }
}