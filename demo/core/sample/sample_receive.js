const axios = require('axios');
const { configDevnet, genesisBlockDevnet } = require("../config");
const { getNetworkIdentifier } = require("@liskhq/lisk-cryptography");
const { PasswordLockReceiveTransaction } = require("password-lock-transaction");

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
      recipientId: "8273455169423958419L",
      data: {
        targetTransactionId: "9097128777207547956",
        password: "Zxs*6N+w82UDdK73sr",
      }
    },
    networkIdentifier: networkIdentifier,
    fee: PasswordLockReceiveTransaction.FEE,
    timestamp: getTimestamp()
}

const tx = new PasswordLockReceiveTransaction(param);
tx.sign("robust swift grocery peasant forget share enable convince deputy road keep cheap");

(async () => {
  try {
    const res = await axios.post('http://localhost:4003/api/transactions', tx);
    console.log(res.data);
  } catch (err) {
    console.log(err.response.data);
  }
})();
