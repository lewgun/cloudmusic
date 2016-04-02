

//http://juristr.com/blog/2016/01/learning-ng2-dynamic-styles/
//https://coryrylan.com/blog/css-encapsulation-with-angular-2-components

import {Component, OnInit, OnDestroy}  from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';

import { CloudMusicService} from '../../services/cloud-music/cloud-music.service';
import { DialogService} from '../../services/dialog/dialog.service';

import { UserInfoStore, StoreToken, UserInfoActionCreator } from '../../services/flux/flux';

@Component({
    templateUrl: "user-info/user-info.component.html",
    styleUrls: ["user-info/user-info.component.css"],
    providers: [DialogService, CloudMusicService]

})

export class UserInfoComponent implements OnInit {

    userInfo: any;

    private _userInfoToken: StoreToken;

    private _dailyTaskToken: StoreToken;

    private _bgPosition = {};

    isDailyTaskDone: boolean = false;

    constructor(
        private _router: Router,
        private _routeParams: RouteParams,
        private _store: UserInfoStore,
        private _dlg: DialogService,
        private _action: UserInfoActionCreator,
        private _cloudMusic: CloudMusicService) {

        //this._handlerToken = this._store.Bind(() => this.onUserInfo());

        this._dailyTaskToken = this._store.Bind(() => this.onDailyTask());

        this.userInfo = this._store.UserInfo();
        //console.log(this.userInfo);

        // this.handleDailyTask();

    }


    onUserInfo() {
        //console.log(this._store.UserInfo());
    }

    onDailyTask() {
        if (!this._store.DailyTask()) {
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

                this._action.SaveDailyTask(true);

            },
            rejectVal => {
                console.log(rejectVal);
            });

    }
    
    // http://music.163.com/weapi/user/playlist?csrf_token"
    handlePlaylist() {

        this._cloudMusic.Playlist(3087853).
            then(retVal => {

                if (retVal.code !== 200) {
                    this._dlg.alert(retVal.code);
                    return;
                }

                console.log("playlist: ", retVal);

            },
            rejectVal => {
                console.log(rejectVal);
            });

    }
    
    // http://music.163.com/weapi/v3/playlist/detail?csrf_token=
    handlePlaylistDetail() {

        this._cloudMusic.PlaylistDetail(3965559).
            then(retVal => {

                if (retVal.code !== 200) {
                    this._dlg.alert(retVal.code);
                    return;
                }

                console.log("playlist detail: ", retVal);

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
        this._store.Unbind(this._dailyTaskToken);
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