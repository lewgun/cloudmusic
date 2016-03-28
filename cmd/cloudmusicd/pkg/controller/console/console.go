package console

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/cookiejar"
	"net/url"
	"strings"
	// "encoding/base64"
	//  "os"

	"github.com/lewgun/cloudmusic/cmd/cloudmusicd/pkg/dispatcher"
	"github.com/lewgun/cloudmusic/pkg/misc"
	"github.com/lewgun/cloudmusic/pkg/types"

	"github.com/gin-gonic/gin"
)

const (
	musicAPIBase  = "http://music.163.com/"
	webLoginUrl   = "https://music.163.com/weapi/login/"
	phoneLoginUrl = "https://music.163.com/weapi/login/cellphone"
)

const (
	byID     = "id"
	byMobile = "cellphone"
)

//Console is everything for exchange with netease cloud music
type Console struct {
	client *http.Client
	header http.Header
}

func unused(...interface{}) {}
func init() {

	cookies, err := cookiejar.New(nil)
	if nil != err {
		panic(fmt.Sprintf("failed to init netease httpclient cookiejar: %s", err))
	}

	apiUrl, err := url.Parse(musicAPIBase)
	if nil != err {
		panic(fmt.Sprintf("failed to parse netease api url %s: %s", musicAPIBase, err))
	}

	//netease api requires some cookies to work
	cookies.SetCookies(apiUrl, []*http.Cookie{
		&http.Cookie{Name: "appver", Value: "2.0.2"},
		&http.Cookie{Name: "os", Value: "pc"},
		&http.Cookie{Name: "osver", Value: "Microsoft-Windows-7-Ultimate-Edition-build-7600-64bit"},
	})

	unused(cookies, apiUrl, err)

	header := http.Header{}
	header.Add("Accept", "*/*")
	header.Add("Accept-Encoding", "gzip,deflate,sdch")
	header.Add("Accept-Language", "zh-CN,zh;q=0.8,en;q=0.6")
	header.Add("Connection", "keep-alive")
	header.Add("Content-Type", "application/x-www-form-urlencoded")
	header.Add("Host", "music.163.com")
	header.Add("Origin", "http://music.163.com")
	header.Add("Referer", "http://music.163.com/")
	header.Add("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36")

	c := &Console{
		client: &http.Client{},
		header: header,
	}

	dispatcher.Register(c)
}

//Login admin login
func (c *Console) Login(ctx *gin.Context) (interface{}, error) {
	params := &types.LoginReq{}
	ctx.BindJSON(params)
	fmt.Println(params)

	var action string
	switch params.By {
	case byID:
		action = webLoginUrl

	case byMobile:
		action = phoneLoginUrl

	default:
		return nil, fmt.Errorf("unkonwn login method")

	}

	action = "http://music.163.com/weapi/login/cellphone/?csrf_token="

	v := url.Values{}
	v.Set("params", params.Params)
	v.Set("encSecKey", params.EncSecKey)

	req, _ := http.NewRequest(
		"POST",
		action,
		strings.NewReader(v.Encode()))

	req.Header = c.header

	resp, _ := c.client.Do(req)

	defer resp.Body.Close()
	d, _ := ioutil.ReadAll(resp.Body)
	fmt.Println(string(d))

	unused(d)
	return params.Params, nil
}

// logout endpoint
func Logout(ctx *gin.Context) {
	//internal.DelSession(ctx)
	m := map[string]interface{}{}
	misc.SimpleResponse(ctx, m)
}
