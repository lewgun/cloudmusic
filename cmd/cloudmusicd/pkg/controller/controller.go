package controller

import (
	_ "github.com/lewgun/cloudmusic/cmd/cloudmusicd/pkg/controller/build"
	"github.com/lewgun/cloudmusic/cmd/cloudmusicd/pkg/dispatcher"

	"github.com/gin-gonic/gin"
)

//SetupRouters setup all controllers
func SetupRouters(r *gin.Engine) {

	r.POST(dispatcher.GlobbingURL, dispatcher.Do)
	r.GET(dispatcher.GlobbingURL, dispatcher.Do)
	r.PUT(dispatcher.GlobbingURL, dispatcher.Do)
	r.DELETE(dispatcher.GlobbingURL, dispatcher.Do)
}
