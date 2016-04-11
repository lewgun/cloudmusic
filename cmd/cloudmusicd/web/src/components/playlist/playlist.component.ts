import {Component, OnInit, OnDestroy, ChangeDetectorRef}  from 'angular2/core';

import { CloudMusicService} from '../../services/cloud-music/cloud-music.service';
import { DialogService} from '../../services/dialog/dialog.service';

import { DurationFormatPipe} from '../../pipes/duration-format/duration-format.pipe';
import { TextFormatPipe} from '../../pipes/text-format/text-format.pipe';

import {
    StoreToken,

    //stores
    PlayListStore,
    PlayStore,

    //acitons
    PlayListActionCreator,
    PlayActionCreator,

    //events
    CurrentPlaylist_Read,
    CurrentSong_Read,
    PlayList_Read,
    PlayListDetail_Read


} from '../../services/flux/flux';

import { EventType }from '../../types/types';



const PlayList = "playlist"

@Component({
    templateUrl: "playlist/playlist.component.html",
    styleUrls: ["playlist/playlist.component.css"],
    selector: "playlist",
    providers: [DialogService, CloudMusicService],
    pipes: [DurationFormatPipe, TextFormatPipe],
})
export class PlaylistComponent implements OnInit, OnDestroy {

    private _playlistToken: StoreToken;
    private _playlistDetailToken: StoreToken;

    private _curSongToken: StoreToken;
    private _curPlaylistToken: StoreToken;

    playlistDetail: any[];

    curSongUrl: string;
    curSongId: number = -1;

    curPlaylistId: number = -1;

    constructor(
        private _cdr: ChangeDetectorRef,
        
        private _playAction: PlayActionCreator,

        private _playlistStore: PlayListStore,
        private _playStore: PlayStore,
        private _dlg: DialogService,
        private _cloudMusic: CloudMusicService) {

    }

    ngOnInit() {
        this._playlistDetailToken = this._playlistStore.Bind((evt: EventType) => this.onPlayListDetail(evt));

        this._curSongToken = this._playStore.Bind((evt: EventType) => this.onCurSong(evt));
        this._curPlaylistToken = this._playStore.Bind((evt: EventType) => this.onCurPlaylist(evt));
    }
    ngOnDestroy(): any {
        this._playlistStore.Unbind(this._playlistToken);
        this._playlistStore.Unbind(this._playlistDetailToken);

        this._playStore.Unbind(this._curSongToken);
        this._playStore.Unbind(this._curPlaylistToken);
        return null;
    }

    public onCurSong(evt: EventType) {

        if (evt != CurrentSong_Read) {
            return;
        }
        console.log("cur song id changed from ", this.curSongId, "to ", this._playStore.CurrentSong());
        this.curSongId = this._playStore.CurrentSong();

    }

    public onCurPlaylist(evt: EventType) {
        if (evt != CurrentPlaylist_Read) {
            return;
        }

        this.curPlaylistId = this._playStore.CurrentPlaylist();
        this._cdr.detectChanges();
    }



    public onPlayListDetail(evt: EventType) {
        if (evt != PlayListDetail_Read) {
            return;
        }

        this.playlistDetail = this._playlistStore.PlayListDetail();

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
}