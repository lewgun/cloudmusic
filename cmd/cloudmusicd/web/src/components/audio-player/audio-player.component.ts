
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
    AfterViewInit,
    ElementRef
}  from 'angular2/core';


import {WidthDirective} from '../../directives/width/width.directive'

export interface Source {
    Url: string;
    Type: string;
}


@Component({
    templateUrl: "audio-player/audio-player.component.html",
    styleUrls: ["audio-player/audio-player.component.css"],
    selector: "audio-player",
    directives: [WidthDirective],
    pipes: []

})
export class AudioPlayerComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('audio') _audioRef: ElementRef;
    @ViewChild('indexBar') _indexBar: HTMLDivElement;
    @ViewChild('bar') _bar: ElementRef;

    public readyWidth: number = 5;
    public curWidth: number = 50;
    public isPlaying: boolean = true;
    
    public curAudio: Source[]
    
    public sources = [{
        Url: "http://m10.music.126.net/20160408144744/6fbbcf325630ac98c2f7f8465ae8ce7b/ymusic/22ea/c1d3/18a9/4d94874b5ca9edf618857961ebd5f601.mp3",
        Type: "audio/mpeg"
    }]

    private _totalWidth = 0;

    private _audio: HTMLAudioElement;
    //private _audio: any;

    private _progressInteval: any;

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
        this._audio = this._audioRef.nativeElement;
        this._audio.removeAttribute('controls');
        this._totalWidth = this._bar.nativeElement.offsetWidth;
    }


    ngOnDestroy(): any {
        return null;
    }

    /*This event fires when the browser has finishe loading the meta data for the video */
    public onLoadMetaData() {

    }

    public onProgressUpdated() {

    }

    public onEnded() {
        this._audio.currentTime = 0;
        this._audio.pause();
    }

    public onPlay() {
        this.isPlaying = true;
        this._trackingProgress();
    }

    public onPause() {
        this.isPlaying = false;
        this._stopTrackingProgress();
    }

    //上一首
    public handlePrev() {

    }

    //下一首
    public handleNext() {

    }

    //播放/暂停
    public handlePnP() {
        console.log("handlePnP");
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
        let f = () => {
            this._updatePlayProgress();
            this._progressInteval = setTimeout(f, 50);
        }
        f();

    }


    private _stopTrackingProgress() {
        clearTimeout(this._progressInteval);
    }


    private _updatePlayProgress() {
        this.curWidth = this._audio.currentTime / this._audio.duration * this._totalWidth;
    }

}
