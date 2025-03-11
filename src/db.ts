// Autogenerated code: do not edit

import { LmTemplate } from "./interfaces.js";

const templates: Record<string, LmTemplate> = {
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
  "chatml-tools": {
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
      "message": "You are a helpful assistant with tool calling capabilities. You may call one or more functions to assist with the user query.\\nYou are provided with function signatures within <tools></tools> XML tags:\\n<tools>\\n{tools}\\n</tools>\\n\\nFor each function call, return a json object with function name and arguments within <tool_call></tool_call> XML tags:\\n<tool_call>\\n{\"name\": <function-name>, \"arguments\": <args-json-object>}\\n</tool_call>",
      "schema": "<|im_start|>system\n{system}<|im_end|>"
    },
    "tools": {
      "call": "<tool_call>\n{tool}\n</tool_call>",
      "def": "{system}",
      "response": "<|im_start|>user\n<tool_response>\n{tools_response}\n</tool_response><|im_end|>\n"
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
    "name": "Deepseek 2",
    "stop": [
      "<｜end▁of▁sentence｜>",
      "<｜tool▁calls▁end｜>"
    ],
    "system": {
      "schema": "<｜begin▁of▁sentence｜>{system}"
    },
    "user": "User: {prompt}"
  },
  "deepseek3": {
    "afterShot": "<｜end▁of▁sentence｜>",
    "assistant": "<｜Assistant｜>",
    "id": "deepseek3",
    "linebreaks": {
      "system": 2,
      "user": 2
    },
    "name": "Deepseek 3",
    "stop": [
      "<｜end▁of▁sentence｜>",
      "<｜tool▁calls▁end｜>"
    ],
    "system": {
      "schema": "<｜begin▁of▁sentence｜>{system}"
    },
    "user": "<｜User｜>{prompt}"
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
  "granite": {
    "afterShot": "<|end_of_text|>\n",
    "assistant": "<|start_of_role|>assistant<|end_of_role|>",
    "id": "granite",
    "linebreaks": {
      "system": 1,
      "user": 1
    },
    "name": "Granite",
    "stop": [
      "<|end_of_text|>",
      "<|start_of_role|>"
    ],
    "system": {
      "message": "You are Granite, developed by IBM. You are a helpful AI assistant.",
      "schema": "<|start_of_role|>system<|end_of_role|>{system}<|end_of_text|>"
    },
    "user": "<|start_of_role|>user<|end_of_role|>{prompt}<|end_of_text|>"
  },
  "granite-think": {
    "afterShot": "<|end_of_text|>\n",
    "assistant": "<|start_of_role|>assistant<|end_of_role|>",
    "id": "granite-think",
    "linebreaks": {
      "system": 1,
      "user": 1
    },
    "name": "Granite think",
    "stop": [
      "<|end_of_text|>",
      "<|start_of_role|>"
    ],
    "system": {
      "message": "You are Granite, developed by IBM. You are a helpful AI assistant. Respond to every user query in a comprehensive and detailed way. You can write down your thoughts and reasoning process before responding. In the thought process, engage in a comprehensive cycle of analysis, summarization, exploration, reassessment, reflection, backtracing, and iteration to develop well-considered thinking process. In the response section, based on various attempts, explorations, and reflections from the thoughts section, systematically present the final solution that you deem correct. The response should summarize the thought process. Write your thoughts after 'Here is my thought process:' and write your response after 'Here is my response:' for each user query.",
      "schema": "<|start_of_role|>system<|end_of_role|>{system}<|end_of_text|>"
    },
    "user": "<|start_of_role|>user<|end_of_role|>{prompt}<|end_of_text|>"
  },
  "granite-tools": {
    "afterShot": "<|end_of_text|>\n",
    "assistant": "<|start_of_role|>assistant<|end_of_role|>",
    "id": "granite-tools",
    "linebreaks": {
      "system": 1,
      "tools": 1,
      "user": 1
    },
    "name": "Granite tools",
    "stop": [
      "<|end_of_text|>",
      "<|start_of_role|>"
    ],
    "system": {
      "message": "You are Granite, developed by IBM. You are a helpful AI assistant with access to the following tools. When a tool is required to answer the user's query, respond with <|tool_call|> followed by a JSON list of tools used. If a tool does not exist in the provided list of tools, notify the user that you do not have the ability to fulfill the request.",
      "schema": "<|start_of_role|>system<|end_of_role|>{system}<|end_of_text|>"
    },
    "tools": {
      "call": "<|tool_call|>{tool}",
      "def": "<|start_of_role|>tools<|end_of_role|>{tools}<|end_of_text|>",
      "response": "<|start_of_role|>tool_response<|end_of_role|>{tools_response}<|end_of_text|>\n"
    },
    "user": "<|start_of_role|>user<|end_of_role|>{prompt}<|end_of_text|>"
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
  "mistral-system": {
    "afterShot": "\n",
    "assistant": "[/INST]",
    "id": "mistral-system",
    "name": "Mistral system",
    "stop": [
      "</s>"
    ],
    "system": {
      "schema": "[SYSTEM_PROMPT]{system_prompt}[/SYSTEM_PROMPT]"
    },
    "user": "[INST]{prompt}"
  },
  "mistral-system-tools": {
    "afterShot": "\n",
    "assistant": "",
    "id": "mistral-system",
    "name": "Mistral system",
    "stop": [
      "</s>"
    ],
    "system": {
      "schema": "[SYSTEM_PROMPT]{system_prompt}[/SYSTEM_PROMPT]"
    },
    "tools": {
      "call": "[TOOL_CALLS] [{tool}]</s>",
      "def": "[AVAILABLE_TOOLS]{tools}[/AVAILABLE_TOOLS]",
      "response": "[TOOL_RESULTS]{tools_response}[/TOOL_RESULTS]"
    },
    "user": "[INST]{prompt}[/INST]"
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
};

export { templates }