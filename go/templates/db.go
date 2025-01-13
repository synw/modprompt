package templates

var templates = `{
  "alpaca": {
    "assistant": "### Response:",
    "id": "alpaca",
    "linebreaks": {
      "system": 2,
      "user": 2
    },
    "name": "Alpaca",
    "system": {
      "message": "Below is an instruction that describes a task. Write a response that appropriately completes the request.",
      "schema": "{system}"
    },
    "user": "### Instruction:\n{prompt}"
  },
  "cerebrum": {
    "assistant": "Ai:",
    "id": "cerebrum",
    "linebreaks": {
      "user": 1
    },
    "name": "Cerebrum",
    "prefix": "<s>",
    "stop": [
      "</s>"
    ],
    "system": {
      "message": "A chat between a user and a thinking artificial intelligence assistant. The assistant describes its thought process and gives helpful and detailed answers to the user's questions.",
      "schema": "{system}"
    },
    "user": "User: {prompt}"
  },
  "chatml": {
    "afterShot": " <|im_end|>\n",
    "assistant": "<|im_start|>assistant",
    "id": "chatml",
    "linebreaks": {
      "assistant": 1,
      "system": 1,
      "user": 1
    },
    "name": "ChatMl",
    "stop": [
      "<|im_end|>"
    ],
    "system": {
      "schema": "<|im_start|>system\n{system}<|im_end|>"
    },
    "user": "<|im_start|>user\n{prompt}<|im_end|>"
  },
  "codestral": {
    "afterShot": "\n",
    "assistant": " [/INST]",
    "id": "codestral",
    "linebreaks": {
      "system": 2
    },
    "name": "Codestral",
    "stop": [
      "</s>"
    ],
    "system": {
      "schema": "<<SYS>>\n{system}\n<</SYS>>"
    },
    "user": "[INST] {prompt}"
  },
  "command-r": {
    "assistant": "<|START_OF_TURN_TOKEN|><|CHATBOT_TOKEN|>",
    "id": "command-r",
    "linebreaks": {
      "user": 1
    },
    "name": "Command-R",
    "prefix": "<BOS_TOKEN>",
    "stop": [
      "<|END_OF_TURN_TOKEN|>"
    ],
    "system": {
      "schema": "<|START_OF_TURN_TOKEN|><|SYSTEM_TOKEN|>{system}<|END_OF_TURN_TOKEN|>"
    },
    "user": "<|START_OF_TURN_TOKEN|><|USER_TOKEN|>{prompt}<|END_OF_TURN_TOKEN|>"
  },
  "deepseek": {
    "afterShot": "\n",
    "assistant": "### Response:",
    "id": "deepseek",
    "linebreaks": {
      "system": 1,
      "user": 1
    },
    "name": "Deepseek",
    "stop": [
      "<|EOT|>",
      "### Instruction:"
    ],
    "system": {
      "message": "You are an AI programming assistant, utilizing the DeepSeek Coder model, developed by DeepSeek Company, and you only answer questions related to computer science. For politically sensitive questions, security and privacy issues, and other non-computer science questions, you will refuse to answer.",
      "schema": "{system}"
    },
    "user": "### Instruction:\n{prompt}"
  },
  "deepseek2": {
    "assistant": "Assistant:",
    "id": "deepseek2",
    "linebreaks": {
      "system": 2,
      "user": 2
    },
    "name": "Deepseek v2",
    "stop": [
      "<｜end▁of▁sentence｜>",
      "<｜tool▁calls▁end｜>"
    ],
    "system": {
      "schema": "<｜begin▁of▁sentence｜>{system}"
    },
    "user": "User: {prompt}"
  },
  "gemma": {
    "afterShot": "\n",
    "assistant": "<end_of_turn>\n<start_of_turn>model",
    "id": "gemma",
    "name": "Gemma",
    "stop": [
      "<end_of_turn>"
    ],
    "user": "<start_of_turn>user\n{prompt}"
  },
  "guanaco": {
    "assistant": "### Assistant:",
    "id": "guanaco",
    "linebreaks": {
      "user": 1
    },
    "name": "Guanaco",
    "user": "### Human: {prompt}"
  },
  "human_response": {
    "assistant": "### RESPONSE:",
    "id": "human_response",
    "linebreaks": {
      "assistant": 1,
      "user": 2
    },
    "name": "Human response",
    "user": "### HUMAN:\n{prompt}"
  },
  "llama": {
    "assistant": " [/INST] ",
    "id": "llama",
    "linebreaks": {
      "system": 2,
      "user": 0
    },
    "name": "Llama",
    "prefix": "<s>",
    "stop": [
      "</s>"
    ],
    "system": {
      "message": "You are a helpful, respectful and honest assistant. Always answer as helpfully as possible\n\nIf a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.",
      "schema": "[INST] <<SYS>>\n{system}\n<</SYS>>"
    },
    "user": "{prompt}"
  },
  "llama3": {
    "afterShot": "<|eot_id|>\n\n",
    "assistant": "<|start_header_id|>assistant<|end_header_id|>",
    "id": "llama3",
    "name": "Llama 3",
    "stop": [
      "<|eot_id|>",
      "<|end_of_text|>"
    ],
    "system": {
      "schema": "<|start_header_id|>system<|end_header_id|>\n\n{system}<|eot_id|>"
    },
    "user": "<|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|>"
  },
  "llava": {
    "assistant": "ASSISTANT:",
    "id": "llava",
    "linebreaks": {
      "user": 1
    },
    "name": "Llava",
    "user": "USER: {prompt}"
  },
  "minichat": {
    "afterShot": "\n",
    "assistant": "[|Assistant|]",
    "id": "minichat",
    "name": "Minichat",
    "prefix": "<s> ",
    "stop": [
      "</s>",
      "[|User|]"
    ],
    "user": "[|User|] {prompt} </s>"
  },
  "mistral": {
    "afterShot": "\n",
    "assistant": " [/INST]",
    "id": "mistral",
    "name": "Mistral",
    "stop": [
      "</s>"
    ],
    "user": "[INST] {prompt}"
  },
  "nemotron": {
    "afterShot": "\n\n",
    "assistant": "<extra_id_1>Assistant",
    "id": "nemotron",
    "linebreaks": {
      "system": 2,
      "user": 1
    },
    "name": "Nemotron",
    "system": {
      "schema": "<extra_id_0>System\n{system}"
    },
    "user": "<extra_id_1>User\n{prompt}"
  },
  "none": {
    "assistant": "",
    "id": "none",
    "name": "No template",
    "user": "{prompt}"
  },
  "octopus": {
    "afterShot": "\n",
    "assistant": "<|assistant|>",
    "id": "octopus",
    "name": "Octopus",
    "stop": [
      "<|end|>"
    ],
    "system": {
      "message": "You are a router. Below is the query from the users, please call the correct function and generate the parameters to call the function.",
      "schema": "<|system|>{system}<|end|>"
    },
    "user": "<|user|>{prompt}<|end|>"
  },
  "openchat": {
    "assistant": "GPT4 Assistant:",
    "id": "openchat",
    "name": "OpenChat",
    "stop": [
      "<|end_of_turn|>"
    ],
    "user": "GPT4 User: {prompt}<|end_of_turn|>"
  },
  "openchat-correct": {
    "assistant": "GPT4 Correct Assistant:",
    "id": "openchat-correct",
    "name": "OpenChat correct",
    "stop": [
      "<|end_of_turn|>"
    ],
    "user": "GPT4 Correct User: {prompt}<|end_of_turn|>"
  },
  "opencodeinterpreter": {
    "assistant": "<|Assistant|>",
    "id": "opencodeinterpreter",
    "linebreaks": {
      "user": 2
    },
    "name": "Open code interpreter",
    "stop": [
      "<|EOT|>",
      "<|User|>"
    ],
    "user": "<|User|>\n{prompt}"
  },
  "orca": {
    "assistant": "### Response:",
    "id": "orca",
    "linebreaks": {
      "system": 2,
      "user": 2
    },
    "name": "Orca",
    "system": {
      "message": "You are an AI assistant that follows instruction extremely well. Help as much as you can.",
      "schema": "### System:\n{system}"
    },
    "user": "### User:\n{prompt}"
  },
  "phi": {
    "assistant": "Output:",
    "id": "phi",
    "linebreaks": {
      "user": 1
    },
    "name": "Phi",
    "stop": [
      "</s>",
      "Instruct:"
    ],
    "user": "Instruct: {prompt}"
  },
  "phi3": {
    "afterShot": "<|end|>\n",
    "assistant": "<|assistant|>",
    "id": "phi3",
    "name": "Phi 3",
    "stop": [
      "<|end|>",
      "<|user|>"
    ],
    "system": {
      "schema": "<|system|> {system}<|end|>"
    },
    "user": "<|user|> {prompt}<|end|>"
  },
  "phi4": {
    "afterShot": "<|im_end|>\n",
    "assistant": "<|im_start|>assistant<|im_sep|>",
    "id": "phi4",
    "name": "Phi 4",
    "stop": [
      "<|im_end|>",
      "<|im_sep|>"
    ],
    "system": {
      "schema": "<|im_start|>system<|im_sep|>{system}<|im_end|>"
    },
    "user": "<|im_start|>user<|im_sep|>{prompt}<|im_end|>"
  },
  "synthia-cot": {
    "assistant": "ASSISTANT:",
    "id": "synthia-cot",
    "linebreaks": {
      "system": 1,
      "user": 1
    },
    "name": "Synthia CoT",
    "system": {
      "message": "Elaborate on the topic using a Tree of Thoughts and backtrack when necessary to construct a clear, cohesive Chain of Thought reasoning. Always answer without hesitation.",
      "schema": "SYSTEM: {system}"
    },
    "user": "USER: {prompt}"
  },
  "vicuna": {
    "assistant": "### ASSISTANT:",
    "id": "vicuna",
    "linebreaks": {
      "user": 2
    },
    "name": "Vicuna",
    "user": "USER: {prompt}"
  },
  "vicuna_system": {
    "assistant": "### ASSISTANT:",
    "id": "vicuna_system",
    "linebreaks": {
      "system": 2,
      "user": 2
    },
    "name": "Vicuna system",
    "system": {
      "schema": "SYSTEM: {system}"
    },
    "user": "USER: {prompt}"
  },
  "wizard_vicuna": {
    "assistant": "### ASSISTANT:",
    "id": "wizard_vicuna",
    "linebreaks": {
      "user": 2
    },
    "name": "Wizard Vicuna",
    "stop": [
      "<|endoftext|>"
    ],
    "user": "### Human:\n{prompt}"
  },
  "wizardlm": {
    "assistant": "ASSISTANT:",
    "id": "wizardlm",
    "linebreaks": {
      "user": 1
    },
    "name": "WizardLM",
    "system": {
      "message": "You are a helpful AI assistant.",
      "schema": "{system}"
    },
    "user": "USER: {prompt}"
  },
  "zephyr": {
    "afterShot": "\n",
    "assistant": "<|assistant|>",
    "id": "zephyr",
    "linebreaks": {
      "assistant": 1,
      "system": 1,
      "user": 1
    },
    "name": "Zephyr",
    "stop": [
      "<|endoftext|>"
    ],
    "system": {
      "schema": "<|system|>\n{system}<|endoftext|>"
    },
    "user": "<|user|>\n{prompt}<|endoftext|>"
  }
}`