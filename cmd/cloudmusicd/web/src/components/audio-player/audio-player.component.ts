import {Component, OnInit, OnDestroy}  from 'angular2/core';

import * as howler from 'howler';

@Component({
    templateUrl: "user-info/user-info.component.html",
    styleUrls: ["user-info/user-info.component.css"],
    selector:"audio-player",
    directives: [],
    pipes: []

})
export class AudioPlayerComponent implements OnInit, OnDestroy {
    
     sound : Howl = null;
     constructor() {
         console.log("AudioPlayerComponent init");
     }
    ngOnInit() {

        console.log("audio player init");
        this.sound = new Howl({
            urls: ['http://m10.music.126.net/20160405224627/83937a4aa8a060fe9eedda3a1a81c7b8/ymusic/f795/d478/6f0b/73343b0a737658da7ce5174911044175.mp3'],
            autoplay: true,
            loop: true,
            volume: 0.5,
            onend: function() {
                console.log('audio player Finished!');
            }
        });

    }
    
    handlePlay() {
        this.sound.play();
    }
    ngOnDestroy(): any {
        return null;
    }

}