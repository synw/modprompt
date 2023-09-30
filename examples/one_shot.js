#!/usr/bin/env node

import { templates } from "modprompt";

console.log("Available templates:", Object.keys(templates));
// load template
const tpl = new ModTemplate(templates.alpaca)
  .afterSystem("You are a javascript specialist")
  .afterAssistant(" (answer in valid json)")
  .replacePrompt("fix this invalid json:\n\n```json\n{prompt}\n```")
  .addShot(
    "{'a':1,}",
    '\n\n```json\n{"a":1}\n```\n',
  );


// render the template
console.log(tpl.render())