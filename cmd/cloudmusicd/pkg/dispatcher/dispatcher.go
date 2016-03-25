package dispatcher

import (
	"fmt"
	"reflect"
	"strings"

	"github.com/lewgun/cloudmusic/pkg/funcall"
	"github.com/lewgun/cloudmusic/pkg/misc"

	"github.com/gin-gonic/gin"
)

const (
	baseURL = "/do/"

	//GlobbingURL the only url for router.
	GlobbingURL = baseURL + "*globbing"

	// /do/build/browserify
	// /do/console/login
	fieldNumber = 4
)

//dispatcher dispatcher's is a http req dipatcher
type dispatcher struct {
	caller *funcall.Caller

	typeNames map[string]bool
}

func (d *dispatcher) register(objs ...interface{}) {

	for _, obj := range objs {

		t := reflect.TypeOf(obj)

		name := t.Elem().Name()
		if _, isExisted := d.typeNames[name]; isExisted {
			continue
		}

		d.typeNames[name] = true
		d.caller.Register(obj)
	}

}

func (d *dispatcher) call(ctx *gin.Context) {

	fmt.Printf("%s\n%s\n%s\n%s\n", ctx.Request.Method, ctx.Request.RequestURI, ctx.Request.URL.RawPath, ctx.Request.URL.Path)

	fields := strings.Split(ctx.Request.URL.Path, "/")

	// /a/b/c => '', a, b, c
	methodName := func() string {
		typeName := misc.UnderscoreToCamel(fields[2])
		methodName := misc.UnderscoreToCamel(fields[3])
		return typeName + "." + methodName

	}()

	retVal, err := d.caller.Call(methodName, ctx)
	if err != nil {
		ctx.Writer.WriteString(fmt.Sprintf("run: %s failed with error: %v\n", methodName, err))
		return
	}

	misc.SimpleResponse(ctx, retVal)

}

var _dispatcher *dispatcher

func init() {
	_dispatcher = &dispatcher{
		caller:    funcall.New(),
		typeNames: make(map[string]bool),
	}
}

// Register registers the structs that implement the some exported methods.
// Each struct in vars must be pointer type
func Register(objs ...interface{}) {
	_dispatcher.register(objs...)
}

//Do do a action
func Do(ctx *gin.Context) {
	fmt.Println("do now")
	_dispatcher.call(ctx)
}
