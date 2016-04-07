
//http://stackoverflow.com/questions/34326745/whats-the-difference-between-viewchild-and-contentchild
//http://stackoverflow.com/questions/32693061/angular-2-typescript-get-hold-of-an-element-in-the-template
//http://blog.appweplay.com/2016/02/angular2-modifying-dom-template-data.html

//http://www.html5rocks.com/en/tutorials/getusermedia/intro/
//http://code.tutsplus.com/tutorials/build-a-custom-html5-video-player--pre-8905
//http://www.creativebloq.com/html5/build-custom-html5-video-player-9134473
//https://msdn.microsoft.com/zh-cn/library/hh924823(v=vs.85).aspx
//http://www.inserthtml.com/2013/03/custom-html5-video-player/

import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    AfterContentInit,
    ElementRef
}  from 'angular2/core';


@Component({
    templateUrl: "audio-player/audio-player.component.html",
    styleUrls: ["audio-player/audio-player.component.css"],
    selector: "audio-player",
    directives: [],
    pipes: []

})
export class AudioPlayerComponent implements OnInit, OnDestroy {

    @ViewChild('realAudio') _elemRef: ElementRef;
    @ViewChild('readyBar')  _readyBar: HTMLDivElement;
    @ViewChild('currentBar') _curBar: HTMLDivElement;
    @ViewChild('indexBar') _indexBar: HTMLDivElement;

    private _audio: HTMLAudioElement;

    //private _audio: any;

    constructor() {
        console.log("AudioPlayerComponent init");
    }
    ngOnInit() {

        // old style
        //this._audio = document.getElementById("audio");
        //this._audio.controls = false;
        //this._audio.removeAttribute("controls");
    }

    ngAfterViewInit() {
        this._audio = this._elemRef.nativeElement;
        this._audio.removeAttribute('controls');

    }


    ngOnDestroy(): any {
        return null;
    }

    /*This event fires when the browser has finishe loading the meta data for the video */
    onLoadMetaData() {

    }

    onEnded() {
        this._audio.currentTime = 0;
        this._audio.pause();
    }

    onPlay() {
        //todo update css

        this._trackingProgress();
    }

    onPause() {
        //todo update css
        
        this._stopTrackingProgress();
    }

    //上一首
    handlePrev() {

    }

    //下一首
    handleNext() {

    }

    //播放/暂停
    handlePnP() {
        if (this._audio.paused || this._audio.ended) {
            if (this._audio.ended) {
                this._audio.currentTime = 0;
            }
            this._audio.play();
            return;
        }

        this._audio.pause();
    }

    private _trackingProgress() {
        /*
                     (function progressTrack() { 
              videoPlayer._updatePlayProgress(); 
              playProgressInterval = setTimeout(progressTrack, 50); 
          })(); 
          
         */
    }
    
    
    private _stopTrackingProgress() {
       // clearTimeout( playProgressInterval ); 
    }
    
    
    private _updatePlayProgress (){ 
		//playProgressBar.style.width = ( (video.currentTime / video.duration) * (progressHolder.offsetWidth) ) + "px"; 
	}

}
