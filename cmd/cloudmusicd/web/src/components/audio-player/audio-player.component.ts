
//http://stackoverflow.com/questions/34326745/whats-the-difference-between-viewchild-and-contentchild
//http://stackoverflow.com/questions/32693061/angular-2-typescript-get-hold-of-an-element-in-the-template
//http://blog.appweplay.com/2016/02/angular2-modifying-dom-template-data.html

//http://www.html5rocks.com/en/tutorials/getusermedia/intro/
//http://code.tutsplus.com/tutorials/build-a-custom-html5-video-player--pre-8905
//http://www.creativebloq.com/html5/build-custom-html5-video-player-9134473
//https://msdn.microsoft.com/zh-cn/library/hh924823(v=vs.85).aspx
//http://www.inserthtml.com/2013/03/custom-html5-video-player/

//http://stackoverflow.com/questions/34364880/expression-has-changed-after-it-was-checked
//http://stackoverflow.com/questions/33472297/how-to-translate-html-string-to-real-html-element-by-ng-for-in-angular-2

import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    AfterViewInit,
    ElementRef,
    ChangeDetectorRef
}  from 'angular2/core';

import {
    StoreToken,

    //stores
    PlayStore,

    //acitons
    PlayActionCreator,

    //events
    CurrentPlaylist_Read,
    CurrentSong_Read,

} from '../../services/flux/flux';

import { DialogService} from '../../services/dialog/dialog.service';

import { CloudMusicService} from '../../services/cloud-music/cloud-music.service';


import { EventType }from '../../types/types';

import { DurationFormatPipe} from '../../pipes/duration-format/duration-format.pipe';

import {WidthDirective} from '../../directives/width/width.directive'

@Component({
    templateUrl: "audio-player/audio-player.component.html",
    styleUrls: ["audio-player/audio-player.component.css"],
    selector: "audio-player",
    directives: [WidthDirective],
    pipes: [DurationFormatPipe],
    providers: [CloudMusicService]

})
export class AudioPlayerComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('audio') _audioRef: ElementRef;
    @ViewChild('indexBar') _indexBar: HTMLDivElement;
    @ViewChild('bar') _bar: ElementRef;

    @ViewChild('src') _srcRef: ElementRef;

    public readyWidth: number = 0;
    public curWidth: number = 0;
    public isPlaying: boolean = true;

    private _curSongToken: StoreToken;
    private _curPlaylistToken: StoreToken;

    private _curSongId = -1;
    private _curPlaylistId = -1;

    private _totalWidth = 0;

    private audio: HTMLAudioElement;
    private source: HTMLSourceElement;

    //private _audio: any;

    private _progressInteval: any;

    constructor(
        private _cdr: ChangeDetectorRef,

        private _playStore: PlayStore,
        private _playAction: PlayActionCreator,
        private _cloudMusic: CloudMusicService,
        private _dlg: DialogService
    ) {
        console.log("AudioPlayerComponent init");
    }
    ngOnInit() {

        // old style
        //this._audio = document.getElementById("audio");
        this._curSongToken = this._playStore.Bind((evt: EventType) => this.onCurSong(evt));
        this._curPlaylistToken = this._playStore.Bind((evt: EventType) => this.onCurPlaylist(evt));
 

    }

    ngAfterViewInit() {
        this.audio = this._audioRef.nativeElement;

        this.source = this._srcRef.nativeElement;

        // this._audio.removeAttribute('controls');
        this._totalWidth = this._bar.nativeElement.offsetWidth;
    }


    ngOnDestroy(): any {
        this._playStore.Unbind(this._curSongToken);
        this._playStore.Unbind(this._curPlaylistToken);

        return null;
    }

    public onCurSong(evt: EventType) {

        if (evt != CurrentSong_Read) {
            return;
        }

        this._curSongId = this._playStore.CurrentSong();

        this._cloudMusic.SongUrl(this._curSongId).
            then(retVal => {

                if (retVal.code !== 200) {
                    this._dlg.alert(retVal.code);
                    return;
                }

                this.source.src = retVal.data[0].url;

                this.audio.load();
                this.audio.play();


            },
            rejectVal => {
                console.log(rejectVal);
            });

    }

    public onCurPlaylist(evt: EventType) {
        if (evt != CurrentPlaylist_Read) {
            return;
        }

        this._curPlaylistId = this._playStore.CurrentPlaylist();
    }

    /*This event fires when the browser has finishe loading the meta data for the video */
    public onLoadMetaData() {

    }

    public onProgressUpdated() {

    }

    public onEnded() {
        this.audio.currentTime = 0;
        this.audio.pause();
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
        if (this.audio.paused || this.audio.ended) {
            if (this.audio.ended) {
                this.audio.currentTime = 0;
            }
            this.audio.play();
            return;
        }

        this.audio.pause();
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
        this.curWidth = this.audio.currentTime / this.audio.duration * this._totalWidth;
 
        // fix: EXCEPTION: Expression has changed after it was check
        this._cdr.detectChanges();
    }

}
