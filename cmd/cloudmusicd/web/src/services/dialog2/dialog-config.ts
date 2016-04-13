import { MdDialogRef } from "./dialog-ref";

/** Configuration for a dialog to be opened. */
export class MdDialogConfig {
    
    width: string = null;
    height: string = null;
    container: HTMLElement = null;
    srcEvent: Event = null;
    clickClose: boolean = true;
    context: any = {}
    
    parent( elem : HTMLElement) : MdDialogConfig {
        this.container = elem;
        return this;
    }
    
    clickOutsideToClose( enabled: boolean) : MdDialogConfig {
        this.clickClose = enabled;
        return this;
    }
    
    title(txt: string): MdDialogConfig {
        this.context.title = txt;
        return this;
    }
    
    textContent( txt: string): MdDialogConfig {
        this.context.textContent = txt;
        return this;
    }
    
    ariaLabel( txt: string) : MdDialogConfig {
        this.context.ariaLabel = txt;
        return this;
    }
    
    ok( txt: string): MdDialogConfig {
        this.context.ok = txt;
        return this;
    }
    
    cancel(txt: string): MdDialogConfig {
        this.context.cancel = txt;
        return this;
    }
    
    targetEvent( evt: Event): MdDialogConfig {
        this.srcEvent = ev;
        return this;
    }
    
}