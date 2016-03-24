import {Crypto} from '../crypto/crypto.service'

export function test() {
    let c = new Crypto();
    console.log(c.MD5("abcd"));
    console.log(c.aesRsaEncrypt("abcd"));
}