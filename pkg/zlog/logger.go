//package zlog implements a simple logger.
// use it you must:
// 1. log.Boot()
// 2. L.Error(fmt.Errorf("any error"))
// 3. that's all
package zlog

import (
	"fmt"
	"runtime"
)

const (
	// the out put format
	format = "PaymentErr [%s %d] %s"

	//the error chan buffer size.
	chErrSize = 50
)

//Logger every real logger must implements this interface.
type Logger interface {
	Error(args ...interface{})
}

type logger struct {
	reals  map[DirverType]Logger // the real logger(s)
	chErr  chan error
	chWait chan struct{}
}

type DirverType string

const (
	//DriverSTD standard output.
	DriverSTD DirverType = "stdout"

	//DriverLogrus use package `logrus` as the output
	DriverLogrus = "logrus"
)

var (
	drivers map[DirverType]creatorHandler
)

type creatorHandler func() Logger

//Register regist a new type driver.
func Register(typ DirverType, h creatorHandler) error {

	if _, ok := drivers[typ]; ok {
		return fmt.Errorf("creator for driver: %s is existed.", typ)
	}
	drivers[typ] = h
	return nil
}

func init() {
	drivers = map[DirverType]creatorHandler{}
}

var L *logger

//BootUp boot the logger.
func BootUp() error {

	if L != nil {
		return nil
	}

	reals := map[DirverType]Logger{}

	for t, h := range drivers {

		if d := h(); d != nil {
			reals[t] = d
		}

	}

	L = &logger{
		reals:  reals,
		chErr:  make(chan error, chErrSize),
		chWait: make(chan struct{}),
	}

	L.run()
	return nil

}

//hadDone  check the error had done or not.
func (t *logger) hadDone(err error) bool {
	tErr, ok := err.(*zError)

	if ok && tErr.hadDone {
		return true
	}
	return false
}

//RealLogger return the real for with the 'typ'
func (t *logger) RealLogger(typ DirverType) Logger {

	if r, ok := t.reals[typ]; ok {
		return r
	}
	return nil

}

//Error output a error, it it had done, just ignore it .
func (t *logger) Error(err error) error {

	if err == nil {
		return nil
	}

	hadDone := t.hadDone(err)
	if hadDone {
		return err
	}

	zErr := &zError{
		error:   err,
		hadDone: true,
	}

	_, file, line, _ := runtime.Caller(1)
	t.chErr <- fmt.Errorf(format, file, line, err.Error())
	return zErr

}

func (t *logger) run() {
	go func() {
		for err := range t.chErr {
			t.outputError(err)
		}
		t.chWait <- struct{}{}
	}()
}

func (t *logger) outputError(err error) {

	for _, d := range t.reals {
		println("fuck error ")
		d.Error(err)
	}
}

//PowerOff shutdown the logger.
func (t *logger) PowerOff() {
	if t.chErr == nil {
		return
	}

	close(t.chErr)
	<-t.chWait

	t.chErr = nil
}
