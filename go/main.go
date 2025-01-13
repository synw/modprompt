package main

import (
	"fmt"
	"gotemplate/templates"
)

func main() {
	// Initialize a template by name
	templateName := "chatml"
	tpl, err := templates.InitTemplate(templateName)
	if err != nil {
		fmt.Println("Error initializing template:", err)
		return
	}

	// Create a PromptTemplate from the LmTemplate
	promptTemplate := &templates.PromptTemplate{
		ID:         tpl.ID,
		Name:       tpl.Name,
		User:       tpl.User,
		Assistant:  tpl.Assistant,
		System:     tpl.System,
		Shots:      tpl.Shots,
		Stop:       tpl.Stop,
		Linebreaks: tpl.Linebreaks,
		AfterShot:  tpl.AfterShot,
		Prefix:     tpl.Prefix,
	}

	// Optionally, modify the template
	promptTemplate.ReplaceSystem("You are very a helpful assistant.")
	//promptTemplate.AfterSystem("\n")
	//promptTemplate.AfterAssistant("\n")

	// Add some shots to the template
	promptTemplate.AddShot("What is the capital of France?", "The capital of France is Paris.")
	promptTemplate.AddShot("What is the largest planet in our solar system?", "The largest planet in our solar system is Jupiter.")
	promptTemplate.AfterAssistant("Sure, the answer is")

	// Render the template
	renderedText := promptTemplate.Render(false)
	fmt.Println("Rendered Template:")
	fmt.Println(renderedText)

	// Render a prompt
	prompt := promptTemplate.Prompt("What is the tallest mountain in the world?")
	fmt.Println("\nRendered Prompt:")
	fmt.Println(prompt)
}
