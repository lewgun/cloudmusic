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
// 	musicAPIBase  = "http://music.163.com/"

 	musicAPIBase  = "https://music.163.com/weapi"
	webLoginUrl   = "https://music.163.com/weapi/login?csrf_token="
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

	// //netease api requires some cookies to work
	// cookies.SetCookies(apiUrl, []*http.Cookie{
	// 	&http.Cookie{Name: "appver", Value: "1.5.2"},
	// 	// &http.Cookie{Name: "os", Value: "pc"},
	// 	// &http.Cookie{Name: "osver", Value: "Microsoft-Windows-7-Ultimate-Edition-build-7600-64bit"},
    //    &http.Cookie{Name: "__csrf", Value: ""},
    //    &http.Cookie{Name: "_ntes_nuid", Value: ""},
    //    &http.Cookie{Name: "_ntes_nnid", Value: ""},
    //    &http.Cookie{Name: "NETEASE_WDA_UID", Value: ""},
    //    &http.Cookie{Name: "NTES_PASSPORT", Value: ""},
        
	// })

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
    header.Add("Cookie", "visited=true;JSESSIONID-WYYY=84e11faddc74b8128326d8678216d01ed72a9963a8bebe57bd1fcc2949be6f610d880aaa950178bc34bbbe704671e7ed2721a6636674f2e8f08b275f972ee78a4106a1b4b238442a6dc367a4420b531c036d2402c9e1cb20278a845ee6c02376e5062a13022f6bd4e20ad2b30f0321b2020fa6947d4987e1e2112c53b2976eddedee7904%3A1459175236171; _iuqxldmzr_=25; __csrf=6bdc0d902fcc24cbab68e78fc11570bf; __utma=94650624.1877994212.1459165883.1459168637.1459173437.3; __utmb=94650624.10.10.1459173437; __utmc=94650624; __utmz=94650624.1459165883.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)")
	header.Add("DNT", "1")
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

	action = fmt.Sprintf("https://music.163.com/weapi/login/cellphone/?csrf_token=")

	v := url.Values{}
	v.Set("params", params.Params)
    v.Set("encSecKey", params.EncSecKey)

	req, _ := http.NewRequest(
		"POST",
		action,
		strings.NewReader(v.Encode()))


	header := http.Header{}
	header.Add("Accept", "*/*")
	header.Add("Accept-Encoding", "gzip,deflate,sdch")
	header.Add("Accept-Language", "zh-CN,zh;q=0.8,en;q=0.6")
	header.Add("Connection", "keep-alive")
	header.Add("Content-Type", "application/x-www-form-urlencoded")
	header.Add("Host", "music.163.com")
	header.Add("Origin", "http://music.163.com")
	header.Add("Referer", "http://music.163.com")
	header.Add("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36")
  //  header.Add("Cookie", fmt.Sprintf(" __csrf=%s;appver=2.0.2",params.CSRFToken))
	header.Add("DNT", "1")


	req.Header = header

	resp, _ := c.client.Do(req)

	defer resp.Body.Close()
	d, _ := ioutil.ReadAll(resp.Body)
	fmt.Println(string(d))
    
    for k, vs := range resp.Header {
        fmt.Println(k, vs[0])
    }

	unused(d)
	return params.Params, nil
}

// logout endpoint
func Logout(ctx *gin.Context) {
	//internal.DelSession(ctx)
	m := map[string]interface{}{}
	misc.SimpleResponse(ctx, m)
}
