#!/usr/bin/env node

import { templates, ModTemplate } from "modprompt";

console.log("Available templates:", Object.keys(templates));
// load template
const tpl = new ModTemplate(templates.llama)
// render the template
console.log(tpl.render())