package main

import (
	"codegen/golang"
	"codegen/ts"
	"codegen/utils"
	"encoding/json"
	"io"
	"log"
	"os"
	"strings"

	"gopkg.in/yaml.v3"
)

// Custom JSON encoder that does not escape HTML characters
func customMarshalIndent(v interface{}, prefix, indent string) ([]byte, error) {
	buf := &strings.Builder{}
	enc := json.NewEncoder(buf)
	enc.SetIndent(prefix, indent)
	enc.SetEscapeHTML(false) // Disable HTML escaping
	if err := enc.Encode(v); err != nil {
		return nil, err
	}
	// Remove the trailing newline added by Encode
	return []byte(strings.TrimSuffix(buf.String(), "\n")), nil
}

func main() {
	p := "./db.yml"
	//fmt.Println("Opening", p)
	_, err := os.Stat(p)
	if os.IsNotExist(err) {
		log.Fatal("Db file not found")
	}
	file, err := os.Open(p)
	if err != nil {
		log.Fatal("Error opening db file")
	}
	defer file.Close()

	data, err := io.ReadAll(file)
	if err != nil {
		log.Fatal("Error reading db file")
	}
	t := make(map[string]interface{})
	err = yaml.Unmarshal([]byte(data), &t)
	if err != nil {
		log.Fatal("Error unmarshaling db file", err)
	}

	// Use customMarshalIndent to marshal and format the JSON
	jsonData, err := customMarshalIndent(t, "", "  ")
	if err != nil {
		log.Fatal("Error marshaling to JSON", err)
	}

	// Print the JSON data
	content := string(jsonData)

	tsData := ts.Gen(content)
	utils.Write("../ts/src/db.ts", tsData)
	//fmt.Println(tsData)

	goData := golang.Gen(content)
	utils.Write("../go/templates/db.go", goData)
	//fmt.Println(goData)
}
