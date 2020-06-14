const { BaseTransaction, TransactionError, utils, constants } = require("@liskhq/lisk-transactions");
const cryptography = require("@liskhq/lisk-cryptography");
const BigNum = require("@liskhq/bignum");
const Ajv = require("ajv");
const receiveSchema = require("../json_schema/receive_asset_schema");
const trxConfig = require("../config");
const trxUtils = require("../utils");

class PasswordLockReceiveTransaction extends BaseTransaction {

    static get TYPE() {
        return trxConfig.type.receive;
    }

    static get FEE() {
        return `${utils.convertLSKToBeddows(trxConfig.fee.receive)}`;
    }

    async prepare(store) {
        await store.account.cache([
            {
                address: this.senderId,
            },
            {
                address: this.recipientId,
            }
        ]);

        if (this.asset.data && this.asset.data.targetTransactionId) {
            store.entities.Transaction.addFilter("target_id", "FILTER_TYPE_CUSTOM", {
                condition: 'trs.asset @> \'{ "data" : { "targetTransactionId" : "${target_id:value}"} }\'::jsonb',
            });

            await store.transaction.cache([
                {
                    id: this.asset.data.targetTransactionId,
                    type: trxConfig.type.send
                },
                {
                    target_id: this.asset.data.targetTransactionId,
                    type: trxConfig.type.receive
                },
                {
                    target_id: this.asset.data.targetTransactionId,
                    type: trxConfig.type.cancel
                }
            ]);
        }
    }

    validateAsset() {
        const errors = [];

        const ajv = new Ajv();
        const schemaValidate = ajv.compile(receiveSchema);
        const schemaValidateResult = schemaValidate(this.asset);
        if (!schemaValidateResult) {
            schemaValidate.errors.forEach(err => {
                errors.push(new TransactionError(err.message, this.id, `.asset${err.dataPath}`));
            });
        }

        if (!this.amount.eq(0)) {
            errors.push(new TransactionError("Amount must be zero for this transaction", this.id, ".amount", this.amount.toString(), "0"));
        }
        
        try {
            utils.validateAddress(this.recipientId);
        }
        catch (err) {
            errors.push(new TransactionError("RecipientId must be set for this transaction", this.id, ".recipientId", this.recipientId));
        }
        if (this.recipientPublicKey &&
            this.recipientId !== cryptography.getAddressFromPublicKey(this.recipientPublicKey)) {
            errors.push(new TransactionError("RecipientId does not match recipientPublicKey.", this.id, ".recipientId"));
        }
        return errors;
    }

    applyAsset(store) {
        const errors = [];

        // exist transaction ?
        const sendTxs = store.transaction.data.filter(tx => tx.type === trxConfig.type.send)
        if (sendTxs.length === 0) {
            errors.push(new TransactionError("Target Transaction Not Found.", this.id));
            return errors;
        }
        const sendTx = sendTxs[0];

        // received ?
        const receiveTxs = store.transaction.data.filter(tx => tx.type === trxConfig.type.receive)
        if (receiveTxs.length > 0) {
            errors.push(new TransactionError("Already received.", this.id));
            return errors;
        }

        // canceled ?
        const cancelTxs = store.transaction.data.filter(tx => tx.type === trxConfig.type.cancel)
        if (cancelTxs.length > 0) {
            errors.push(new TransactionError("Already canceled.", this.id));
            return errors;
        }

        // exist recipient ?
        const recipient = store.account.get(this.recipientId);
        if (!recipient) {
            errors.push(new TransactionError("Recipient Not Found.", this.id));
            return errors;
        }

        const senderAsset = sendTx.asset;
        const decipherRet = trxUtils.decipher(senderAsset.cipherText, this.asset.data.password);
        if (!decipherRet.decipherText) {
            errors.push(new TransactionError("Invalid password", this.id, ".asset.data.password"));
            return errors;
        
        } else {
            const decipherJson = JSON.parse(decipherRet.decipherText);
            if (decipherJson.senderId !== this.recipientId) {
                errors.push(new TransactionError("Invalid recipientId", this.id, ".recipientId"));
                return errors;
            }

            if (decipherJson.senderId !== sendTx.asset.data.senderId ||
                decipherJson.senderId !== sendTx.senderId ||
                decipherJson.amount !== sendTx.asset.data.amount ||
                +decipherJson.amount !== +utils.convertBeddowsToLSK(sendTx.amount.toString())) {
                errors.push(new TransactionError("Invalid Target Transaction", this.id));
                return errors;
            }
        }

        const sender = store.account.getOrDefault(this.senderId);
        const balanceError = utils.verifyAmountBalance(this.id, sender, sendTx.amount, this.fee);
        if (balanceError) {
            errors.push(balanceError);
            return errors;
        }
        const afterBalance = new BigNum(sender.balance).add(sendTx.amount);
        if (afterBalance.gt(constants.MAX_TRANSACTION_AMOUNT)) {
            errors.push(new TransactionError("Invalid amount", this.id, ".amount", sendTx.amount.toString()));
            return errors;
        }
        store.account.set(sender.address, {...sender, balance: afterBalance.toString()});
        return errors;
    }

    undoAsset(store) {
        const errors = [];
        const sender = store.account.getOrDefault(this.senderId);
        const afterBalance = new BigNum(sender.balance).sub(sendTx.amount);
        if (afterBalance < 0) afterBalance = 0;
        store.account.set(sender.address, {...sender, balance: afterBalance.toString()});
        return errors;
    }
}

module.exports = PasswordLockReceiveTransaction;