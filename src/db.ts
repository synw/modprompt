import { LmTemplate } from "./interfaces";

const templates: Record<string, LmTemplate> = {
  "alpaca": {
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
    "name": "Llama",
    "system": {
      "schema": "<s>[INST] <<SYS>>\n{system}\n<</SYS>>",
      "message": "You are a helpful, respectful and honest assistant. Always answer as helpfully as possible\n\nIf a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information."
    },
    "user": "{prompt}",
    "assistant": " [/INST]",
    "linebreaks": {
      "system": 2,
      "user": 0
    }
  },
  "llama_instruct": {
    "name": "Llama instruct",
    "user": "[INST] {prompt}",
    "assistant": " [/INST]",
    "linebreaks": {
      "user": 1
    },
  },
  "orca": {
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
  },
  "vicuna": {
    "name": "Vicuna",
    "user": "USER: {prompt}",
    "assistant": "### ASSISTANT:",
    "linebreaks": {
      "user": 2
    },
  },
  "wizard_vicuna": {
    "name": "Wizard Vicuna",
    "user": "### Human:\n{prompt}",
    "assistant": "### ASSISTANT:",
    "linebreaks": {
      "user": 2
    },
    "stop": ["<|endoftext|>"]
  },
  "chatml": {
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
    }
  },
};

export { templates }