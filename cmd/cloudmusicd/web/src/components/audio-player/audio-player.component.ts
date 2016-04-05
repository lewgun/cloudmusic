import {Component, OnInit, OnDestroy}  from 'angular2/core';

@Component({
    templateUrl: "user-info/user-info.component.html",
    styleUrls: ["user-info/user-info.component.css"],
    providers: [],
    pipes: [ ]

})
export class AudioPlayerComponent implements OnInit, OnDestroy {
    ngOnInit() {
    
    }
    ngOnDestroy():any {
        return null;
    }
    
}