const request = require('request');
const { configDevnet } = require("./config");
const { PasswordLockReceiveTransaction } = require("password-lock-transaction");

const getTimestamp = () => {
    let now = new Date();
    const millisSinceEpoc = now.getTime() - Date.parse(configDevnet.app.genesisConfig.EPOCH_TIME) - 10;
    const inSeconds = ((millisSinceEpoc) / 1000).toFixed(0);
    return parseInt(inSeconds);
}

const param = {
    asset: {
      data: {
        targetTransactionId: "6257980881051108330",
        password: "P7F3NKjct=3wEyT*QU",
      }
    },
    fee: PasswordLockReceiveTransaction.FEE,
    recipientId: "8273455169423958419L",
    timestamp: getTimestamp()
}

const tx = new PasswordLockReceiveTransaction(param);
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
