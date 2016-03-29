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
)

const (
	musicAPIBase  = "http://music.163.com/"
	webLoginURL   = "https://music.163.com/weapi/login?csrf_token="
	phoneLoginURL = "https://music.163.com/weapi/login/cellphone/?csrf_token="
)

const (
	byID     = "id"
	byMobile = "cellphone"
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
func (c *Console) Login(ctx *gin.Context) (interface{}, error) {
	params := &types.LoginParams{}
	ctx.BindJSON(params)

	var action string
	switch params.By {
	case byID:
		action = webLoginURL

	case byMobile:
		action = phoneLoginURL

	default:
		return nil, fmt.Errorf("unkonwn login method")

	}

	_, data, err := c.post(action, &params.BaseParams)
	if err != nil {
		return nil, err
	}

	unused(data)
	// fmt.Println(string(data))

	c.printCookies(musicAPIBase)

	return params.Params, nil
}

func (c *Console) printCookies(rawURL string) {

	domain, _ := url.ParseRequestURI(rawURL)

	cookies := c.jar.Cookies(domain)

	cookieNum := len(cookies)
	fmt.Printf("cookieNum=%d\n", cookies)

	for i := 0; i < cookieNum; i++ {
		var curCk *http.Cookie = cookies[i]
		//fmt.Printf("curCk.Raw=%s", curCk.Raw)
		fmt.Printf(" Cookie [%d]", i)
		fmt.Printf(" Name\t=%s ", curCk.Name)
		fmt.Printf(" Value\t=% s", curCk.Value)
		fmt.Printf(" Path\t=%s ", curCk.Path)
		fmt.Printf(" Domain\t=%s ", curCk.Domain)
		fmt.Printf(" Expires\t=%s ", curCk.Expires)
		fmt.Printf(" RawExpires=%s ", curCk.RawExpires)
		fmt.Printf(" MaxAge\t=%d ", curCk.MaxAge)
		fmt.Printf(" Secure\t=%t ", curCk.Secure)
		fmt.Printf(" HttpOnly=%t ", curCk.HttpOnly)
		fmt.Printf(" Raw\t=%s ", curCk.Raw)
		fmt.Printf(" Unparsed=%s ", curCk.Unparsed)
		fmt.Println()
	}
}

func (c *Console) post(action string, p *types.BaseParams) (http.Header, []byte, error) {

	v := url.Values{}
	v.Set("params", p.Params)
	v.Set("encSecKey", p.EncSecKey)

	req, _ := http.NewRequest(
		"POST",
		action,
		strings.NewReader(v.Encode()))

	req.Header = c.header

	rspn, _ := c.client.Do(req)

	defer rspn.Body.Close()

	var reader io.ReadCloser
	switch rspn.Header.Get("Content-Encoding") {
	case "gzip":
		reader, _ = gzip.NewReader(rspn.Body)
		defer reader.Close()

	default:
		reader = rspn.Body
	}

	data, err := ioutil.ReadAll(reader)
	return rspn.Header, data, err

}

// logout endpoint
func Logout(ctx *gin.Context) {
	//internal.DelSession(ctx)
	m := map[string]interface{}{}
	misc.SimpleResponse(ctx, m)
}
