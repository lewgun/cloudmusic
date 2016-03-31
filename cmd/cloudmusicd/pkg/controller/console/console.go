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
		return  fmt.Errorf("unkonwn login method")

	}

	data, err := c.post(action, &params.BaseParams)
	if err != nil {
		return  err
	}

	fmt.Println(string(data))

	// obj, err := objx.FromJSON(string(data))
	// if err != nil {
	// 	return nil, err
	// }

	// if int(obj.Get("code").Float64()) != 200 {
	// 	return nil, fmt.Errorf(string(data))
	// }

	// m := obj.Get("profile").Data().(map[string]interface{})

	// temp := m["userId"].(float64)
	// profile := &types.Profile{
	// 	UserID:    int(temp),
	// 	Signature: m["signature"].(string),
	// 	NickName:  m["nickname"].(string),
	// 	AvatarURL: m["avatarUrl"].(string),
	// }
    
    m := gin.H{
        "data": string(data),
    }
    misc.SimpleResponse(ctx, m)
	return  nil
}

func (c *Console) post(action string, p *types.BaseParams) ([]byte, error) {

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
    

	return ioutil.ReadAll(reader)

}

// logout endpoint
func Logout(ctx *gin.Context) {
	//internal.DelSession(ctx)
	m := map[string]interface{}{}
	misc.SimpleResponse(ctx, m)
}
