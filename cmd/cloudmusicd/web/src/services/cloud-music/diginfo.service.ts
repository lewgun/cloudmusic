
interface Digger {
    (raw: Array<Object>): Array<Object>;
}
export class InfoDigger {
    private static _diggers = new Map<string, Digger>();

    constructor() {
        InfoDigger._diggers.set("playlist", (playlist: Array<any>): Array<any> => {

            let retVal = [];
            for (let song of playlist) {
                let item : any = {};
                item.song.id = song.id;
                item.song.name = song.name;
                item.song.alias = song.alia ? song.alia[0] : null;
                item.song.duration = song.dt;
                item.song.mv = song.mv;

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

            return retVal;
        });
    }

    public Dig(typ: string, rawData: Array<Object>): Array<Object> {
        return InfoDigger._diggers.get(typ)(rawData);
    }

}

/*
    public SongUrl(song: Object, quality: number = 0) {
        let qualityObj = {
            br: 320000
        }

        let q = "Unknown";

        if (song.h) {
            qualityObj = song.h;
            q = "HD";

        } else if (song.m) {
            qualityObj = song.m;
            q = "MD";

        } else if (song.l) {
            qualityObj = song.l;
            q = "LD";
        }

        let params = {
            ids: [song.id],
            br: qualityObj.br
        }
        
            print("hahah")
            song["mp3_url"] = result["url"]
            song["url_expired_time"] = time.time() + result['expi']
            song["quality"] = quality
    }
 */