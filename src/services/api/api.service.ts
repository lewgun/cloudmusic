//import * as crypto  from "../crypto/raw"

var  crypto  = require("../crypto/raw")

console.log(crypto.MD5("lewgun"));
console.log(crypto.aesRsaEncrypt("lewgun"));

export function md5 (plain: string): string {
    return crypto.MD5(plain);
}


export function enc (plain: string): any {
    return crypto.aesRsaEncrypt(plain);
}
