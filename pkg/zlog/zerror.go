package zlog

type zError struct {
	error
	hadDone bool
}
