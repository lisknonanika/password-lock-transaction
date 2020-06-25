const axios = require('axios');
const { configDevnet, genesisBlockDevnet } = require("../config");
const { getNetworkIdentifier } = require("@liskhq/lisk-cryptography");
const { PasswordLockCancelTransaction } = require("password-lock-transaction");

const getTimestamp = () => {
    let now = new Date();
    const millisSinceEpoc = now.getTime() - Date.parse(configDevnet.app.genesisConfig.EPOCH_TIME) - 10;
    const inSeconds = ((millisSinceEpoc) / 1000).toFixed(0);
    return parseInt(inSeconds);
}

const networkIdentifier = getNetworkIdentifier(
  genesisBlockDevnet.payloadHash,
  genesisBlockDevnet.communityIdentifier
);

const param = {
    asset: {
      amount: "0",
      data: {
        targetTransactionId: "10392999613536451382"
      }
    },
    networkIdentifier: networkIdentifier,
    fee: PasswordLockCancelTransaction.FEE,
    timestamp: getTimestamp()
}

const tx = new PasswordLockCancelTransaction(param);
tx.sign("robust swift grocery peasant forget share enable convince deputy road keep cheap");

(async () => {
  try {
    const res = await axios.post('http://localhost:4003/api/transactions', tx);
    console.log(res.data);
  } catch (err) {
    console.log(err.response.data);
  }
})();
