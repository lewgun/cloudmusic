import {Component, OnInit, OnDestroy}  from 'angular2/core';

import {Howl } from 'howler';


@Component({
    templateUrl: "audio-player/audio-player.component.html",
    styleUrls: ["audio-player/audio-player.component.css"],
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
            urls: ['http://182.140.218.41/m10.music.126.net/20160406110346/af7a19aca2d5f521af872fd4ca2eeb35/ymusic/f795/d478/6f0b/73343b0a737658da7ce5174911044175.mp3'],
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