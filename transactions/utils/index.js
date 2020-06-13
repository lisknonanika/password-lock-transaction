const crypto = require("crypto");
const conf = require("../config");

module.exports.cipher = (json) => {
    try {
        delete json.ciphertext;
        const data = JSON.stringify(json);
        const gen = crypto.createHash("sha256").update(data, "utf8").digest("hex");
        const iv = gen.slice(0, conf.crypto.ivLength);
        const salt = gen.slice(-conf.crypto.saltLength);
        const password = crypto.randomBytes(conf.crypto.pwdLength).toString("base64");
        const key = crypto.scryptSync(password, salt, conf.crypto.keyLength);
        const cipher = crypto.createCipheriv(conf.crypto.algorithm, key, iv);
        const cipherText = Buffer.concat([cipher.update(data), cipher.final()]);
    
        return {
            "cipherText": cipherText.toString("hex"),
            "key": key.toString("hex")
        }
    } catch (err) {
        return {"cipherText": "", "key": ""}
    }
}

module.exports.decipher = (json, cipherText, key) => {
    try {
        delete json.ciphertext;
        const data = JSON.stringify(json);
        const gen = crypto.createHash("sha256").update(data, "utf8").digest("hex");
        const iv = gen.slice(0, conf.crypto.ivLength);
        const decipher = crypto.createDecipheriv(conf.crypto.algorithm, Buffer.from(key, "hex"), iv);
        const decipherText = Buffer.concat([decipher.update(Buffer.from(cipherText, "hex")), decipher.final()]);
    
        return {
            "decipherText": decipherText.toString("utf8")
        }
    } catch (err) {
        return {"decipherText": ""}
    }
}