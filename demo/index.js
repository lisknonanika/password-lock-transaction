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
            senderId: "8273455169423958419L",
            amount: 0.5
          }
        },
        amount: "50000000",
        timestamp: getTimestamp()
    }
    
    const tx = new PasswordLockSendTransaction(param);
    tx.sign("robust swift grocery peasant forget share enable convince deputy road keep cheap");
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
          targetTransactionId: "5681330234037859848",
          password: "66288a833e058aa4",
        }
      },
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
}

const cancelDemo = () => {
  const param = {
      asset: {
        data: {
          targetTransactionId: "9805611612205495706"
        }
      },
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
}

// sendDemo();
// receiveDemo();
// cancelDemo();
