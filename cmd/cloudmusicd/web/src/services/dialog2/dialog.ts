import {
    provide,
    ComponentRef,
    DynamicComponentLoader,
    ElementRef,
    Injectable,
    ResolvedProvider,
    RenderComponentType,
    ViewEncapsulation,
    Injector,
    Renderer,
    RootRenderer,
    APPLICATION_COMMON_PROVIDERS
} from "angular2/core";

import {isPresent, Type} from "angular2/src/facade/lang";

import {DOM} from "angular2/src/platform/dom/dom_adapter";
import {Animate} from "../../core/util/animate";

import {Backdrop} from "../../components/backdrop/backdrop.component";

import {DialogRef} from "./dialog-ref";
import {DialogConfig} from "./dialog-config";
import {DialogContainer} from "./dialog-container";


export * from './dialog-config';
export * from './dialog-container';
export * from './dialog-ref';
export * from './dialog-basic';

// TODO(jelbourn): Wrap focus from end of dialog back to the start. Blocked on #1251
// TODO(jelbourn): Focus the dialog element when it is opened.
// TODO(jelbourn): Pre-built `alert` and `confirm` dialogs.
// TODO(jelbourn): Animate dialog out of / into opening element.

/**
 * Service for opening modal dialogs.
 */
@Injectable()
export class Dialog {

    /**
     * Unique id counter for RenderComponentType.
     * @private
     */
    static _uniqueId: number = 0;

    /**
     * Renderer for manipulating dialog and backdrop component elements.
     * @private
     */
    private _renderer: Renderer = null;

    constructor(
        public componentLoader: DynamicComponentLoader,
        rootRenderer: RootRenderer) {

        let type = new RenderComponentType(`__md-dialog-${Dialog._uniqueId++}`, ViewEncapsulation.None, []);
        this._renderer = rootRenderer.renderComponent(type);
    }

    private _defaultContainer = DOM.query('body');

    /**
     * Opens a modal dialog.
     * @param type The component to open.
     * @param elementRef The logical location into which the component will be opened.
     * @param options
     * @returns Promise for a reference to the dialog.
     */
    open(
        type: Type,
        elementRef: ElementRef,
        options: DialogConfig = new DialogConfig()): Promise<DialogRef> {

        // Create the dialogRef here so that it can be injected into the content component.
        let dialogRef = new DialogRef();

        let bindings = Injector.resolve([APPLICATION_COMMON_PROVIDERS, provide(DialogRef, { useValue: dialogRef })]);

        //获得backdrop的 promise
        let backdropRefPromise = this._openBackdrop(elementRef, bindings, options);

        // First, load the DialogContainer, into which the given component will be loaded.

        /*
        <backdrop></backdrop>
        <dialog-container>
            <dialog-content></dialog-content>
            <dialog-basic>
                <dialog-actions>
                    <button>Got it</button>
                </dialog-actions>
            </dialog-basic>
        </dialog-container>
        
         */

        return this.componentLoader.loadNextToLocation(DialogContainer, elementRef, bindings)
            .then((containerRef: ComponentRef) => {
                var containerElement = containerRef.location.nativeElement;

                this._renderer.setElementClass(containerElement, 'dialog-absolute', !!options.container);

                DOM.appendChild(options.container || this._defaultContainer, containerElement);

                if (isPresent(options.width)) {
                    this._renderer.setElementStyle(containerElement, 'width', options.width);
                }
                if (isPresent(options.height)) {
                    this._renderer.setElementStyle(containerElement, 'height', options.height);
                }

                dialogRef.containerRef = containerRef;

                // Now load the given component into the DialogContainer.
                //containerRef.instance.contentRef ???
                return this.componentLoader.loadNextToLocation(type, containerRef.instance.contentRef, bindings)
                    .then((contentRef: ComponentRef) => {
                        
                        //注入属性
                        Object.keys(options.context).forEach((key) => {
                            contentRef.instance[key] = options.context[key];
                        });

                        // Wrap both component refs for the container and the content so that we can return
                        // the `instance` of the content but the dispose method of the container back to the
                        // opener.
                        dialogRef.contentRef = contentRef;
                        containerRef.instance.dialogRef = dialogRef;
                        
                        //背景加载成功后,为dilaogRef注入隐藏完成后的回调方法
                        backdropRefPromise.then((backdropRef: ComponentRef) => {
                            dialogRef.backdropRef = backdropRef;
                            dialogRef.whenClosed.then((_) => {
                                backdropRef.instance.hide().then(() => {
                                    containerRef.dispose();
                                    contentRef.dispose();
                                    backdropRef.dispose();
                                });
                            });
                        });

                        return Animate.enter(containerElement, 'active').then(() => dialogRef);
                    });
            });
    }

    /** Loads the dialog backdrop (transparent overlay over the rest of the page). */
    _openBackdrop(elementRef: ElementRef, bindings: ResolvedProvider[], options: DialogConfig): Promise<ComponentRef> {
        return this.componentLoader.loadNextToLocation(Backdrop, elementRef, bindings)
            .then((componentRef: ComponentRef) => {
                let backdrop: Backdrop = componentRef.instance;
                backdrop.clickClose = options.clickClose;
                this._renderer.setElementClass(componentRef.location.nativeElement, 'backdrop', true);
                this._renderer.setElementClass(componentRef.location.nativeElement, 'opaque', true);
                this._renderer.setElementClass(componentRef.location.nativeElement, 'backdrop-absolute', !!options.container);

                //默认添加到body上
                DOM.appendChild(options.container || this._defaultContainer, componentRef.location.nativeElement);
                return backdrop.show().then(() => componentRef);
            });
    }

    alert(message: string, okMessage: string): Promise<any> {

        let config = new DialogConfig()
            .parent(DOM.query('#popupContainer'))
            .textContent(message)
            .title('Error')
            .ok('Got it!')
        // .targetEvent(ev);
        //this.dialog.open(DialogBasic, this.element, config);

        throw 'Not implemented';
    }

    confirm(message: string, okMessage: string, cancelMessage: string): Promise<any> {
        throw 'Not implemented';
    }
}