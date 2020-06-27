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
        targetTransactionId: "6957123909436752912",
        password: "Eq2vR9*cDK7GBvj&jc",
      }
    },
    networkIdentifier: networkIdentifier,
    fee: PasswordLockReceiveTransaction.FEE,
    timestamp: getTimestamp()
}

const tx = new PasswordLockReceiveTransaction(param);
tx.sign("wagon stock borrow episode laundry kitten salute link globe zero feed marble");

(async () => {
  try {
    const res = await axios.post('http://localhost:4003/api/transactions', tx);
    console.log(res.data);
  } catch (err) {
    console.log(err.response.data);
  }
})();
