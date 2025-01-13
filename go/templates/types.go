package templates

type SpacingSlots struct {
	System    *int `json:"system,omitempty"`
	User      *int `json:"user,omitempty"`
	Assistant *int `json:"assistant,omitempty"`
}

type PromptBlock struct {
	Schema  string  `json:"schema"`
	Message *string `json:"message,omitempty"`
}

type TurnBlock struct {
	User      string `json:"user"`
	Assistant string `json:"assistant"`
}

type LmTemplate struct {
	ID         string        `json:"id"`
	Name       string        `json:"name"`
	User       string        `json:"user"`
	Assistant  string        `json:"assistant"`
	System     *PromptBlock  `json:"system,omitempty"`
	Shots      []TurnBlock   `json:"shots,omitempty"`
	Stop       []string      `json:"stop,omitempty"`
	Linebreaks *SpacingSlots `json:"linebreaks,omitempty"`
	AfterShot  *string       `json:"afterShot,omitempty"`
	Prefix     *string       `json:"prefix,omitempty"`
}

type PromptTemplate struct {
	ID              string
	Name            string
	User            string
	Assistant       string
	System          *PromptBlock
	Shots           []TurnBlock
	Stop            []string
	Linebreaks      *SpacingSlots
	AfterShot       *string
	Prefix          *string
	_extraSystem    string
	_replaceSystem  string
	_extraAssistant string
	_replacePrompt  string
	history         []HistoryTurn
}

type ImgData struct {
	ID   int    `json:"id"`
	Data string `json:"data"`
}

type HistoryTurn struct {
	User      string    `json:"user"`
	Assistant string    `json:"assistant"`
	Images    []ImgData `json:"images,omitempty"`
}
