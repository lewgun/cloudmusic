package main

import (
	"flag"
	"fmt"
	"net/http"
	"runtime"
	"time"

	//config
	"github.com/lewgun/cloudmusic/cmd/cloudmusicd/pkg/config"

	//controller
	"github.com/lewgun/cloudmusic/cmd/cloudmusicd/pkg/controller"

	//logger
	"github.com/lewgun/cloudmusic/pkg/zlog"
	_ "github.com/lewgun/cloudmusic/pkg/zlog/logrus"

	//webserver
	"github.com/gin-gonic/contrib/cors"
	"github.com/gin-gonic/contrib/ginrus"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"

	//logger
	"github.com/Sirupsen/logrus"
)

var (
	confPath = flag.String("conf", "./cloudmusic.json", "the path to the config file")
)

func main() {

	runtime.GOMAXPROCS(runtime.NumCPU())
	c := mustPrepare()
	powerOn(c)
	powerOff()
}

func setupRouter(r *gin.Engine) {

	r.Use(static.Serve("/", static.LocalFile("web", false)))

	r.StaticFile("/", "web/index.html")

	r.GET("/ping", func(c *gin.Context) {
		c.String(200, "pong")
	})

	controller.SetupRouters(r)

}

func powerOn(c *config.Config) {

	if c.RunMode == config.ModeRelease {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()

	rLogger := zlog.L.RealLogger(zlog.DriverLogrus)
	if rLogger != nil {
		if l, ok := rLogger.(*logrus.Logger); ok {
			r.Use(ginrus.Ginrus(l, time.RFC3339, false))
		}
	}

	r.Use(cors.Default())

	setupRouter(r)

	fmt.Println("cloudmusic is running at: ", c.HTTPPort)

	srv := &http.Server{
		Addr:           fmt.Sprintf(":%d", c.HTTPPort),
		Handler:        r,
		ReadTimeout:    20 * time.Second,
		WriteTimeout:   20 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	srv.ListenAndServe()
}

func powerOff() {
	zlog.L.PowerOff()

}

func mustPrepare() *config.Config {

	//configure
	c := config.SharedInstance(*confPath)
	if c == nil {
		panic(fmt.Sprintf("can't load config from: %s", *confPath))
	}

	//logger
	err := zlog.BootUp()
	if err != nil {
		panic(err)
	}

	return c
}
