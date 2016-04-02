package console

import (
	"compress/gzip"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"net/http/cookiejar"
	"net/url"
	"strings"

	"github.com/lewgun/cloudmusic/cmd/cloudmusicd/pkg/dispatcher"
	"github.com/lewgun/cloudmusic/pkg/misc"
	"github.com/lewgun/cloudmusic/pkg/types"

	"github.com/gin-gonic/gin"
	//	"github.com/stretchr/objx"
)

const (
	musicAPIBase  = "http://music.163.com/"
	webLoginURL   = "https://music.163.com/weapi/login?csrf_token="
	phoneLoginURL = "https://music.163.com/weapi/login/cellphone/?csrf_token="
	dailyTaskURL  = "http://music.163.com/weapi/point/dailyTask/"
	
    // playlistURL   = "http://music.163.com/api/user/playlist/"
    	//playlistDetailURL   = "http://music.163.com/api/playlist/detail" 
        
    playlistURL   = "http://music.163.com/weapi/user/playlist?csrf_token"
    playlistDetailURL = "http://music.163.com/weapi/v3/playlist/detail?csrf_token="
    
)

const (
	byID     = "id"
	byMobile = "cellphone"
)

const (
	HTTP_POST = "POST"
	HTTP_GET  = "GET"
)

//Console is everything for exchange with netease cloud music
type Console struct {
	client *http.Client
	header http.Header
	jar    *cookiejar.Jar
}

func unused(...interface{}) {}

func init() {

	header := http.Header{}
	header.Add("Accept", "*/*")
	header.Add("Accept-Encoding", "gzip,deflate,sdch")
	header.Add("Accept-Language", "zh-CN,zh;q=0.8,en;q=0.6")
	header.Add("Connection", "keep-alive")
	header.Add("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
	header.Add("Host", "music.163.com")
	header.Add("Referer", "http://music.163.com/")
	header.Add("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36")

	jar, err := cookiejar.New(nil)

	if err != nil {
		panic(fmt.Errorf("failed to init netease httpclient cookiejar: %s", err))
	}

	c := &Console{
		client: &http.Client{
			Jar: jar,
		},
		header: header,
		jar:    jar,
	}

	dispatcher.Register(c)
}

//Login admin login
func (c *Console) Login(ctx *gin.Context) error {
	params := &types.LoginReq{}
	ctx.BindJSON(params)

	var action string
	switch params.By {
	case byID:
		fmt.Println("lgoin by id")
		action = webLoginURL

	case byMobile:
		action = phoneLoginURL

	default:
		return fmt.Errorf("unkonwn login method")

	}

	data, err := c.post(action, &params.BaseParams)
	if err != nil {
		return err
	}

	m := gin.H{
		"data": string(data),
	}
	misc.SimpleResponse(ctx, m)
	return nil
}

//DailyTask daily task sign in
func (c *Console) DailyTask(ctx *gin.Context) error {
	params := &types.BaseParams{}
	ctx.BindJSON(params)

	data, err := c.post(dailyTaskURL, params)
	if err != nil {
		return err
	}

	m := gin.H{
		"data": string(data),
	}
	misc.SimpleResponse(ctx, m)
	return nil
}

// //PlayList get the player's playlist
// func (c *Console) PlayList(ctx *gin.Context) error {

// 	v := url.Values{}
// 	v.Set("uid", ctx.Query("uid"))
// 	v.Set("offset", ctx.Query("offset"))
// 	v.Set("limit", ctx.Query("limit"))


// 	data, err := c.httpHelper(playlistURL, HTTP_GET, v)

// 	if err != nil {
// 		return err
// 	}

// 	m := gin.H{
// 		"data": string(data),
// 	}
// 	misc.SimpleResponse(ctx, m)
// 	return nil
// }

//PlayList get the player's playlist
func (c *Console) PlayList(ctx *gin.Context) error {

	params := &types.BaseParams{}
	ctx.BindJSON(params)

	data, err := c.post(playlistURL, params)
	if err != nil {
		return err
	}

	m := gin.H{
		"data": string(data),
	}
	misc.SimpleResponse(ctx, m)
	return nil
}


// //PlayListDetail get the playlist's detail
// func (c *Console) PlayListDetail(ctx *gin.Context) error {
// //func (c *Console) PlayList(ctx *gin.Context) error {

// 	v := url.Values{}
// 	//v.Set("id", ctx.Query("id"))
//     	v.Set("id", "3965559")


// 	data, err := c.httpHelper(playlistDetailURL, HTTP_GET, v)

// 	if err != nil {
// 		return err
// 	}

// 	m := gin.H{
// 		"data": string(data),
// 	}
// 	misc.SimpleResponse(ctx, m)
// 	return nil
// }

//PlayListDetail get the playlist's detail
func (c *Console) PlayListDetail(ctx *gin.Context) error {

	params := &types.BaseParams{}
	ctx.BindJSON(params)

	data, err := c.post(playlistDetailURL, params)
	if err != nil {
		return err
	}

	m := gin.H{
		"data": string(data),
	}
	misc.SimpleResponse(ctx, m)
	return nil
    
}


func (c *Console) httpHelper(action, method string, v url.Values) ([]byte, error) {

	var req *http.Request

	if method == HTTP_GET {
		req, _ = http.NewRequest(
			method,
			action,
			nil)
		req.URL.RawQuery = v.Encode()

	} else {
		req, _ = http.NewRequest(
			method,
			action,
			strings.NewReader(v.Encode()))
	}

	req.Header = c.header
	rspn, _ := c.client.Do(req)

	defer rspn.Body.Close()

	var rc io.ReadCloser
	switch rspn.Header.Get("Content-Encoding") {
	case "gzip":
		rc, _ = gzip.NewReader(rspn.Body)
		defer rc.Close()

	default:
		rc = rspn.Body
	}

	return ioutil.ReadAll(rc)
}
func (c *Console) post(action string, p *types.BaseParams) ([]byte, error) {

	v := url.Values{}
	v.Set("params", p.Params)
	v.Set("encSecKey", p.EncSecKey)

	return c.httpHelper(action, HTTP_POST, v)

}

// logout endpoint
func Logout(ctx *gin.Context) {
	//internal.DelSession(ctx)
	m := map[string]interface{}{}
	misc.SimpleResponse(ctx, m)
}
