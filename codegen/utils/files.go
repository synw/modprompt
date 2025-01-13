package utils

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
)

func Write(fn, code string) {
	fn, err := filepath.Abs(fn)
	if err != nil {
		log.Panic(err)
	}

	file, err := os.OpenFile(fn, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0o755)
	if err != nil {
		log.Panic(err)
	}

	n, err := file.Write([]byte(code))
	if err != nil {
		log.Panic(err)
	}

	fmt.Printf("[codegen] File: %s (%d bytes)"+"\n", fn, n)
}
