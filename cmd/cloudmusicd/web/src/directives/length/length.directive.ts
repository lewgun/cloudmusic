//http://stackoverflow.com/questions/34641281/how-to-add-class-to-host-element
//http://juristr.com/blog/2016/01/learning-ng2-dynamic-styles/
//https://coryrylan.com/blog/angular-2-text-snippet-directive

//http://victorsavkin.com/post/133936129316/angular-immutability-and-encapsulation
//http://stackoverflow.com/questions/34124735/in-angular2-how-to-get-onchanges-for-properties-changed-on-an-object-sent-in-fo/34132183
import {
    Directive,
    ElementRef,
    Renderer,
    Input,
    OnChanges,
    OnInit,
    SimpleChange
} from 'angular2/core';

/*
  Angular 2 we still have Directives but you can think of them as Components without views.
  Directives are still used whenever we need to modify the DOM directly. Directives are also
  primarily used in the form of HTML attributes to decorate Components with. 
 */
@Directive({
    selector: '[length]'
})
export class LengthDirective implements OnInit, OnChanges {

    private _axis: string = "x";

    @Input('length')
    len: number;

    @Input()
    set axis(val: string) {
        this._axis = val || this._axis;
    }


    constructor(private _el: ElementRef, private _renderer: Renderer) {
    }

    ngOnChanges(changes: { [key: string]: SimpleChange; }): any {

        /*
         this._renderer.setElementStyle(this._el, 'width', `${window.innerWidth}px`);
         this._renderer.setElementStyle(this._el, 'height', `${window.innerHeight}px`);
         */
        this.len = changes['len'].currentValue;
     
        //this._el.nativeElement.style.width = this.width + "px";
        this._renderer.setElementStyle(
            this._el.nativeElement,
            this._axis === 'x' ? 'width' : 'height',
            this.len + "px");

    }

    ngOnInit() {
    }
}