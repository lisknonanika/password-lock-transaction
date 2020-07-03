# password-lock-transaction

This project is PoC built with Lisk SDK

[For more information](https://medium.com/@ysmdmg/i-created-password-lock-transaction-lisk-sdk-poc-f8251d369f10)

## Preparation

Please refer to [Lisk SDK Docs](https://lisk.io/documentation/lisk-sdk/index.html) for the construction of the execution environment of Lisk SDK.

## Install

```
npm i @lisknonanika/password-lock-transaction
```

## Usage

### Send

```node:send.js
const { PasswordLockSendTransaction } = require('@lisknonanika/password-lock-transaction');

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
  timestamp: timestamp
}

const tx = new PasswordLockSendTransaction(param);
```

### Receive

```node:receive.js
const { PasswordLockReceiveTransaction } = require('@lisknonanika/password-lock-transaction');

const param = {
  asset: {
    recipientId: "8273455169423958419L",
    data: {
      targetTransactionId: "6957123909436752912",
      password: "Eq2vR9*cDK7GBvj&jc",
    }
  },
  fee: PasswordLockReceiveTransaction.FEE,
  networkIdentifier: networkIdentifier,
  timestamp: timestamp
}
const tx = new PasswordLockReceiveTransaction(param);
```


### Cancel

```node:cancel.js
const { PasswordLockCancelTransaction } = require('@lisknonanika/password-lock-transaction');

const param = {
  asset: {
    data: {
      targetTransactionId: "12922202434338319164"
    }
  },
  fee: PasswordLockCancelTransaction.FEE,
  networkIdentifier: networkIdentifier,
  timestamp: timestamp
}

const tx = new PasswordLockCancelTransaction(param);
```

### Transaction config


```json:transaction_config.json
{
    "type": {
        "send": 151,
        "receive": 152,
        "cancel": 153
    },
    "fee": {
        "send": "0.05",
        "receive": "0.02",
        "cancel": "0.01"
    },
    "crypto": {
        "pwdLength": 18,
        "includePlainData": true,
        "usePasswordStrings": "23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ+-=_&*?@"
    }
}
```

```node:sample.js
const { conf } = require('@lisknonanika/password-lock-transaction/config');

conf.fee.send = "0.1";
conf.crypto.includePlainData = false;
```



