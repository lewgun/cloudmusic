
import {UrlResolver} from 'angular2/compiler';
import {BaseUrlPath} from '../../types/types'

//https://github.com/kittencup/angular2-ama-cn/issues/18
//http://www.cnblogs.com/GarsonZhang/p/5179601.html
export class MyUrlResolver extends UrlResolver {

    constructor() {
        super();
        if (typeof String.prototype.endsWith != 'function') {
            String.prototype.endsWith = function(suffix) {
                return this.indexOf(suffix, this.length - suffix.length) !== -1;
            };
        }
    }
    resolve(baseUrl: string, url: string): string {
        
        if (!BaseUrlPath.endsWith("/")) {
            return super.resolve(BaseUrlPath + "/", url);
        }
        return super.resolve(BaseUrlPath, url);
        
        // return super.resolve(BaseUrlPath + "/", url);
    }
}