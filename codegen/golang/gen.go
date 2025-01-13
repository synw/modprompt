package golang

func Gen(content string) string {
	codeStart := `package templates

var templates = `
	return codeStart + "`" + content + "`"
}
