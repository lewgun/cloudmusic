import {
    ViewEncapsulation,
    Component,
    ElementRef,
    forwardRef,
    Directive,
    Host,
    SkipSelf
} from "angular2/core";

import {DialogRef} from "./dialog-ref";
import {KeyCodes} from "../../core/key-codes";

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

/**
 * Container for user-provided dialog content.
 */
@Component({
    selector: 'dialog-container',
    encapsulation: ViewEncapsulation.None,
    template: `
    <dialog-content></dialog-content>
    <div tabindex="0" (focus)="wrapFocus()"></div>`,
    directives: [forwardRef(() => DialogContent)],
    host: {
        'class': 'dialog',
        'tabindex': '0',
        '(body:keydown)': 'documentKeypress($event)',
    },
})
export class DialogContainer {
    // Ref to the dialog content. Used by the DynamicComponentLoader to load the dialog content.
    contentRef: ElementRef;

    // Ref to the open dialog. Used to close the dialog based on certain events.
    dialogRef: DialogRef;

    constructor() {
        this.contentRef = null;
        this.dialogRef = null;
    }

    wrapFocus() {
        // Return the focus to the host element. Blocked on #1251.
    }

    //全局上按esc,退出
    documentKeypress(event: KeyboardEvent) {
        if (event.keyCode == KeyCodes.ESACPE) {
            //退出新创建的dialog及backdrop
            this.dialogRef.close();
        }
    }
}

/**
 * Simple decorator used only to communicate an ElementRef to the parent DialogContainer as the
 * location for where the dialog content will be loaded.
 */
@Directive({
    selector: 'dialog-content'
})
export class DialogContent {
    constructor( @Host() @SkipSelf() dialogContainer: DialogContainer, elementRef: ElementRef) {
        dialogContainer.contentRef = elementRef;
    }
}