package golang

func Gen(content string) string {
	codeStart := `// Autogenerated code: do not edit

package modprompt

var templates = `
	return codeStart + "`" + content + "`"
}
