package types


//BaseParams
type BaseParams struct {
    Params string `json:"params"`
    EncSecKey string `json:"encSecKey"`
}

//LoginParams
type LoginParams struct {
    BaseParams
    By string `json:"by"`

}