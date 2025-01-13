package ts

func Gen(content string) string {
	codeStart := `import { LmTemplate } from "./interfaces.js";

const templates: Record<string, LmTemplate> = `
	codeEnd := `;

export { templates }`
	return codeStart + content + codeEnd
}
