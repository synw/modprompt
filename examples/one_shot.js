#!/usr/bin/env node

import { PromptTemplate } from "../dist/main.js";

//console.log("Available templates:", Object.keys(templates));
const _prompt = "fix this invalid json:\n\n```json\n{prompt}\n```";
// load template
const tpl = new PromptTemplate("chatml")
  .afterSystem(" You are a javascript specialist")
  .afterAssistant("```json")
  .replacePrompt(_prompt)
  .addShot({
    user: _prompt.replace("{prompt}", "{'a':1,} // comment"),
    assistant: '\n{"a":1}\n```',
  });

// render the template
console.log(tpl.render());
console.log("--------------------------");
console.log(tpl.prompt("[a, 1', null]"));