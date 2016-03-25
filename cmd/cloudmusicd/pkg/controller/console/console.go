package console

import (
	"github.com/gin-gonic/gin"
	"github.com/lewgun/cloudmusic/pkg/misc"
)

//Login admin login
func Login(c *gin.Context) {
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
}

// logout endpoint
func Logout(ctx *gin.Context) {
	//internal.DelSession(ctx)
	m := map[string]interface{}{}
	misc.SimpleResponse(ctx, m)
}
