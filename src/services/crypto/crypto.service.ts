
import * as bigInt from 'big-integer'
import * as CryptoJS from 'crypto-js'

export module Crypto {
    const  modulus = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7';
    const  nonce = '0CoJUm6Qyw8W8jud';
    const  pubKey = '010001';


	function addPadding(cipherText : string, modulus :string): string {
		let len = modulus.length;
		
		for ( let i: number = 0; len > 0 && modulus[i] == '0'; i++ ) {
			len--;
		}
		
		let num: number = len - cipherText.length;
		
		let prefix: string = '';
		
		for ( let i : number; i < num; i++ ) {
			prefix += '0';
		}
		return prefix;
	
	}
    
    function	createSecretKey( size: number): string {
	    let keys = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    	let key = "";
    	for (let i = 0; i < size; i++) {
        	let pos = Math.random() * keys.length;
        	pos = Math.floor(pos);
        	key = key + keys.charAt(pos)
    	}
    	return key;
	}
    
    function aesEncrypt( plain: string, key: string): string {
		// let cipher = crypto.createCipheriv('AES-128-CBC', key, '0102030405060708');
		// return cipher.update(plain, 'utf-8', 'base64') + cipher.final('base64');
        
//         // Encrypt
// var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123');
// var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
// var plaintext = bytes.toString(CryptoJS.enc.Utf8);

        CryptoJS.AES()


		return "hello module";
	}
	
	function rsaEncrypt( plain: string, exp: string, mod: string): string {
		
		// let rPlain: string = '';
		// const radix: number = 16;
		
		// for ( let i: number = plain.length -1; i >= 0; i-- ) {
		// 	rPlain += plain[i];
		// }
		
		// let biPlain = bigInt( new Buffer(rPlain).toString('hex'), radix);
		// let biExp = bigInt(exp, radix);
		// let biMod = bigInt(mod, radix);
		
		// let biRet = biPlain.modPow(biExp, biMod);
		
		//return addPadding(biRet.toString(radix), mod);
        return "";

	}
	



    export function	aesRsaEncrypt( plain: string): any {
            let key = createSecretKey(16);
            return {
                    params: aesEncrypt( aesEncrypt(plain, nonce), key),
                    encSecKey: rsaEncrypt(key, pubKey, modulus)
            }

    }
        
    export function MD5( plain: string): string {
           return CryptoJS.MD5(plain); 
    }
}
