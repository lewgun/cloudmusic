
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
//http://stackoverflow.com/questions/34641281/how-to-add-class-to-host-element/34643330#34643330

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
    Random,  //随机
    ModeCount
}
export enum Direction {
    Next,  //向后
    Prev   //向前
}


const scrubbingClass = " scrubbing";
    
@Component({
    templateUrl: "audio-player/audio-player.component.html",
    styleUrls: ["audio-player/audio-player.component.css"],
    selector: "audio-player",
    directives: [WidthDirective],
    pipes: [DurationFormatPipe],
    providers: [CloudMusicService],

})
export class AudioPlayerComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('audio') _audioRef: ElementRef;
    @ViewChild('bar') _barRef: ElementRef;
    @ViewChild('index') _indexRef: ElementRef;   
    @ViewChild('src') _srcRef: ElementRef;

    public bufferedWidth: number = 0;
    public curWidth: number = 0;
    public isPlaying: boolean = true;
    public curSong :any;
    public curPlayMode : Mode = Mode.Random;

    private _curSongToken: StoreToken;
    private _curPlaylistToken: StoreToken;
    



    //当前插放列表
    private _curPlaylist: any[];

    private _totalWidth = 0;

    private audio: HTMLAudioElement;
    private source: HTMLSourceElement;
    
    private index: HTMLDivElement;

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
        
        this.index = this._indexRef.nativeElement;

        // this._audio.removeAttribute('controls');
        this._totalWidth = this._barRef.nativeElement.offsetWidth;
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
        this.handleNext(null);
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
    public handlePrev($event) {
        this._playFollowUp( {mode: this.curPlayMode, dir: Direction.Prev});
    }

    //下一首
    public handleNext($event) {
        this._playFollowUp({mode: this.curPlayMode});
    }
    
    //切换播放模式
    public handlePlayMode() {
        this.curPlayMode += 1;
        this.curPlayMode %= Mode.ModeCount;
        
        
    }

    //播放/暂停
    public handlePnP($event) {
        if (this.audio.paused || this.audio.ended) {
            if (this.audio.ended) {
                this.audio.currentTime = 0;
            }
            this.audio.play();
            return;
        }

        this.audio.pause();
    }
    
    
    public handleScrubbingClick($event) {
        this._handleScrubbingBeginHelper($event);  
        this.handleScrubbingEnd($event); 
    }
    
        //准备拖动
    private _handleScrubbingBeginHelper($event) {
        this._stopTrackingProgress();
        this.audio.pause(); 
    }
    
    //准备拖动
    public handleScrubbingBegin($event) {
        this._handleScrubbingBeginHelper($event); 
        
        console.log("handleScrubbingBegin+++++++++++++");
        
        this.index.onmousemove = ($evt) => this.handleScrubbingMove($evt);
        this.index.onmouseup = ($evt) => this.handleScrubbingEnd($evt);
        this.index.className += scrubbingClass;
    }
    
    //拖动ing
    public handleScrubbingMove($event) {
        console.log("handleScrubbingMove");
        this._setPlayProgress($event.pageX);   
    }
    
    //拖动结束
    public handleScrubbingEnd($event) {
        
                console.log("handleScrubbingEnd---------------");
        this._handleScrubbingEndHelper($event);
        this.index.onmousemove = null;
        this.index.onmouseup = null;
        this.index.className = this.index.className.replace(scrubbingClass, "");
    }
    
    private _handleScrubbingEndHelper($event) {
        this.audio.play();
        this._setPlayProgress($event.pageX);
        this._trackingProgress();
    }
    
    private _setPlayProgress ( clickX: number ) { 
        
		let newPercent = Math.max( 0, Math.min(1, (clickX - this._findPosX(this._barRef.nativeElement)) / this._barRef.nativeElement.offsetWidth) ); 
		this.audio.currentTime = newPercent * this.audio.duration; 
	}
    
    private _findPosX (pb : any) { 
		let curleft = pb.offsetLeft;
        
		while( pb = pb.offsetParent ) { 
			curleft += pb.offsetLeft; 
		} 
        
		return curleft; 
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
            console.log("play: ", this._curPlaylist[index].song.name);
            return this._curPlaylist[index].song.id;
            
        }
        
        console.log("can't play: next one", this._curPlaylist[index].song.name);
        
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

