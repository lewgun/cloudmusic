package types


//BaseParams
type BaseParams struct {
    Params string `json:"params"`
    EncSecKey string `json:"encSecKey"`
}

//LoginParams
type LoginReq struct {
    BaseParams
    By string `json:"by"`

}

type Profile struct {
    UserID int `json:"userId"`
    AvatarURL string `json:"avatarUrl"`
    NickName string  `json:"nickname"`
    Signature string  `json:"signature"`

}
