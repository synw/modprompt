#!/usr/bin/env node

import { templates, PromptTemplate } from "../dist/main.js";

console.log("Available templates:", Object.keys(templates));
// load template
//const tpl = new PromptTemplate(templates.alpaca)
const tpl = new PromptTemplate("chatml").replaceSystem("new system prompt");
//console.log(tpl)
// render the template
console.log(tpl.render())