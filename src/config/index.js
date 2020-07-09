const {type, fee, crypto} = require("./transaction_config");
const send = require("../json_schema/send_asset_schema.json");
const receive = require("../json_schema/receive_asset_schema.json");
const cancel = require("../json_schema/cancel_asset_schema.json");

module.exports =
{
    type,
    fee,
    crypto,
    schema: {
        send,
        receive,
        cancel
    }
}
