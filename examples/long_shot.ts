#!/usr/bin/env node

import { PromptTemplate } from "../src/main.js";

const baseprompt = `in Python create a detailed and helpful Numpy style \
docstrings for this code:

\`\`\`python
{prompt}
\`\`\`

Important: always provide an example at the end of the docstring. Use a maximum \
line length of 88 characters. Output only the docstring.`;

const shotUser = `def add(a: float, b: float) -> float:
  return a + b`;
const shotAssistant = `\n\`\`\`python
"""Sum two numbers.

Parameters
----------
a : \`float\`
    The first number to add.
b : \`float\`
  The second number to add.

Returns
-------
sum : \`float\`
    The sum of \`\`a\`\` and \`\`b\`\`.

Example
-------
>>> add(5, 5)
10
"""
\`\`\``;

const template = new PromptTemplate("alpaca")
  .afterSystem("You are a Python expert")
  .replacePrompt(baseprompt)
  .addShot(shotUser, shotAssistant);
const prompt = `class Dog:
  kingdom = "Animalia"
  species = "Canis lupus"
  name: str
  age: int

  def __init__(self, name: str, age: int):
      self.name = name
      self.age = age`;

console.log("--------------------------");
console.log("       Alpaca");
console.log("--------------------------");
console.log(template.render());

console.log("--------------------------");
console.log("       Mistral");
console.log("--------------------------");
const tpl1 = template.cloneTo("mistral");
console.log(tpl1.render())

console.log("--------------------------");
console.log("       ChatMl");
console.log("--------------------------");
const tpl = template.cloneTo("chatml");
console.log(tpl.render())