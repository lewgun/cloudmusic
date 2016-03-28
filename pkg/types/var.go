package types

//RequestParams
type LoginReq struct {
    By string `json:"by"`
    Params string `json:"params"`
    EncSecKey string `json:"encSecKey"`
}