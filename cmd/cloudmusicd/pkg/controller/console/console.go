package console

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/cookiejar"
	"net/url"
	"strings"

	"github.com/lewgun/cloudmusic/cmd/cloudmusicd/pkg/dispatcher"
	"github.com/lewgun/cloudmusic/pkg/misc"
	"github.com/lewgun/cloudmusic/pkg/types"

	"github.com/gin-gonic/gin"
)

const (
	musicAPIBase  = "https://music.163.com/"
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

func init() {

	cookies, err := cookiejar.New(nil)
	if nil != err {
		panic(fmt.Sprintf("failed to init netease httpclient cookiejar: %s", err))
	}

	apiUrl, err := url.Parse(musicAPIBase)
	if nil != err {
		panic(fmt.Sprintf("failed to parse netease api url %s: %s", musicAPIBase, err))
	}

	// netease api requires some cookies to work
	cookies.SetCookies(apiUrl, []*http.Cookie{
		&http.Cookie{Name: "appver", Value: "1.5.2"},
		// &http.Cookie{Name: "os", Value: "pc"},
		// &http.Cookie{Name: "osver", Value: "Microsoft-Windows-7-Ultimate-Edition-build-7600-64bit"},
	})

	header := http.Header{}
	header.Add("Accept", "*/*")
	header.Add("Accept-Encoding", "gzip,deflate,sdch")
	header.Add("Accept-Language", "zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4*")
	header.Add("Connection", "application/x-www-form-urlencoded")
	header.Add("Host", "music.163.com")
	header.Add("Referer", "http://music.163.com/search/")
	header.Add("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36")

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

	var url string
	switch params.By {
	case byID:
		url = webLoginUrl

	case byMobile:
		url = phoneLoginUrl

	default:
		return nil, fmt.Errorf("unkonwn login method")

	}

	fmt.Println(fmt.Sprintf("params=%s&encSecKey=%s", params.Params, params.EncSecKey))
	req, _ := http.NewRequest(
		"POST",
		url,
		// strings.NewReader(fmt.Sprintf("params=%s&encSecKey=%s",params.Params,  params.EncSecKey)))
		strings.NewReader(fmt.Sprintf("params=%s&encSecKey=%s", "fdsfasdfa", "fdsfasd")))

	req.Header = c.header

	resp, _ := c.client.Do(req)

	defer resp.Body.Close()
	d, _ := ioutil.ReadAll(resp.Body)

	fmt.Println("get value: ")
	fmt.Println(string(d), len(d))

	return params.Params, nil
}

// logout endpoint
func Logout(ctx *gin.Context) {
	//internal.DelSession(ctx)
	m := map[string]interface{}{}
	misc.SimpleResponse(ctx, m)
}
