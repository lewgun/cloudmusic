

//http://juristr.com/blog/2016/01/learning-ng2-dynamic-styles/
//https://coryrylan.com/blog/css-encapsulation-with-angular-2-components
//http://www.07net01.com/program/34417.html css footer
import {Component, OnInit, OnDestroy}  from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';

import { CloudMusicService} from '../../services/cloud-music/cloud-music.service';
import { DialogService} from '../../services/dialog/dialog.service';

import { DurationFormatPipe} from '../../pipes/duration-format/duration-format.pipe';
import { TextFormatPipe} from '../../pipes/text-format/text-format.pipe';

import {
    StoreToken,

    //stores
    UserInfoStore,
    PlayListStore,
    PlayStore,

    //acitons
    UserInfoActionCreator,
    PlayListActionCreator,
    PlayActionCreator,

    //events
    CurrentPlaylist_Read,
    CurrentSong_Read,
    PlayList_Read,
    PlayListDetail_Read,
    UserInfo_Read,
    DailyTask_Read,


} from '../../services/flux/flux';

import { EventType }from '../../types/types';

import {AudioPlayerComponent} from '../audio-player/audio-player.component'


const PlayList = "playlist"

@Component({
    templateUrl: "user-info/user-info.component.html",
    styleUrls: ["user-info/user-info.component.css"],
    providers: [DialogService, CloudMusicService],
    pipes: [DurationFormatPipe, TextFormatPipe],
    directives: [AudioPlayerComponent]

})
export class UserInfoComponent implements OnInit, OnDestroy {

    userInfo: any;
    playlist: any;
    playlistDetail: any[];

    curSongUrl: string;
    curSongId: number = -1;

    curPlaylistId: number = -1;


    //tokens
   // private _userInfoToken: StoreToken;
    private _dailyTaskToken: StoreToken;

    private _playlistToken: StoreToken;
    private _playlistDetailToken: StoreToken;

    private _curSongToken: StoreToken;
    private _curPlaylistToken: StoreToken;

    private _bgPosition = {};

    isDailyTaskDone: boolean = false;

    constructor(
        private _router: Router,
        private _routeParams: RouteParams,

        private _userInfoStore: UserInfoStore,
        
        private _playlistStore: PlayListStore,
        private _playStore: PlayStore,

        private _userInfoAction: UserInfoActionCreator,
        private _playlistAction: PlayListActionCreator,
        private _playAction: PlayActionCreator,

        private _dlg: DialogService,
        private _cloudMusic: CloudMusicService) {

        //this._userInfoStore = this._store.Bind(() => this.onUserInfo());

        this._dailyTaskToken = this._userInfoStore.Bind((evt: EventType) => this.onDailyTask(evt));
        this._playlistToken = this._playlistStore.Bind((evt: EventType) => this.onPlayList(evt));
        this._playlistDetailToken = this._playlistStore.Bind((evt: EventType) => this.onPlayListDetail(evt));

        this._curSongToken = this._playStore.Bind((evt: EventType) => this.onCurSong(evt));
        this._curPlaylistToken = this._playStore.Bind((evt: EventType) => this.onCurPlaylist(evt));


        this.userInfo = this._userInfoStore.UserInfo();

        _cloudMusic.RegisterDigger(
            PlayList,
            (tracks: any[]): any[] => this.playlistDigger(tracks));

        // this.handleDailyTask();

    }

    private _genderPostion(): string {

        if (this.userInfo.profile.gender === 1) {  //male
            return "-39px -57px";
        }
        return "-39px -27px";
    }

    public playlistDigger(tracks: any[]): any[] {

        let retVal = [];
        for (let song of tracks) {
            let item: any = {};

            item.song = {};
            item.song.id = song.id;
            item.song.canPlay = song.a ? true : false; //不能播放的song.a为null

            item.song.name = song.name;
            item.song.alias = song.alia ? song.alia[0] : null;
            item.song.duration = song.dt;
            item.song.mv = song.mv;

            item.album = {};
            item.album.name = song.al.name;
            item.album.id = song.al.id;

            item.singers = [];

            //歌手可能有多个
            for (let s of song.ar) {
                item.singers.push({
                    name: s.name,
                    id: s.id
                });
            }
            retVal.push(item);
        }

        //console.log(retVal);
        return retVal;
    }


    public onUserInfo(evt: EventType) {
        //console.log(this._store.UserInfo());
    }

    public onPlayList(evt: EventType) {

        if (evt != PlayList_Read) {
            return;
        }

        this.playlist = this._playlistStore.PlayList();

    }

    public onCurSong(evt: EventType) {

        if (evt != CurrentSong_Read) {
            return;
        }

        this.curSongId = this._playStore.CurrentSong();
    }

    public onCurPlaylist(evt: EventType) {
        if (evt != CurrentPlaylist_Read) {
            return;
        }

        this.curPlaylistId = this._playStore.CurrentPlaylist();
    }


    public onPlayListDetail(evt: EventType) {
        if (evt != PlayListDetail_Read) {
            return;
        }

        this.playlistDetail = this._playlistStore.PlayListDetail();

    }


    public onDailyTask(evt: EventType) {
        if (!this._userInfoStore.DailyTask()) {
            this.isDailyTaskDone = false;
            return;
        }
        this.isDailyTaskDone = true;


        console.log("onDailyTask", this.isDailyTaskDone);

        // {point: 2, code: 200}
        //{code: -2, msg: "重复签到"}
        console.log(this.isDailyTaskDone);
    }

    // http://music.163.com/weapi/point/dailyTask
    public handleDailyTask(evt: EventType) {

        this._cloudMusic.SignIn().
            then(retVal => {

                if (retVal.code !== 200) {
                    this._dlg.alert(retVal.code);
                    return;
                }

                this._userInfoAction.SaveDailyTask(true);

            },
            rejectVal => {
                console.log(rejectVal);
            });

    }

    // http://music.163.com/weapi/user/playlist?csrf_token"
    //我的歌单
    public handleMyPlaylist(uid: number) {

        this._cloudMusic.Playlist(uid).
            then(retVal => {

                if (retVal.code !== 200) {
                    this._dlg.alert(retVal.code);
                    return;
                }

                this._playlistAction.SavePlayList(retVal);

            },
            rejectVal => {
                console.log(rejectVal);
            });

    }

    // http://music.163.com/weapi/v3/playlist/detail?csrf_token=
    //歌单详情
    public handleMyPlaylistDetail(pid: number) {
        this._cloudMusic.PlaylistDetail(pid).
            then(retVal => {

                if (retVal.code !== 200) {
                    this._dlg.alert(retVal.code);
                    return;
                }

                let temp = this._cloudMusic.Dig(
                    PlayList,
                    retVal.playlist.tracks);

                this._playlistAction.SavePlayListDetail(temp);
                this._playAction.SaveCurrentPlaylist(pid);

            },
            rejectVal => {
                console.log(rejectVal);
            });

    }

    public handlePlaySong(sid: number) {

        this._playAction.SaveCurrentSong(sid);

    }

    public songName(song: any, sep: string): string {

        let ret: string = song.name;
        if (song.alias) {
            ret += sep;
            ret += "(";
            ret += song.alias;
            ret += ")";
        }
        return ret;
    }

    public singerName(singers: any, sep: string): string {

        let ret: string = "";

        for (let s of singers) {
            ret += s.name;
            ret += sep;
        }


        return ret.substr(0, ret.length - 1);

    }


    ngOnInit() {
        this._bgPosition["gender"] = (): string => this._genderPostion();

    }
    ngOnDestroy(): any {
        //this._userInfoStore.Unbind(this._handlerToken ) ;
        this._userInfoStore.Unbind(this._dailyTaskToken);
        
        this._playlistStore.Unbind(this._playlistToken);
        this._playlistStore.Unbind(this._playlistDetailToken);
        
        this._playStore.Unbind(this._curSongToken);
        this._playStore.Unbind(this._curPlaylistToken);
        
        return null;
    }



    public position(kind: string): string {
        return this._bgPosition[kind]();
    }
}