const request = require('request');
const { configDevnet } = require("./config");
const { PasswordLockCancelTransaction } = require("../src")

const getTimestamp = () => {
    let now = new Date();
    const millisSinceEpoc = now.getTime() - Date.parse(configDevnet.app.genesisConfig.EPOCH_TIME) - 10;
    const inSeconds = ((millisSinceEpoc) / 1000).toFixed(0);
    return parseInt(inSeconds);
}

const param = {
    asset: {
      data: {
        targetTransactionId: "5612724046109811688"
      }
    },
    fee: PasswordLockCancelTransaction.FEE,
    timestamp: getTimestamp()
}

const tx = new PasswordLockCancelTransaction(param);
tx.sign("robust swift grocery peasant forget share enable convince deputy road keep cheap");

const options = {
  uri: "http://localhost:4000/api/transactions",
  headers: { "Content-type": "application/json" },
  json: tx
};

request.post(options, function(err, res, body) {
  if (err) {
    console.log('Error: ' + err.message);
    return;
  }
  console.log(body);
});
