package misc

import (
	"bytes"
	"crypto/md5"
	"encoding/base64"
	"fmt"
	"io"
	"net/url"
	"sort"
)

func MD5(text string) string {
	h := md5.New()
	io.WriteString(h, text)
	return fmt.Sprintf("%x", h.Sum(nil))
}

//URLBase64 将指定的文本进行url encoding
func URLBase64(src []byte) string {
	return base64.URLEncoding.EncodeToString(bytes.TrimSpace(src))
}

//URLUnBase64 将指定的文本进行url decoding
func URLUnBase64(src string) []byte {
	data, err := base64.URLEncoding.DecodeString(src)
	if err != nil {
		return nil
	}
	return data
}

func StdBase64(in []byte) string {
	return base64.StdEncoding.EncodeToString(in)
}

func StdUnBase64(in string) ([]byte, error) {
	return base64.StdEncoding.DecodeString(in)
}

// SortAndConcat sort the map by key in ASCII order,
// and concat it in form of "k1=v1&k2=v2"
func SortAndConcat(params map[string]string, isQuoted bool) []byte {

	if params == nil || len(params) == 0 {
		return nil
	}

	keys := make([]string, len(params))

	i := 0
	for k := range params {
		keys[i] = k
		i++
	}
	sort.Strings(keys)

	var quote string
	if isQuoted {
		quote = `"`
	}

	buf := &bytes.Buffer{}
	for _, k := range keys {
		buf.WriteString(k)
		buf.WriteString("=")
		buf.WriteString(quote)
		buf.WriteString(params[k])
		//buf.WriteString(url.QueryEscape(params[k]))
		buf.WriteString(quote)
		buf.WriteString("&")
	}

	buf.Truncate(buf.Len() - 1)
	return buf.Bytes()
}

// ConcatWithURLEncode concat the map to form of "k1=v1&k2=v2" and ensure "v1,v2"
// is Url encoded
func ConcatWithURLEncode(params map[string]string) *bytes.Buffer {
	if params == nil || len(params) == 0 {
		return nil
	}

	buf := &bytes.Buffer{}
	for k, v := range params {
		buf.WriteString(k)
		buf.WriteString("=")
		buf.WriteString(url.QueryEscape(v))
		buf.WriteString("&")
	}

	buf.Truncate(buf.Len() - 1)

	return buf
}

// PrintMap print map in form of "k=v"
func PrintMap(m map[string]string) {
	for k, v := range m {
		fmt.Println(k, "=", v)
	}
}

func Unused(...interface{}) {}

func CamelToUnderscore(name string) string {
	if name == "" {
		return name
	}
	bs := make([]rune, 0, 2*len(name))
	for _, s := range name {
		if 'A' <= s && s <= 'Z' {
			s += ('a' - 'A')
			bs = append(bs, '_')
		}
		bs = append(bs, s)
	}
	if bs[0] == '_' {
		return string(bs[1:])
	}
	return string(bs)
}

func UnderscoreToCamel(name string) string {
	ns := make([]rune, 0, len(name))
	isUnder := true
	for _, v := range name {
		r := v
		if isUnder {
			if v >= 'a' && v <= 'z' {
				r -= ('a' - 'A')
			}
		}
		isUnder = v == '_'
		if isUnder {
			continue
		}
		ns = append(ns, r)
	}
	return string(ns)
}
