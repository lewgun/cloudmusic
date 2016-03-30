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

	//default method name
	defaultMethod = "Command"
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

	//	fmt.Printf("%s\n%s\n%s\n%s\n", ctx.Request.Method, ctx.Request.RequestURI, ctx.Request.URL.RawPath, ctx.Request.URL.Path)

	fields := strings.Split(ctx.Request.URL.Path, "/")

	temp := fields[:0]

	for _, x := range fields {
		if x != "" {
			temp = append(temp, x)
		}
	}

	// /a/b/c => '', a, b, c
	methodName := func() string {

		var typeName string
		var methodName string

		switch len(temp) {
		case 1: // /do/
			typeName = "dispatcher"
			methodName = defaultMethod

		case 2: // do/build/
			typeName = misc.UnderscoreToCamel(temp[1])
			methodName = defaultMethod

		default:
			// /do/build/browserify
			// /do/console/login
			typeName = misc.UnderscoreToCamel(temp[1])
			methodName = misc.UnderscoreToCamel(temp[2])

		}

		return typeName + "." + methodName

	}()

	retVal, err := d.caller.Call(methodName, ctx)
	if err != nil {
		misc.SimpleResponse(ctx, fmt.Sprintf("run: %s failed with error: %v\n", methodName, err))
		return
	}
	if retVal[1] != nil {
		misc.SimpleResponse(ctx, retVal[1])
		return
	}
    
    if methodName == "Build.All" {
        ctx.Redirect(302, "/")
        return 
    }

	misc.SimpleResponse(ctx, retVal[0])

}

func (d *dispatcher) Command(*gin.Context) (interface{}, error) {

	var commands []string

	for c := range d.typeNames {
		commands = append(commands, c)
	}

	fmt.Println(strings.Join(commands, "/"))
	return strings.Join(commands, "/"), nil
}

var _dispatcher *dispatcher

func init() {
	_dispatcher = &dispatcher{
		caller:    funcall.New(),
		typeNames: make(map[string]bool),
	}

	_dispatcher.caller.Register(_dispatcher)
}

// Register registers the structs that implement the some exported methods.
// Each struct in vars must be pointer type
// every objs must have at least one api:
// Command(*gin.Context)(interface{}, error )
// every api's handler's signature must like this:
// ApiHandler(*gin.Context)(interface{}, error )
func Register(objs ...interface{}) {
	_dispatcher.register(objs...)
}

//Do do a action
func Do(ctx *gin.Context) {
	fmt.Println("do now")
	_dispatcher.call(ctx)
}
