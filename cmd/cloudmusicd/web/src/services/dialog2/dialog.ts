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
import { isPresent, Type} from "angular2/src/facade/lang";
import {MdDialogRef} from "./dialog-ref";
import {MdDialogConfig} from "./dialog-config";
import {MdDialogContainer} from "./dialog-container";
//import {MdBackdrop} from "../backdrop/backdrop";
import {DOM} from "angular2/src/platform/dom/dom_adapter";
//import {Animate} from "../../core/util/animate";

export * from "./dialog-config";
export * from "./dialog-container";
export * from "./dialog-ref";
export * from "./dialog-basic";

/**
 * Service for opening modal dialogs.
 */
@Injectable()
export class MdDialog {
    /**
     * Unique id counter for RenderComponentType.
     */
    static _uniqueId: number = 0;

    /**
     * Renderer for manipulating dialog and backdrop component elements.
     */
    private _renderer: Renderer = null;

    constructor(public dcLoader: DynamicComponentLoader, rootRenderer: RootRenderer) {
        let type = new RenderComponentType(`__md-dialog-${MdDialog._uniqueId++}`, ViewEncapsulation.None, []);
        this._renderer = rootRenderer.renderComponent(type);
    }

    private _defContainer = DOM.query('body');

    /**
 * Opens a modal dialog.
 * @param type The component to open.
 * @param elementRef The logical location into which the component will be opened.
 * @param options
 * @returns Promise for a reference to the dialog.
 */

    open(type: Type, elemRef: ElementRef, opts: MdDialogConfig = new MdDialogConfig()): Promise<MdDialogRef> {

        // Create the dialogRef here so that it can be injected into the content component.
        let dlgRef = new MdDialogRef();

        let bindings = Injector.resolve([APPLICATION_COMMON_PROVIDERS, provide(MdDialogRef, { useVaule: dlgRef })]);

        let backdropRef$ = this._openBackdrop(elemRef, bindings, opts);

        // First, load the MdDialogContainer, into which the given component will be loaded.
        return this.dcLoader.loadNextToLocation(MdDialogContainer, elemRef, bindings)
            .then((containerRef: ComponentRef) => {
                let dlgElem = containerRef.location.nativeElement;

                this._renderer.setElementClass(dlgElem, 'md-dialog-absolute', !!opts.container);
                DOM.appendChild(opts.container || this._defContainer, dlgElem);

                if (isPresent(opts.width)) {
                    this._renderer.setElementStyle(dlgElem, "width", opts.width);

                }

                if (isPresent(opts.height)) {
                    this._renderer.setElementStyle(dlgElem, "height", opts.height);
                }
                dlgRef.containerRef = containerRef;

                //Now load the given component into the MdDialogContainer.
                return this.dcLoader.loadNextToLocation(type, containerRef.instance.contentRef, bindings)
                    .then((contentRef: ComponentRef) => {
                        Object.keys(opts.context).forEach((key) => {
                            contentRef.instance[key] = opts.context[key];  //copy
                        });

                        //wrap both component refs for the container and the content so that we can return 
                        // the `instance` of the content but the dispose method of the container back to the
                        // opener.
                        dlgRef.contentRef = contentRef;

                        backdropRef$.then((backdropRef: ComponentRef) => {
                            dlgRef.backdropRef = backdropRef;
                            dlgRef.whenClosed.then((_) => {
                                backdropRef.instance.hide().then(() => {
                                    containerRef.dispose();
                                    contentRef.dispose();
                                    backdropRef.dispose();
                                });
                            });
                        });
                        //   return Animate.enter(dialogElement, 'md-active').then(() => dialogRef);
                        return dlgRef;
                    });
            });
    }


    /** Loads the dialog backdrop (transparent overlay over the rest of the page). */
    _openBackdrop(elemRef: ElementRef, bindings: ResolvedProvider[], opts: MdDialogConfig): Promise<ComponentRef> {
        return this.dcLoader.loadNextToLocation(MdBackdrop, elemRef, bindings)
            .then((compRef: ComponentRef) => {
                let backdrop: MdBackdrop = compRef.instance;
                backdrop.clickClose = opts.clickClose;
                this._renderer.setElementClass(compRef.location.nativeElement, 'md-backdrop', true);
                this._renderer.setElementClass(componentRef.location.nativeElement, 'md-opaque', true);
                this._renderer.setElementClass(componentRef.location.nativeElement, 'md-backdrop-absolute', !!options.container);

                 DOM.appendChild( opts.container || this._defContainer, compRef.location.nativeElement);
                 return backdrop.show.then(()=>compRef);
            }); //end of then
    }







  alert(message: string, okMessage: string): Promise<any> {
    throw 'Not implemented';
  }

  confirm(message: string, okMessage: string, cancelMessage: string): Promise<any> {
    throw 'Not implemented';
  }




















































}