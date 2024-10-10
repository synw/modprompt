#!/usr/bin/env node

import { templates, PromptTemplate } from "../dist/main.js";

console.log("Available templates:", Object.keys(templates));
// load template
//const tpl = new PromptTemplate(templates.alpaca)
const tpl = new PromptTemplate(templates.vicuna_system);
// render the template
console.log(`'${tpl.render()}'`)