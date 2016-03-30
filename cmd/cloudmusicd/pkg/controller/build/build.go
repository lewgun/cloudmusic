package build

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/gin-gonic/gin"

	"github.com/lewgun/cloudmusic/cmd/cloudmusicd/pkg/dispatcher"
)

type Build struct {
}

const webRoot = "./web"

func runCmd(cmd *exec.Cmd) error {
	cwd, _ := os.Getwd()
	defer os.Chdir(cwd)

	os.Chdir(webRoot)
	cmd.Start()
	return cmd.Wait()

}

//Tsc
func (b Build) Tsc(ctx *gin.Context) (interface{}, error) {

	err := runCmd(exec.Command("npm", "run", "tsc"))
	if err != nil {
		return nil, err
	}

	return "npm run tsc is finished", nil
}

//Browserify
func (b Build) Browserify(ctx *gin.Context) (interface{}, error) {

	err := runCmd(exec.Command("npm", "run", "browserify"))
	if err != nil {
		return nil, err
	}

	return "npm run browserify is finished", nil
}

//Uglify
func (b Build) Uglify(ctx *gin.Context) (interface{}, error) {

	err := runCmd(exec.Command("npm", "run", "uglify"))
	if err != nil {
		return nil, err
	}

	return "npm run uglify is finished", nil
}

//All
func (b Build) All(ctx *gin.Context) (interface{}, error) {

	err := runCmd(exec.Command("npm", "run", "tsc"))
	// if err != nil {
	// 	return nil, err
	// }
	fmt.Println("npm run tsc finished")
	err = runCmd(exec.Command("npm", "run", "browserify"))
	if err != nil {
		return nil, err
	}

	fmt.Println("npm run browserify finished")

	err = runCmd(exec.Command("npm", "run", "uglify"))
	if err != nil {
		return nil, err
	}
	fmt.Println("npm run  uglify finished")

	return "npm run all is finished", nil
}

//Command show all supported commands
func (b Build) Command(ctx *gin.Context) (interface{}, error) {
	return "npm run tsc/uglify/browserify/all", nil
}

func init() {
	dispatcher.Register(&Build{})
}
