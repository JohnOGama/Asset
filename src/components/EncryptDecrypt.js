
import cryptoAES from 'crypto-js/aes';
import lzwCompress from 'lzwcompress';
import encUtf8 from 'crypto-js/enc-utf8';

const s3cR3T = 'NgjwqA';


export function encryptData(data, key, compress = true) {
    const value = compress ? lzwCompress.pack(data) : data;
    return cryptoAES.encrypt(JSON.stringify(data), key || s3cR3T).toString();
  }

  export function decryptData(data, key, compress = true) {
    try {
      const bytes = cryptoAES.decrypt(data, key || s3cR3T);
      const value = JSON.parse(bytes.toString(encUtf8));
      return compress ? lzwCompress.unpack(value) : value;
    } catch (e) {
      return data;
    }
  }

