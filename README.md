# Modprompt

[![pub package](https://img.shields.io/npm/v/modprompt)](https://www.npmjs.com/package/modprompt)

A collection of prompt templates for language models

## Install

```bash
npm install modprompt
# or
yarn add modprompt
```

## Usage

### Available templates

List the available templates:

```js
import { templates } from "modprompt";

const templateNames = Object.keys(templates);
console.log(templateNames);
```

### Load a template

To load a template:

```js
import { templates, useTemplate } from "modprompt";

const tpl = useTemplate(templates.alpaca);
// or
const tpl = useTemplate("alpaca");
```

### Render a template

To render a template to string:

```js
const templateText = tpl.render();
```

Rendering for an Alpaca template:

```
Below is an instruction that describes a task. Write a response that appropriately completes the request.

### Instruction:
{prompt}

### Response:
```

### Render a prompt

Similar to the `render` function above, but replaces `{prompt}` by the provided text:

```js
const templateText = tpl.prompt("What is the capital of Kenya?");
```

### System messages

The template have system messages support if the original template supports it.

To replace a system message:

```js
tpl.system("You are a javascript specialist");
```

Rendering for an Alpaca template:

```
You are a javascript specialist

### Instruction:
{prompt}

### Response:
```

To append to a system message:

```js
tpl.afterSystem("You are a javascript specialist");
```

### Example shots

The templates have support for example shots. Add one shot:

```js
tpl.addShot(
  "fix this invalid json:\n\n```json\n{'a':1,}\n```",
  '\n\n```json\n{"a":1}\n```\n',
)
```

The first param is the user question, and the second is the assistant response. It
is assembled in a prompt template. Example with custom user and assistant messages:

```js
// modify system message
tpl.afterSystem("You are a javascript specialist");
// modify assistant message
tpl.template.assistant = tpl.template.assistant + " (answer in valid json)"
// modify the prompt message
tpl.template.user = tpl.template.user.replace("{prompt}", "fix this invalid json:\n\n```json\n{prompt}\n```")
// add a one shot example
tpl.addShot(
  "{'a':1,}",
  '\n\n```json\n{"a":1}\n```\n',
)
```

Rendering for an Alpaca template:

```
Below is an instruction that describes a task. Write a response that appropriately completes the request. You are a javascript specialist

### Instruction:
fix this invalid json:

'''json
{'a':1,}
'''

### Response: (answer in valid json)

'''json
{"a":1}
'''

### Instruction:
fix this invalid json:

'''json
{prompt}
'''

### Response: (answer in valid json)
```

## Types

Template types:

```ts
interface SpacingSlots {
  system?: number;
  user?: number;
  assistant?: number;
}

interface PromptBlock {
  schema: string;
  message?: string;
}

interface TurnBlock {
  user: string;
  assistant: string;
}

interface LmTemplate {
  name: string;
  user: string;
  assistant: string;
  system?: PromptBlock;
  shots?: Array<TurnBlock>;
  stop?: Array<string>;
  linebreaks?: SpacingSlots;
  spacing?: SpacingSlots;
}
```

Example raw template:

```ts
import type { LmTemplate } from "modprompt";

const orca: LmTemplate = {
  "name": "Orca",
  "system": {
    "schema": "### System:\n{system}",
    "message": "You are an AI assistant that follows instruction extremely well. Help as much as you can.",
  },
  "user": "### User:\n{prompt}",
  "assistant": "### Response:",
  "linebreaks": {
    "system": 2,
    "user": 2
  }
}
```