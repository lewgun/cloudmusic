//https://github.com/justindujardin/ng2-material/blob/master/ng2-material%2Fcomponents%2Fdialog%2Fdialog_container.ts
import {
    ViewEncapsulation,
    Component,
    ElementRef,
    forwardRef,
    Directive,
    Host,
    SkipSelf
} from "angular2/core";

import {MdDialogRef} from './dialog-ref';

/**
 * Container for user-provided dialog content.
 */
@Component({
        selector: 'md-dialog-container',
        encapsulation: ViewEncapsulation.None,
        template: `
            <md-dialog-content></md-dialog-content>
            <div tabindex="0" (focus)="wrapFocus()" ></div>`,
        directives: [forwardRef(()=>MdDialogContent)],
        host: {
            "class": "md-dialog",
            "tabindex": "0",
            "(body:keydown)": "documentKeypress($event)",
        },
        
})
export class MdDialogContainer {
    
  // Ref to the dialog content. Used by the DynamicComponentLoader to load the dialog content.
 contentRef: ElementRef;
 
 // Ref to the open dialog. Used to close the dialog based on certain events.
 dlgRef: MdDialogRef;
 
 constructor() {
     this.contentRef = null;
     this.dlgRef = null;
 }
 
 wrapFocus() {
     
 }
 
 //  static ESCAPE = 27;
 documentKeypress(e: KeyboardEvent) {
     if (  true /*e.keyCode === KeyCodes.escape*/) {
         this.dlgRef.close();
     }
 }
}

/**
 * Simple decorator used only to communicate an ElementRef to the parent MdDialogContainer as the
 * location for where the dialog content will be loaded.
 */
@Directive({
    selector: 'md-dialog-content'
})
export class MdDialogContent {
    constructor(@Host() @SkipSelf dlgContainer: MdDialogContainer, elemRef: ElementRef) {
        dlgContainer.contentRef = elemRef;
    }
}