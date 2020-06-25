const { BaseTransaction, TransactionError, utils } = require("@liskhq/lisk-transactions");
const Ajv = require("ajv");
const cancelSchema = require("../json_schema/cancel_asset_schema");
const trxConfig = require("../config");

class PasswordLockCancelTransaction extends BaseTransaction {

    static get TYPE() {
        return trxConfig.type.cancel;
    }

    static get FEE() {
        return `${utils.convertLSKToBeddows(trxConfig.fee.cancel)}`;
    }

    async prepare(store) {
        await store.account.cache([
            {
                address: this.senderId,
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
        const schemaValidate = ajv.compile(cancelSchema);
        const schemaValidateResult = schemaValidate(this.asset);
        if (!schemaValidateResult) {
            schemaValidate.errors.forEach(err => {
                errors.push(new TransactionError(err.message, this.id, `.asset${err.dataPath}`));
            });
        }

        if (this.asset.recipientId) {
            errors.push(new TransactionError("Invalid parameter", this.id, ".asset.recipientId"));
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
        
        // match sender ?
        if (sendTx.senderId !== this.senderId) {
            errors.push(new TransactionError("Target Transaction is not yours.", this.id));
            return errors;
        }

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
        return errors;
    }

    undoAsset(store) {
        const errors = [];
        return errors;
    }
}

module.exports = PasswordLockCancelTransaction;