const CryptoJS = require('crypto-js');
const cryptojs_secret = 'admin123';

class Encrypter {
  encrypted(val) {
    val = JSON.stringify(val);
    return CryptoJS.AES.encrypt(val, cryptojs_secret).toString();
  }

  dencrypted(ciphertext) {
    try {
      let bytes = CryptoJS.AES.decrypt(ciphertext, cryptojs_secret);
      let originalText = bytes.toString(CryptoJS.enc.Utf8);
      if (originalText) {
        return JSON.parse(originalText);
      }
      return new Object();
    } catch (err) {
      return err;
    }
  }
}
module.exports = new Encrypter();
