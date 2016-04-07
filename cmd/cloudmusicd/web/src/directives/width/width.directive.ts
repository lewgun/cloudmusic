//http://stackoverflow.com/questions/34641281/how-to-add-class-to-host-element
//http://juristr.com/blog/2016/01/learning-ng2-dynamic-styles/
import {
    Directive,
    ElementRef,
    Renderer,
    Input,
    OnChanges,
    OnInit
} from 'angular2/core';

@Directive({
    selector: '[width]'
})
export class WidthDirective  implements OnInit, OnChanges{

    @Input('width')
    _width: number;

    constructor(private _el: ElementRef, private _renderer: Renderer) {
        console.log("WidthDirective constructor");
     }

    ngOnChanges() {
        /*
        // Use window.innerWidth and window.innerHeight to retrieve the width
        // and height of the browser window.
        this._renderer.setElementStyle(this._el, 'width', `${window.innerWidth}px`);
        this._renderer.setElementStyle(this._el, 'height', `${window.innerHeight}px`); 
         */
        
        //this._renderer.setElementStyle(this._el, 'width', this._width+"px");
 console.log("WidthDirective ngOnChanges");   
 }
    
    ngOnInit() {
        console.log("WidthDirective ngOnInit");
    }
}