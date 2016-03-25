package stdout

import (
	"fmt"

	"Passport-Platform/pkg/zlog"
)

type stdout struct{}

func (s *stdout) Error(args ...interface{}) {
	fmt.Println(args)
}

func creator() zlog.Logger {
	return &stdout{}
}

func init() {
	//	log.Register( log.DriverSTD, creator )
}
