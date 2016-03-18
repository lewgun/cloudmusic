
import {UrlResolver} from 'angular2/compiler';

//https://github.com/kittencup/angular2-ama-cn/issues/18
//http://www.cnblogs.com/GarsonZhang/p/5179601.html
export class MyUrlResolver extends UrlResolver {
	
	resolve( baseUrl: string, url: string ): string {	
		return super.resolve("src/components/", url);
	}
}