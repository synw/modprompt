
## Library Documentation

### SpacingSlots Interface
**Description:** Defines the spacing (in terms of line breaks) to be applied between different parts of the conversation.

**Example:**
```typescript
const spacingExample: SpacingSlots = {
  system: 2,
  user: 1,
  assistant: 1
};
```

### PromptBlock Interface
**Description:** Represents a block of system-level prompts or instructions in the conversation.

**Example:**
```typescript
const promptExample: PromptBlock = {
  schema: '### System: {system}',
  message: 'Some system message'
};
```

### TurnBlock Interface
**Description:** Represents a single turn in a conversation, consisting of a user message followed by an assistant response.

**Example:**
```typescript
const turnExample: TurnBlock = {
  user: 'What\'s the weather like?',
  assistant: 'It\'s sunny today!'
};
```

### LmTemplate Interface
**Description:** Represents a template for language modeling, detailing the structure and interaction elements of a conversation.

**Example:**
```typescript
const sampleTemplate: LmTemplate = {
  id: "alapaca",
  name: "Alpaca",
  system: {
    schema: "{system}",
    message: "Below is an instruction that describes a task. Write a response that appropriately completes the request.",
  },
  user: "### Instruction:\n{prompt}",
  assistant: "### Response:",
  linebreaks: {
    system: 2,
    user: 2,
  }
};
```

### ImgData Interface
**Description:** Image data

**Example:**
```typescript
const imgExample: ImgData = {
  id: 1,
  data: 'base64_image_data'
};
```

### HistoryTurn Interface
**Description:** A history turn

**Example:**
```typescript
const historyTurnExample: HistoryTurn = {
  user: 'What\'s the weather like?',
  assistant: 'It\'s sunny today!',
  images: [imgExample]
};
```

### Templates
**Description:** A collection of predefined templates for different language models.

**Example:**
```typescript
const tpl = new PromptTemplate('alpaca');
console.log(tpl.render());
```

### PromptTemplate Class
**Description:** A class for creating and manipulating language model templates.

**Methods:**
- **constructor(template: string | LmTemplate): void**
  - **Description:** Constructs a new `PromptTemplate` instance.
  - **Parameters:**
    - `template` - Either the name of the template to load or an instance of `LmTemplate`.
  - **Example:**
    ```typescript
    const tpl = new PromptTemplate('alpaca');
    ```

- **cloneTo(template: string | LmTemplate, keepShots: boolean = true): PromptTemplate**
  - **Description:** Clones the current `PromptTemplate` instance to a new instance of `PromptTemplate`.
  - **Parameters:**
    - `template` - The id or template instance of the new `PromptTemplate` to make
    - `keepShots` - Keep the shots for the template instance: this will also clone the shots 
  - **Example:**
    ```typescript
    const clonedTpl = tpl.cloneTo('chatml');
    console.log(clonedTpl);
    ```

- **toJson(): LmTemplate**
  - **Description:** Converts the current `PromptTemplate` instance to a JSON object.
  - **Returns:** A JSON object representing the current state of the `PromptTemplate`.
  - **Example:**
    ```typescript
    const json = tpl.toJson();
    console.log(json);
    ```

- **replaceSystem(msg: string): PromptTemplate**
  - **Description:** Replaces the system block with a given message.
  - **Parameters:**
    - `msg` - The message to replace the system block with.
  - **Returns:** A reference to the current `PromptTemplate` instance for chaining.
  - **Example:**
    ```typescript
    tpl.replaceSystem('You are a javascript expert');
    ```

- **afterSystem(msg: string): PromptTemplate**
  - **Description:** Appends a given message after the system message.
  - **Parameters:**
    - `msg` - The message to append.
  - **Returns:** A reference to the current `PromptTemplate` instance for chaining.
  - **Example:**
    ```typescript
    tpl.afterSystem('You are a javascript expert');
    ```

- **afterAssistant(msg: string): PromptTemplate**
  - **Description:** Appends a given message after the assistant prompt token.
  - **Parameters:**
    - `msg` - The message to append.
  - **Returns:** A reference to the current `PromptTemplate` instance for chaining.
  - **Example:**
    ```typescript
    tpl.afterAssistant('( answer in json )');
    ```

- **replacePrompt(msg: string): PromptTemplate**
  - **Description:** Replaces the `{prompt}` placeholder in the user message with a given message.
  - **Parameters:**
    - `msg` - The message to replace the placeholder with.
  - **Returns:** A reference to the current `PromptTemplate` instance for chaining.
  - **Example:**
    ```typescript
    tpl.replacePrompt(fix this invalid json:\n\n```json\n{prompt}\n```);
    ```

- **addShot(user: string, assistant: string): PromptTemplate**
  - **Description:** Adds a new shot (a user-assistant interaction) to the template.
  - **Parameters:**
    - `user` - The user's message.
    - `assistant` - The assistant's response.
  - **Returns:** A reference to the current `PromptTemplate` instance for chaining.
  - **Example:**
    ```typescript
    tpl.addShot('Is it raining?', 'No, it is sunny.');
    ```

- **addShots(shots: Array<TurnBlock>): PromptTemplate**
  - **Description:** Adds multiple shots (user-assistant interactions) to the template.
  - **Parameters:**
    - `shots` - An array of objects, where each object represents a user-assistant interaction.
  - **Returns:** A reference to the current `PromptTemplate` instance for chaining.
  - **Example:**
    ```typescript
    tpl.addShots([
      { user: 'What is the weather like?', assistant: 'It is sunny today!' },
      { user: 'What is the weather like tomorrow?', assistant: 'I am sorry, but I can\'t predict the future.' }
    ]);
    ```

- **renderShot(shot: TurnBlock | HistoryTurn): string**
  - **Description:** Renders a turn block
  - **Parameters:**
    - `shot` - the shot to render
  - **Returns:** the rendered text
  - **Example:**
    ```typescript
    console.log(tpl.renderShot({ user: 'What is the weather like?', assistant: 'It is sunny today!' }));
    ```

- **render(skip_empty_system: boolean = false): string**
  - **Description:** Renders the template into a string representation.
  - **Parameters:**
    - `skip_empty_system` - Whether to skip empty system blocks.
  - **Returns:** The rendered template as a string.
  - **Example:**
    ```typescript
    const rendered = tpl.render();
    console.log(rendered);
    ```

- **prompt(msg: string): string**
  - **Description:** Renders the template with the provided message replacing the `{prompt}` placeholder.
  - **Parameters:**
    - `msg` - The message to use for replacing the `{prompt}` placeholder.
  - **Returns:** The rendered template with the provided message.
  - **Example:**
    ```typescript
    const prompted = tpl.prompt("list the planets in the solar system");
    console.log(prompted);
    ```

- **pushToHistory(turn: HistoryTurn): PromptTemplate**
  - **Description:** Push a turn into history
  - **Parameters:**
    - `turn` - the history turn
  - **Returns:** A reference to the current `PromptTemplate` instance.
  - **Example:**
    ```typescript
    tpl.pushToHistory({ user: 'What is the weather like?', assistant: 'It is sunny today!' });
    ```
```