const crypto = require("crypto");
const CryptoJS = require("crypto-js");
const conf = require("../config");

const getPassword = () => {
    const pwdStrs = conf.crypto.usePasswordStrings;
    const unit8ary = crypto.randomFillSync(new Uint8Array(conf.crypto.pwdLength));
    return Array.from(unit8ary).map(n => pwdStrs[n % pwdStrs.length]).join('');
}

const getKeys = (password) => {
    const gen = CryptoJS.enc.Hex.stringify(CryptoJS.SHA256(password));
    const iv = CryptoJS.enc.Utf8.parse(gen.slice(0, 32));
    const key = CryptoJS.enc.Utf8.parse(gen.slice(-32));
    return {
        "iv": iv,
        "key": key
    }
}

module.exports.cipher = (json) => {
    try {
        const password = getPassword();
        const keys = getKeys(password);
        const val = CryptoJS.enc.Utf8.parse(JSON.stringify(json));
        const encrypted = CryptoJS.AES.encrypt(val, keys.key, {
            iv: keys.iv,
            mode: CryptoJS.mode.CBC, 
            adding: CryptoJS.pad.Pkcs7
        });
        return {
            "cipherText": encrypted.ciphertext.toString(),
            "password": password
        }
    } catch (err) {
        console.log(err);
        return {"cipherText": "", "password": ""}
    }
}

module.exports.decipher = (cipherText, password) => {
    try {
        const keys = getKeys(password);
        const val = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(cipherText));
        const decrypt = CryptoJS.AES.decrypt(val, keys.key, {
            iv: keys.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return {
            "decipherText": decrypt.toString(CryptoJS.enc.Utf8)
        }
    } catch (err) {
        return {"decipherText": ""}
    }
}
