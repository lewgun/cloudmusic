import {NgIf} from "angular2/common";
import {Component, Input} from "angular2/core";
import {DialogRef} from "./dialog-ref";

@Component({
    selector: "md-dialog-basic",
    template: `
  <h2 class="md-title">{{ title }}</h2>
  <p>{{ textContent }}</p>
  <md-dialog-actions>
    <template [ngIf]="cancel != ''">
    <button  type="button" (click)="dialog.close(false)">
      <span>{{ cancel }}</span>
    </button>    
    </template>
    <template [ngIf]="ok != ''">
    <button  class="md-primary" type="button" (click)="dialog.close(true)">
      <span>{{ ok }}</span>
    </button>
    </template>
  </md-dialog-actions>`,
  directives: [NgIf]
})
export class MdDialogBasic {
    @Input()
    title: string = "";
    
    @Input()
    textContent: string = "";
    
    @Input()
    cancel: string = "";
    
    @Input()
    ok: string = "";
    
    @Input()
    type: string = "alert";
    
    constructor( public dlg: DialogRef) {}
}