const crypto = require("crypto");
const conf = require("../config");

const getPassword = (json) => {
    const sha512 = crypto.createHash('sha512');
    sha512.update(JSON.stringify(json.asset.data) + json.timestamp);
    const hash = sha512.digest('hex');
    return hash.slice(0, conf.crypto.pwdLength);
}

const getKeys = (password) => {
    const gen = crypto.createHash("sha256").update(password, "utf8").digest("hex");
    const iv = gen.slice(0, conf.crypto.ivLength);
    const salt = gen.slice(-conf.crypto.saltLength);
    const key = crypto.scryptSync(password, salt, conf.crypto.keyLength);
    
    return {
        "iv": iv,
        "salt": salt,
        "key": key
    }
}

module.exports.cipher = (json) => {
    try {
        const password = getPassword(json);
        const keys = getKeys(password);
        const cipher = crypto.createCipheriv(conf.crypto.algorithm, keys.key, keys.iv);
        const cipherText = Buffer.concat([cipher.update(JSON.stringify(json.asset.data)), cipher.final()]);
        return {
            "cipherText": cipherText.toString("hex"),
            "password": password
        }
    } catch (err) {
        return {"cipherText": "", "password": ""}
    }
}

module.exports.decipher = (cipherText, password) => {
    try {
        const keys = getKeys(password);
        const decipher = crypto.createDecipheriv(conf.crypto.algorithm, keys.key, keys.iv);
        const decipherText = Buffer.concat([decipher.update(Buffer.from(cipherText, "hex")), decipher.final()]);
    
        return {
            "decipherText": decipherText.toString("utf8")
        }
    } catch (err) {
        return {"decipherText": ""}
    }
}