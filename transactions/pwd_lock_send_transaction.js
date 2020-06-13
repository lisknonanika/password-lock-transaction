const { BaseTransaction, TransactionError, utils } = require("@liskhq/lisk-transactions");
const Ajv = require("ajv");
const sendSchema = require("./json_schema/send_asset_schema");
const trxConfig = require("./config");
const trxUtils = require("./utils");

class PwdLockSendTransaction extends BaseTransaction {

    constructor(params) {
        super(params)
        if (params && params.asset && params.asset.data) {
            // set cipherText & password
            const ret = trxUtils.cipher(params.asset.data);
            params.asset.data.cipherText = ret.cipherText;
            this._password = ret.key;
        }
        const ajv = new Ajv();
        const schemaValidate = ajv.compile(sendSchema);
        const schemaValidateResult = schemaValidate(params.asset);
        if (!schemaValidateResult) {
            schemaValidate.errors.forEach(err => {
                console.log(err.message, err.dataPath);
            });
        }
    }

    static get TYPE() {
        return trxConfig.type.send;
    }

    static get FEE() {
        return `${utils.convertLSKToBeddows(trxConfig.fee.send)}`;
    }

    get password() {
        return this._password;
    }

    async prepare(store) {
        await store.account.cache([
            {
                address: this.senderId,
            }
        ]);
    }

    validateAsset() {
        const errors = [];

        // valid asset.data ?
        const ajv = new Ajv();
        const schemaValidate = ajv.compile(sendSchema);
        const schemaValidateResult = schemaValidate(this.asset);
        if (!schemaValidateResult) {
            schemaValidate.errors.forEach(err => {
                errors.push(new TransactionError(err.message, this.id, err.dataPath));
            });
        }

        if (this.asset.data) {
            // senderId = data.senderId ?
            if (this.asset.data.senderId && this.senderId !== this.asset.data.senderId) {
                errors.push(new TransactionError("should match 'senderId'", this.id, ".data.senderId"));
            }

            if (this.asset.data.amount) {
                // amount = data.amount ?
                if (+this.asset.data.amount !== +utils.convertLSKToBeddows(this.amount)) {
                    errors.push(new TransactionError("should match 'amount'", this.id, ".data.amount"));
                }
    
                // data.amount after the decimal point > 2 ?
                const vals = this.asset.data.amount.toString().split(".");
                if (vals.length > 1 && vals[1].length > 2) {
                    errors.push(new TransactionError("should be 2 or less digits after the decimal point", this.id, ".data.amount"));
                }
            }
        }
    }

    applyAsset(store) {
        const errors = [];
        return errors;
    }

    undoAsset(store) {
        const errors = [];
        return errors;
    }
}

module.exports = PwdLockSendTransaction;