const crypto = require("crypto");
const conf = require("../config");

const getPassword = () => {
    const password = crypto.randomBytes(conf.crypto.pwdLength).toString("base64");
    return password;
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
        const password = getPassword();
        const keys = getKeys(password);
        const cipher = crypto.createCipheriv(conf.crypto.algorithm, keys.key, keys.iv);
        const cipherText = Buffer.concat([cipher.update(JSON.stringify(json)), cipher.final()]);
        return {
            "cipherText": cipherText.toString("base64"),
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
        const decipherText = Buffer.concat([decipher.update(Buffer.from(cipherText, "base64")), decipher.final()]);
    
        return {
            "decipherText": decipherText.toString("utf8")
        }
    } catch (err) {
        return {"decipherText": ""}
    }
}