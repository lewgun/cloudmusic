package auth

import (
	"Pay-Platform/pkg/misc"
	"testing"
)

//go test -test.v -test.bench="Add"
func BenchmarkVerify(b *testing.B) {
	hash := []byte("$2a$04$zZlJ.wrOepWEOlC7KX7E4OdPsmuwHrr/VIwy93J3FI1sWY0SbSQWC")
	//	hash := []byte("$10$SqRSI585FMLXkuIMsv66VOWwIoiaYtnOorMf1x4sjGzbAz9/wsoNy")
	salt := []byte("G8nbQDDwf46ImyQ6fN4D2g==")
	pass := []byte("4297f44b13955235245b2497399d7a93")

	for i := 0; i < b.N; i++ {
		Auther.Verify(salt, pass, hash)
	}
}

func TestVerify(t *testing.T) {
	hash := []byte("$2a$04$zZlJ.wrOepWEOlC7KX7E4OdPsmuwHrr/VIwy93J3FI1sWY0SbSQWC")
	//	hash := []byte("$10$SqRSI585FMLXkuIMsv66VOWwIoiaYtnOorMf1x4sjGzbAz9/wsoNy")
	salt := []byte("G8nbQDDwf46ImyQ6fN4D2g==")
	pass := []byte("4297f44b13955235245b2497399d7a93")

	if !Auther.Verify(salt, pass, hash) {
		t.Fail()
	}
}

func TestHashAndSalt(t *testing.T) {

	rawPass := "wzdk0996"
	pass := misc.MD5(rawPass)

	hash, salt, err := Auther.HashAndSalt([]byte(pass))
	if err != nil {
		t.Error(err)

	}
	t.Logf("%s %s\n", string(hash), string(salt))

}
