package modprompt

import (
	"encoding/json"
	"fmt"
	"strings"
)

var Templates map[string]LmTemplate

func init() {
	var err error
	//tpl := make(map[string]interface{})
	err = json.Unmarshal([]byte(templates), &Templates)
	if err != nil {
		fmt.Println("Error unmarshalling templates:", err)
		return
	}
	//fmt.Println("TPL", Templates)

	// Debug: Print the Templates map to verify its contents
	/*for _, value := range Templates {
		fmt.Printf("Template ID: %s, Name: %s\n", value.ID, value.Name)
	}*/
}

func InitTemplate(name string) (LmTemplate, error) {
	tpl, ok := Templates[name]
	if !ok {
		return LmTemplate{}, fmt.Errorf("No template named " + name)
	}
	return tpl, nil
}

func (tpl *PromptTemplate) ReplaceSystem(msg string) *PromptTemplate {
	tpl._replaceSystem = msg
	return tpl
}

func (tpl *PromptTemplate) AfterSystem(msg string) *PromptTemplate {
	tpl._extraSystem = msg
	return tpl
}

func (tpl *PromptTemplate) AfterAssistant(msg string) *PromptTemplate {
	tpl._extraAssistant = msg
	return tpl
}

func (tpl *PromptTemplate) ReplacePrompt(msg string) *PromptTemplate {
	tpl._replacePrompt = msg
	return tpl
}

func (tpl *PromptTemplate) AddShot(user string, assistant string) *PromptTemplate {
	tpl.Shots = append(tpl.Shots, TurnBlock{User: user, Assistant: assistant})
	return tpl
}

func (tpl *PromptTemplate) AddShots(shots []TurnBlock) *PromptTemplate {
	tpl.Shots = append(tpl.Shots, shots...)
	return tpl
}

func (tpl *PromptTemplate) RenderShot(shot TurnBlock) string {
	var buf []string
	buf = append(buf, tpl._buildUserBlock(&shot.User))
	buf = append(buf, tpl._buildAssistantBlock(&shot.Assistant, true))
	if tpl.AfterShot != nil {
		buf = append(buf, *tpl.AfterShot)
	}
	return strings.Join(buf, "")
}

func (tpl *PromptTemplate) Render(skipEmptySystem bool) string {
	var res string
	if tpl.System != nil {
		res = tpl._buildSystemBlock(skipEmptySystem)
	}
	for _, shot := range tpl.Shots {
		res += tpl.RenderShot(shot)
	}
	//if len(tpl.Shots) == 0 {
	res += tpl._buildUserBlock(nil)
	res += tpl._buildAssistantBlock(nil, false)
	//}
	return res
}

func (tpl *PromptTemplate) Prompt(msg string) string {
	txt := tpl.Render(true)
	txt = strings.Replace(txt, "{prompt}", msg, 1)
	return txt
}

func (tpl *PromptTemplate) PushToHistory(turn HistoryTurn) *PromptTemplate {
	tpl.history = append(tpl.history, turn)
	return tpl
}

func (tpl *PromptTemplate) _buildSystemBlock(skipEmptySystem bool) string {
	var res string
	if tpl.System != nil {
		res = tpl.System.Schema
		if tpl._replaceSystem != "" {
			res = strings.Replace(res, "{system}", tpl._replaceSystem, -1)
		} else if tpl.System.Message != nil {
			res = strings.Replace(res, "{system}", *tpl.System.Message, -1)
		}
		if tpl._extraSystem != "" {
			res += tpl._extraSystem
		}
		if tpl.Linebreaks != nil && tpl.Linebreaks.System != nil {
			res += strings.Repeat("\n", *tpl.Linebreaks.System)
		}
	} else if !skipEmptySystem {
		res = tpl.System.Schema
	}
	return res
}

func (tpl *PromptTemplate) _buildUserBlock(msg *string) string {
	var buf []string
	userBlock := tpl.User
	if tpl._replacePrompt != "" {
		userBlock = strings.Replace(userBlock, "{prompt}", tpl._replacePrompt, -1)
	}
	if msg != nil {
		userBlock = strings.Replace(userBlock, "{prompt}", *msg, -1)
	}
	buf = append(buf, userBlock)
	if tpl.Linebreaks != nil && tpl.Linebreaks.User != nil {
		buf = append(buf, strings.Repeat("\n", *tpl.Linebreaks.User))
	}
	return strings.Join(buf, "")
}

func (tpl *PromptTemplate) _buildAssistantBlock(msg *string, isShot bool) string {
	var buf []string
	assistantBlock := tpl.Assistant
	buf = append(buf, assistantBlock)
	if tpl.Linebreaks != nil && tpl.Linebreaks.Assistant != nil {
		buf = append(buf, strings.Repeat("\n", *tpl.Linebreaks.Assistant))
	}
	if msg != nil {
		buf = append(buf, *msg)
	}
	if (tpl._extraAssistant != "") && !isShot {
		buf = append(buf, tpl._extraAssistant)
	}
	return strings.Join(buf, "")
}

/*func (tpl *PromptTemplate) _load(name string) (LmTemplate, error) {
	template, exists := templates[name]
	if !exists {
		return LmTemplate{}, errors.New(fmt.Sprintf("Template %s not found", name))
	}
	return template, nil
}*/
