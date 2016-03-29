package console

import (
	"fmt"
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
	musicAPIBase  = "http://music.163.com/"
	webLoginUrl   = "https://music.163.com/weapi/login?csrf_token="
	phoneLoginUrl = "https://music.163.com/weapi/login/cellphone/?csrf_token="
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

func setCookies() error {
	cookies, err := cookiejar.New(nil)
	if nil != err {
		return fmt.Errorf("failed to init netease httpclient cookiejar: %s", err)
	}

	apiURL, err := url.Parse(musicAPIBase)
	if nil != err {
		return fmt.Errorf("failed to parse netease api url %s: %s", musicAPIBase, err)
	}

	cookies.SetCookies(apiURL, []*http.Cookie{
	// 	&http.Cookie{Name: "appver", Value: "1.5.2"},
	})
	return nil
}

func init() {

	header := http.Header{}
	header.Add("Accept", "*/*")
	header.Add("Accept-Encoding", "gzip,deflate,sdch")
	header.Add("Accept-Language", "zh-CN,zh;q=0.8,en;q=0.6")
	header.Add("Connection", "keep-alive")
	header.Add("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
	header.Add("Host", "music.163.com")
	//header.Add("Origin", "http://music.163.com")
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

	var action string
	switch params.By {
	case byID:
		action = webLoginUrl

	case byMobile:
		action = phoneLoginUrl

	default:
		return nil, fmt.Errorf("unkonwn login method")

	}

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

	for k, vs := range resp.Header {
		fmt.Printf("%s ", k)
		for _, v := range vs {
			fmt.Printf("%v ", v)
		}
        fmt.Println()
	}

	return params.Params, nil
}

// logout endpoint
func Logout(ctx *gin.Context) {
	//internal.DelSession(ctx)
	m := map[string]interface{}{}
	misc.SimpleResponse(ctx, m)
}
