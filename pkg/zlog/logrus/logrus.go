package logrus

import (
	"fmt"
	"os"

	"github.com/lewgun/cloudmusic/pkg/zlog"

	"github.com/Sirupsen/logrus"
)

func creator() zlog.Logger {

	fmt.Println("new logger")
	t := logrus.New()
	t.Level = logrus.ErrorLevel
	t.Out = os.Stderr
	return t
}

func init() {
	zlog.Register(zlog.DriverLogrus, creator)
}
