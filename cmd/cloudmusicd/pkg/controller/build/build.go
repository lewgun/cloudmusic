package build

import (
	"github.com/lewgun/cloudmusic/cmd/cloudmusicd/pkg/dispatcher"

	"github.com/gin-gonic/gin"
)

type Build struct {
}

//Tsc
func (b Build) Tsc(ctx *gin.Context) (interface{}, error) {

	return "hello from Build.Tsc", nil
}

//Browserify
func (b Build) Browserify(ctx *gin.Context) (interface{}, error) {
     return "hello from Build.Browserify", nil
}

//Uglify
func (b Build) Uglify(ctx *gin.Context) (interface{}, error) {
	return "hello from Build.Uglify", nil
}

//All
func (b Build) All(ctx *gin.Context) (interface{}, error) {
	return "hello from Build.All", nil
}

func init() {
	dispatcher.Register(&Build{})
}
