

//http://juristr.com/blog/2016/01/learning-ng2-dynamic-styles/
//https://coryrylan.com/blog/css-encapsulation-with-angular-2-components

import {Component, OnInit, OnDestroy}  from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';

import { CloudMusicService} from '../../services/cloud-music/cloud-music.service';


import { DialogService} from '../../services/dialog/dialog.service';

import {
    StoreToken,

    UserInfoStore,
    PlayListStore,

    UserInfoActionCreator,
    PlayListActionCreator

} from '../../services/flux/flux';


const PlayList = "playlist"

@Component({
    templateUrl: "user-info/user-info.component.html",
    styleUrls: ["user-info/user-info.component.css"],
    providers: [DialogService, CloudMusicService]

})
export class UserInfoComponent implements OnInit {

    userInfo: any;
    playlist: any;
    playlistDetail: any[];

    curSongUrl: string;


    //tokens
    private _userInfoToken: StoreToken;
    private _dailyTaskToken: StoreToken;

    private _playlistToken: StoreToken;
    private _playlistDetailToken: StoreToken;

    private _bgPosition = {};

    isDailyTaskDone: boolean = false;

    constructor(
        private _router: Router,
        private _routeParams: RouteParams,
        private _userInfoStore: UserInfoStore,
        private _playlistStore: PlayListStore,

        private _userInfoAction: UserInfoActionCreator,
        private _playlistAction: PlayListActionCreator,

        private _dlg: DialogService,
        private _cloudMusic: CloudMusicService) {

        //this._handlerToken = this._store.Bind(() => this.onUserInfo());

        this._dailyTaskToken = this._userInfoStore.Bind(() => this.onDailyTask());
        this._playlistToken = this._playlistStore.Bind(() => this.onPlayList());
        this._playlistDetailToken = this._playlistStore.Bind(() => this.onPlayListDetail());

        this.userInfo = this._userInfoStore.UserInfo();
        console.log(this.userInfo);
        
        _cloudMusic.RegisterDigger(
            PlayList,
            (tracks: any[]): any[] => this.playlistDigger(tracks));

        // this.handleDailyTask();

    }

    playlistDigger(tracks: any[]): any[] {
        console.log("call playlistDigger ", tracks);

        let retVal = [];
        for (let song of tracks) {
            let item: any = {};

            item.song = {};
            item.song.id = song.id;

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


    onUserInfo() {
        //console.log(this._store.UserInfo());
    }

    onPlayList() {

        this.playlist = this._playlistStore.PlayList();
    }


    onPlayListDetail() {
        let temp = this._playlistStore.PlayListDetail();
        if (!temp) {
            return;
        }

        this.playlistDetail = this._cloudMusic.Dig(
            PlayList,
            temp.playlist.tracks);

        console.log(this.playlistDetail);
    }


    onDailyTask() {
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
    handleDailyTask() {

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
    handlePlaylist(uid: number) {

        this._cloudMusic.Playlist(uid).
            then(retVal => {

                if (retVal.code !== 200) {
                    this._dlg.alert(retVal.code);
                    return;
                }


                this._playlistAction.SavePlayList(retVal);

                //  console.log("playlist: ", retVal);

            },
            rejectVal => {
                console.log(rejectVal);
            });

    }

    // http://music.163.com/weapi/v3/playlist/detail?csrf_token=
    handlePlaylistDetail(pid: number) {

        this._cloudMusic.PlaylistDetail(pid).
            then(retVal => {

                if (retVal.code !== 200) {
                    this._dlg.alert(retVal.code);
                    return;
                }


                this._playlistAction.SavePlayListDetail(retVal);

                //   console.log("playlist detail: ", retVal);

            },
            rejectVal => {
                console.log(rejectVal);
            });

    }

    handleSongUrl(sid: number) {

        this._cloudMusic.SongUrl(sid).
            then(retVal => {

                if (retVal.code !== 200) {
                    this._dlg.alert(retVal.code);
                    return;
                }

                console.log("song url: ", retVal);
                this.curSongUrl = retVal.data[0].url;

            },
            rejectVal => {
                console.log(rejectVal);
            });

    }


    ngOnInit() {
        this._bgPosition["gender"] = (): string => this._genderPostion();

    }
    ngOnDestory() {
        //this._store.Unbind(this._handlerToken ) ;
        this._userInfoStore.Unbind(this._dailyTaskToken);
        this._userInfoStore.Unbind(this._playlistToken);
        this._userInfoStore.Unbind(this._playlistDetailToken);
    }

    private _genderPostion(): string {

        if (this.userInfo.profile.gender === 1) {  //male
            return "-39px -57px";
        }
        return "-39px -27px";
    }

    position(kind: string): string {
        return this._bgPosition[kind]();
    }
}