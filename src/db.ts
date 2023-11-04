import { LmTemplate } from "./interfaces";

const templates: Record<string, LmTemplate> = {
  "none": {
    "id": "none",
    "name": "No template",
    "user": "{prompt}",
    "assistant": "",
  },
  "alpaca": {
    "id": "alpaca",
    "name": "Alpaca",
    "system": {
      "schema": "{system}",
      "message": "Below is an instruction that describes a task. Write a response that appropriately completes the request.",
    },
    "user": "### Instruction:\n{prompt}",
    "assistant": "### Response:",
    "linebreaks": {
      "system": 2,
      "user": 2
    }
  },
  "llama": {
    "id": "llama",
    "name": "Llama",
    "system": {
      "schema": "[INST] <<SYS>>\n{system}\n<</SYS>>",
      "message": "You are a helpful, respectful and honest assistant. Always answer as helpfully as possible\n\nIf a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information."
    },
    "user": "{prompt}",
    "assistant": " [/INST] ",
    "linebreaks": {
      "system": 2,
      "user": 0
    },
    "prefix": "<s>",
    "stop": ["</s>"],
  },
  "amazon": {
    "id": "amazon",
    "name": "Amazon",
    "user": "<|prompter|>{prompt}</s>",
    "assistant": "<|assistant|>",
    "afterShot": "\n",
    "stop": ["</s>"],
  },
  "mistral": {
    "id": "mistral",
    "name": "Mistral",
    "user": "[INST] {prompt}",
    "assistant": " [/INST]",
    "stop": ["</s>"],
    "afterShot": "\n",
    "prefix": "<s>",
  },
  "orca": {
    "id": "orca",
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
    },
  },
  "vicuna": {
    "id": "vicuna",
    "name": "Vicuna",
    "user": "USER: {prompt}",
    "assistant": "### ASSISTANT:",
    "linebreaks": {
      "user": 2
    },
  },
  "vicuna_system": {
    "id": "vicuna_system",
    "name": "Vicuna system",
    "system": {
      "schema": "SYSTEM: {system}",
    },
    "user": "USER: {prompt}",
    "assistant": "### ASSISTANT:",
    "linebreaks": {
      "system": 2,
      "user": 2
    },
  },
  "wizard_vicuna": {
    "id": "wizard_vicuna",
    "name": "Wizard Vicuna",
    "user": "### Human:\n{prompt}",
    "assistant": "### ASSISTANT:",
    "linebreaks": {
      "user": 2
    },
    "stop": ["<|endoftext|>"]
  },
  "guanaco": {
    "id": "guanaco",
    "name": "Guanaco",
    "user": "### Human: {prompt}",
    "assistant": "### Assistant:",
    "linebreaks": {
      "user": 1
    },
  },
  "chatml": {
    "id": "chatml",
    "name": "ChatMl",
    "system": {
      "schema": "<|im_start|>system\n{system}\n<|im_end|>",
    },
    "user": "<|im_start|>user\n{prompt}<|im_end|>",
    "assistant": "<|im_start|>assistant",
    "linebreaks": {
      "system": 1,
      "user": 1,
      "assistant": 1,
    },
    "stop": ["<|im_end|>"],
    "afterShot": " <|im_end|>",
  },
  "zephyr": {
    "id": "zephyr",
    "name": "Zephyr",
    "system": {
      "schema": "<|system|>\n{system}</s>",
    },
    "user": "<|user|>\n{prompt}</s>",
    "assistant": "<|assistant|>",
    "linebreaks": {
      "system": 1,
      "user": 1,
      "assistant": 1,
    },
    "afterShot": "\n",
  },
  "synthia-cot": {
    "id": "synthia-cot",
    "name": "Synthia CoT",
    "system": {
      "schema": "SYSTEM: {system}",
      "message": "Elaborate on the topic using a Tree of Thoughts and backtrack when necessary to construct a clear, cohesive Chain of Thought reasoning. Always answer without hesitation."
    },
    "user": "USER: {prompt}",
    "assistant": "ASSISTANT:",
    "linebreaks": {
      "system": 1,
      "user": 1,
    },
  },
  "wizardlm": {
    "id": "wizardlm",
    "name": "WizardLM",
    "system": {
      "schema": "{system}",
      "message": "You are a helpful AI assistant."
    },
    "user": "USER: {prompt}",
    "assistant": "ASSISTANT:",
    "linebreaks": {
      "user": 1
    },
  },
  "human_response": {
    "id": "human_response",
    "name": "Human response",
    "user": "### HUMAN:\n{prompt}",
    "assistant": "### RESPONSE:",
    "linebreaks": {
      "user": 2,
      "assistant": 1
    },
  }
};

export { templates }