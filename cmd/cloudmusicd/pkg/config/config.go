package config

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"strings"

	"github.com/lewgun/cloudmusic/pkg/errutil"
)

const (
	//ModeDebug run as debug
	ModeDebug = "debug"

	//ModeRelease run as release
	ModeRelease = "release"
)

var (
	C *Config
)

type WebServer struct {
	HTTPPort int    `json:"port"`
	RunMode  string `json:"run_mode"`
}

type Config struct {
	WebServer `json:"webserver"`
}

func (c *Config) init(path string) error {
	var err error
	if err = c.parse(path); err != nil {
		return fmt.Errorf("Can't load config from: %s with error: %v ", path, err)
	}

	if err = c.adjust(); err != nil {
		return fmt.Errorf("Adjust config failed.")
	}

	fmt.Println(c)

	return c.check()
}

func (c *Config) adjust() error {

	c.RunMode = strings.ToLower(c.RunMode)

	if c.RunMode != ModeRelease {
		c.RunMode = ModeDebug
	}

	return nil
}

func (c *Config) parse(path string) error {
	if path == "" {
		return errutil.ErrInvalidParameter
	}
	data, err := ioutil.ReadFile(path)
	if err != nil {
		return err
	}
	err = json.Unmarshal(data, c)

	return err
}

//check检测配置参数是否完备
func (c *Config) check() error {
	return nil
}

//Load 创建一个配置
func SharedInstance(path string) *Config {

	if C != nil {
		return C
	}

	C = &Config{}
	err := C.init(path)
	if err != nil {
		return nil
	}
	return C
}
