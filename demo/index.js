const request = require('request');
const { configDevnet } = require("./config");
const { PasswordLockSendTransaction,
		PasswordLockReceiveTransaction,
		PasswordLockCancelTransaction } = require("../src")

const getTimestamp = () => {
    let now = new Date();
    const millisSinceEpoc = now.getTime() - Date.parse(configDevnet.app.genesisConfig.EPOCH_TIME) - 10;
    const inSeconds = ((millisSinceEpoc) / 1000).toFixed(0);
    return parseInt(inSeconds);
}

const sendDemo = () => {
    const param = {
        asset: {
          data: {
            senderId: "16313739661670634666L",
            amount: 0.5
          }
        },
        fee: PasswordLockSendTransaction.FEE,
        amount: "50000000",
        timestamp: getTimestamp()
    }
    
    const tx = new PasswordLockSendTransaction(param);
    tx.sign("wagon stock borrow episode laundry kitten salute link globe zero feed marble");
    console.log(`id: ${tx.id}`)
    console.log(`password: ${tx.password}`)
    console.log(`cipherText: ${tx.asset.cipherText}`)
    
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
}

const receiveDemo = () => {
  const param = {
      asset: {
        data: {
          targetTransactionId: "6257980881051108330",
          password: "P7F3NKjct=3wEyT*QU",
        }
      },
      fee: PasswordLockReceiveTransaction.FEE,
      recipientId: "16313739661670634666L",
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
}

const cancelDemo = () => {
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
  tx.sign("wagon stock borrow episode laundry kitten salute link globe zero feed marble");
  
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
}

sendDemo();
// receiveDemo();
// cancelDemo();
