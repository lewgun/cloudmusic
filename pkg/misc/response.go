package misc

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"strings"
)

func SimpleResponse(c *gin.Context, any interface{}) {

	var obj interface{}

	const (
		result = "result"
	)

	obj = map[string]interface{}{result: "success"}

	switch param := any.(type) {
	case error:
		if param != nil {
			c.Error(param)
			obj = gin.H{"result": "fail", "faildesc": param.Error()}
		}

	case gin.H:
		param[result] = "success"
		obj = param

	case map[string]interface{}:

		if _, ok := param[result]; !ok {
			param[result] = "success"
		}

		obj = param

	case string:
		obj = any
    
    default:
          obj = gin.H{
              "result": "success",
               "data": any,
            }  
	}

	c.JSON(200, obj)
}

// KVToMap parse the response  in form of "k1=v1&k2=v2" to
// a map
func KVToMap(resp []byte) (map[string]string, error) {
	if resp == nil {
		return nil, fmt.Errorf("invalid parameter(s)")
	}

	m := make(map[string]string)

	content := strings.Split(string(resp), "&")

	for _, item := range content {

		//strings.Split(s, "=") will cause error when signature has padding(that is something like "==")
		idx := strings.IndexAny(item, "=")
		if idx < 0 {
			return nil, fmt.Errorf("parse error for value of %s", item)
		}

		k := item[:idx]
		v := item[idx+1:]
		m[k] = v
	}

	return m, nil
}
