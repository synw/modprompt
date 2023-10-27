#!/usr/bin/env node

import { templates, PromptTemplate } from "../src/main.js";

console.log("Available templates:", Object.keys(templates));
// load template
//const tpl = new PromptTemplate(templates.alpaca)
const tpl = new PromptTemplate(templates.mistral);
tpl.addShot("2+2", "4");
// render the template
console.log(`'${tpl.render()}'`)