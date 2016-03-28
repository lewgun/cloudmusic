package console

import (
	"github.com/lewgun/cloudmusic/cmd/cloudmusicd/pkg/dispatcher"
	"github.com/lewgun/cloudmusic/pkg/misc"

	"github.com/gin-gonic/gin"
)

type Console struct {
}

func init() {
	dispatcher.Register(&Console{})
}

//Login admin login
func (c *Console) Login(ctx *gin.Context) (interface{}, error) {
	// auth := &types.Auth{}
	// c.BindJSON(auth)
	// login := &types.Login{
	// 	Auth:     auth,
	// 	ClientIp: c.ClientIP(),
	// }

	// ret, errAuth := storemgr.Do("Auth", login)
	// if errAuth != nil {
	// 	misc.SimpleResponse(c, errAuth)
	// 	return
	// }

	// user := ret.(*types.User)
	// if user.Type != types.Admin {
	// 	misc.SimpleResponse(c, errutil.ErrNotAdmin)
	// 	return
	// }
	// internal.SaveSession(c, user.Uid)
	// misc.SimpleResponse(c, gin.H{"account": auth.Name, "uid": user.Uid})
	return nil, nil
}

// logout endpoint
func Logout(ctx *gin.Context) {
	//internal.DelSession(ctx)
	m := map[string]interface{}{}
	misc.SimpleResponse(ctx, m)
}
