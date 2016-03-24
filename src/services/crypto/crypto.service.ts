
//npm install uglify-js -g
//npm install watchify
//npm install browserify
//npm install crypto-browserify
//https://github.com/Microsoft/TypeScriptSamples/blob/master/browserify%2FREADME.md
//https://segmentfault.com/a/1190000002484973 watchify和browserify
//https://dzone.com/articles/completing-the-angular-2-quick-start-in-vs-code-1

// "browserify src/boot.js -o src/app.js -s app", must have "-s"!!!!!!!!!!

import {createHash, createCipheriv} from 'crypto'
import * as bigInt from 'big-integer';


let modulus = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7';
let nonce = '0CoJUm6Qyw8W8jud';
let pubKey = '010001';


function addPadding(encText, modulus) {
    let ml = modulus.length;
    for (let i = 0; ml > 0 && modulus[i] == '0'; i++)ml--;
    let num = ml - encText.length, prefix = '';
    for (let i = 0; i < num; i++) {
        prefix += '0';
    }
    return prefix + encText;
}

function aesEncrypt(text, secKey) {

    let cipher = createCipheriv('AES-128-CBC', secKey, '0102030405060708');
    return cipher.update(text, 'utf-8', 'base64') + cipher.final('base64');
}


/**
 * RSA Encryption algorithm.
 * @param text {string} - raw data to encrypt
 * @param exponent {string} - public exponent
 * @param modulus {string} - modulus
 * @returns {string} - encrypted data: reverseText^pubKey%modulus
 */
function rsaEncrypt(text, exponent, modulus) {
    let rText = '', radix = 16;
    for (let i = text.length - 1; i >= 0; i--) rText += text[i];//reverse text
    let biText = bigInt(new Buffer(rText).toString('hex'), radix),
        biEx = bigInt(exponent, radix),
        biMod = bigInt(modulus, radix),
        biRet = biText.modPow(biEx, biMod);
    return addPadding(biRet.toString(radix), modulus);
}

function createSecretKey(size) {
    let keys = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let key = "";
    for (let i = 0; i < size; i++) {
        let pos = Math.random() * keys.length;
        pos = Math.floor(pos);
        key = key + keys.charAt(pos)
    }
    return key;
}


// byte array
function pack(bytes: any): string {
    let chars = [];
    for(let i = 0, n = bytes.length; i < n;) {
        chars.push(((bytes[i++] & 0xff) << 8) | (bytes[i++] & 0xff));
    }
    return String.fromCharCode.apply(null, chars);
}

function unpack(str: string): any {
    let bytes = [];
    for(let i = 0, n = str.length; i < n; i++) {
        let char = str.charCodeAt(i);
        bytes.push(char >>> 8, char & 0xFF);
    }
    return bytes;
}



//RequestParams
export interface RequestParams {
    params: string;
    encSecKey: string;
}

export class Crypto {

    MD5(plain: string, encoding: string = "hex"): string {
        let h = createHash("md5");
        h.update(plain);
        return h.digest(encoding);

    }

    aesRsaEncrypt(plain: string): RequestParams {
        let secKey = createSecretKey(16);
        return {
            params: aesEncrypt(aesEncrypt(plain, nonce), secKey),
            encSecKey: rsaEncrypt(secKey, pubKey, modulus)
        }
    }
    
    encryptID(id): string {
        let bMagic = unpack('3go8&$8*3*3h0k(2)2');
        let bID = unpack(id);
        
        let magicLen = bMagic.length;
        let idLen = bID.length;
        
        for ( let i = 0; i < idLen; i++ ) {
            bID[i] ^= bMagic[i % magicLen];
        }
        
        /*
          var res = this.MD5(pack(bID), "base64");
          res = res.replace('/', '_');
          res = res.replace('+', '-');
          return res;
        */
        return this.MD5(pack(bID), "base64").replace('/', '_').replace('+', '-');
    }
    

}