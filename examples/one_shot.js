#!/usr/bin/env node

const { templates, useTemplate } = require("modprompt");

console.log("Available templates:", Object.keys(templates));
// load template
const tpl = useTemplate(templates.alpaca);
// modify system message
tpl.afterSystem("You are a javascript specialist");
// modify assistant message
tpl.template.assistant = tpl.template.assistant + " (answer in valid json)"
// modify the prompt message
tpl.template.user = tpl.template.user.replace("{prompt}", "fix this invalid json:\n\n```json\n{prompt}\n```")
// add one shot example
tpl.addShot(
  "{'a':1,}",
  //"fix this invalid json:\n\n```json\n{'a':1,}\n```",
  '\n\n```json\n{"a":1}\n```\n',
)
// render the template
console.log(tpl.render())