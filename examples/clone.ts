#!/usr/bin/env node

import { templates, PromptTemplate } from "../src/main.js";

console.log("Available templates:", Object.keys(templates));
// load template
const tpl = new PromptTemplate(templates.alpaca)
  .afterSystem("You are a javascript specialist")
  .afterAssistant(" (answer in valid json)")
  .replacePrompt("fix this invalid json:\n\n```json\n{prompt}\n```")
  .addShot(
    "{'a':1,}",
    '\n\n```json\n{"a":1}\n```\n',
  );


// render the template
console.log(tpl.render());

// clone
console.log("Cloning the template to Orca format:\n\n");
const ntpl = tpl.cloneTo("orca");
console.log(ntpl.render())