#!/usr/bin/env node

const { templates, ModTemplate } = require("modprompt");

console.log("Available templates:", Object.keys(templates));
// load template
const tpl = new ModTemplate(templates.llama)
// render the template
console.log(tpl.render())