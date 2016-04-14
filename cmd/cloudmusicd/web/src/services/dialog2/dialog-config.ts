import { DialogRef } from "./dialog-ref";

/** Configuration for a dialog to be opened. */
export class DialogConfig {
    
    width: string = null;
    height: string = null;
    container: HTMLElement = null;
    srcEvent: Event = null;
    clickClose: boolean = true;
    context: any = {}
    
    parent( elem : HTMLElement) : DialogConfig {
        this.container = elem;
        return this;
    }
    
    clickOutsideToClose( enabled: boolean) : DialogConfig {
        this.clickClose = enabled;
        return this;
    }
    
    title(txt: string): DialogConfig {
        this.context.title = txt;
        return this;
    }
    
    textContent( txt: string): DialogConfig {
        this.context.textContent = txt;
        return this;
    }
    
    ariaLabel( txt: string) : DialogConfig {
        this.context.ariaLabel = txt;
        return this;
    }
    
    ok( txt: string): DialogConfig {
        this.context.ok = txt;
        return this;
    }
    
    cancel(txt: string): DialogConfig {
        this.context.cancel = txt;
        return this;
    }
    
    targetEvent( evt: Event): DialogConfig {
        this.srcEvent = evt;
        return this;
    }
    
}