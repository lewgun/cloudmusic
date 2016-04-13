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