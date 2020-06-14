const {PasswordLockSendTransaction} = require("../src/transactions")

const trx = new PasswordLockSendTransaction(
    {
        asset: {
            data: {
                senderId: "123456789012345678L",
                message: "hello",
                amount: 0.1
            }
        }
    }
)
console.log(trx)

const utils = require("../src/utils")
// const con = utils.cipher({
//     senderId: "123456789012345678L",
//     message: "hello",
//     amount: 12345678.1234567
// })
// console.log(con)

// const con2 = utils.decipher(
//     con.cipherText,
//     con.password
// )
// console.log(con2)