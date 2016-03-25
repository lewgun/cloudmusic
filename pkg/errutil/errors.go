package errutil

import (
	"errors"
)

var (
	//ErrCacheMiss means that a Get failed because the item wasn't present.
	ErrCacheMiss = errors.New("memcache: cache miss")

	// ErrServer means that a server error occurred.
	ErrServerError = errors.New("memcache: server error")

	ErrNotFound = errors.New("ErrNotFound")
	ErrNotAdmin = errors.New("ErrNotAdmin")

	ErrInvalidParameter  = errors.New("ErrInvalidParameter")
	ErrWrongPassword     = errors.New("ErrWrongPassword")
	ErrAccountDisabled   = errors.New("ErrAccountDisabled")
	ErrAccountNotExisted = errors.New("ErrAccountNotExisted")
)
