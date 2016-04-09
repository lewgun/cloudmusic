
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
//http://dengo.org/archives/1048

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
    PlayListStore,

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

export enum Mode {
    Single, //单曲
    InOrder, //顺序
    Random
}
export enum Direction {
    Next,  //向后
    Prev   //向前
}

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
    @ViewChild('bar') _bar: ElementRef;
    

    @ViewChild('src') _srcRef: ElementRef;

    public bufferedWidth: number = 0;
    public curWidth: number = 0;
    public isPlaying: boolean = true;

    private _curSongToken: StoreToken;
    private _curPlaylistToken: StoreToken;

    private curSong :any;

    //当前插放列表
    private _curPlaylist: any[];

    private _totalWidth = 0;

    private audio: HTMLAudioElement;
    private source: HTMLSourceElement;

    //private _audio: any;

    private _progressInteval: any;


    constructor(
        private _cdr: ChangeDetectorRef,

        private _playStore: PlayStore,
        private _playlistStore: PlayListStore,

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

        let sid = this._playStore.CurrentSong();
        this.curSong = this._songWithId(sid);
        if (!this.curSong) {
            return;
        }

        this._cloudMusic.SongUrl(this.curSong.song.id).
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

        this._curPlaylist = this._playlistStore.PlayListDetail();
    }

    /*This event fires when the browser has finishe loading the meta data for the video */
    public onLoadMetaData() {

    }

    public onProgressUpdated() {

    }

    public onEnded() {
        // this.audio.currentTime = 0;
        // this.audio.pause();
        this.handleNext();
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
        this._playFollowUp( {dir: Direction.Prev});
    }

    //下一首
    public handleNext() {
        this._playFollowUp();
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

    //接下来将播放的歌曲
    private _playFollowUp(
        params :{
            mode?: Mode,
            dir?: Direction
        } = {
             mode: Mode.Random,
             dir : Direction.Next}
        ) {

        let songId = this._followUpSongId(this.curSong.song.id, params.mode, params.dir);
        
        this._playAction.SaveCurrentSong(songId);
        

    }

    private _followUpSongId(sid: number, mode: Mode = Mode.Random, dir: Direction = Direction.Next): number {

        console.log(sid, mode, dir);
        
        if (mode === Mode.Single) {
            return sid;
        }
        if (mode === Mode.Random) {
            let index = Math.floor(Math.random() * this._curPlaylist.length);
            return this._curPlaylist[index].song.id;
        }

        let index: number = 0;
        for (let s of this._curPlaylist) {
            if (s.song.id === sid) {
                if (dir === Direction.Prev) {
                    index -= 1;
                } else {
                    index += 1;
                }
                break;
            }
            index++;

        }

        if (index < 0) {
            index = 0;
        }

        if (index > this._curPlaylist.length - 1) {
            this._curPlaylist.length -= 1;
        }
        
        if (this._curPlaylist[index].song.canPlay){
            return this._curPlaylist[index].song.id;
            
        }
        
        return this._followUpSongId(this._curPlaylist[index].song.id, mode, dir);

    }
    
    private _songWithId(sid: number ):any {
        
          for (let s of this._curPlaylist) {
            if (s.song.id === sid) {
              return s;
            }
        }
        return null;

    }

    private _stopTrackingProgress() {
        clearTimeout(this._progressInteval);
    }


    private _updatePlayProgress() {
        this.curWidth = this.audio.currentTime / this.audio.duration * this._totalWidth;


        let index = this.audio.buffered.length;
	    if (index > 0 && this.audio.buffered != undefined) {
                this.bufferedWidth = this.audio.buffered.end(index - 1) / this.audio.duration * this._totalWidth;
        }
        // fix: EXCEPTION: Expression has changed after it was check
        this._cdr.detectChanges();
    }

}
