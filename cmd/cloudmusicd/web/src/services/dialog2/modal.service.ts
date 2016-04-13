//http://www.syntaxsuccess.com/viewarticle/loading-components-dynamically-in-angular-2.0
//http://blog.mgechev.com/2015/09/30/lazy-loading-components-routes-services-router-angular-2/
//http://blog.jhades.org/how-to-create-an-angular-2-library-and-how-to-consume-it-jspm-vs-webpack/
//https://justindujardin.github.io/ng2-material/
import {
    Injectable,
    Injector,
    ElementRef,
    provide,
    DynamicComponentLoader,
    Type,
    ComponentRef
} from 'angular2/core';

export class ModalDialogRef {
    private _contentRef : ComponentRef;
    private _contentRef$ : Promise<ComponentRef>
    
    set contentRef( value: ComponentRef ) {
        this._contentRef = value;
    }
    close( result: any = null) {
        
    }
}

@Injectable()
export class ModalDialog {
    constructor(
        private _dcLoader :DynamicComponentLoader
    ) {}
    
  /**
   * 对于Angular 2来说，开启一个dialog其实也就是打开一个Component
   * type => 你要打开的组件类
   * elementRef => 使用该服务时那个组件的  elementRef
   * options => 一些dialog的配置 这里只有width和height
   */
    public Open( type: Type, elemRef: ElementRef, opts: ModalDialogConf = null ): Promise<ModalDialogRef> {
        let conf = isPresent(opts) ? opts: new ModalDialogConf();
        
        let dlgRef = new ModalDialogConf();
        
        let bindings = Injector.resolve([provide(ModalDialogRef, {useValue: dlgRef})]);
        
        let backdropRef$ = this._openBackdrop(elemRef, bindings);
        
        // 首先通过DynamicComponentLoader先加载一个MdDialogContainer组件，这个组件其实就是一个dialog固定的容器
        // 不了解DynamicComponentLoader的可以看这篇文章 https://github.com/kittencup/angular2-ama-cn/issues/21
        return this._dcLoader.loadNextToLocation(ModalDialogContainer, elemRef)
        .then(contentRef =>{
                // 给dialogRef设置contentRef，设置完后表明dialog是已经打开状态
                // dialogRef里会调用set contentRef方法，会给contentRefDeferred提供resolve值
                // 这个很重要，contentRefDeferred有resolve值后，close里的contentRefDeferred的then了才有用
                // 也就是说 没加载完。close方法是无效的
                dlgRef.contentRef = contentRef;
        });
        
    }
}