const axios = require('axios');
const { configDevnet, genesisBlockDevnet } = require("../config");
const { getNetworkIdentifier } = require("@liskhq/lisk-cryptography");
const { PasswordLockSendTransaction } = require("password-lock-transaction");

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
    amount: "50000000",
    data: {
      senderId: "8273455169423958419L",
      amount: 0.5
    }
  },
  fee: PasswordLockSendTransaction.FEE,
  networkIdentifier: networkIdentifier,
  timestamp: getTimestamp()
}

const tx = new PasswordLockSendTransaction(param);
tx.sign("robust swift grocery peasant forget share enable convince deputy road keep cheap");
console.log(`id: ${tx.id}`);
console.log(`password: ${tx.password}`);
console.log(`cipherText: ${tx.asset.cipherText}`);

(async () => {
  try {
    const res = await axios.post('http://localhost:4003/api/transactions', tx);
    console.log(res.data);
  } catch (err) {
    console.log(err.response.data);
  }
})();
