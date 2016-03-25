package zlog

import (
	"errors"
	"testing"
)

func TestLogger(t *testing.T) {

	SharedInstance(1)
	defer L.Close()

	rawErr := errors.New("raw log balabala")
	err := L.Error(rawErr)
	err2 := L.Error(err)
	if err != err2 {
		t.Fatal("must be the same log")
	}
}
