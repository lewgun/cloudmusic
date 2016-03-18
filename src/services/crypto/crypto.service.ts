
import * as bigInt from 'big-integer'

import * as CryptoJS from 'crypto-js'

export module Crypto {
    
    export function MD5( plain: string): string {
        
       let biText = bigInt("12345", 16);
       let ret = biText.toString();
       console.log(ret);
  
       console.log(CryptoJS.MD5(plain).toString()); 
  
       return ret;
    }
}