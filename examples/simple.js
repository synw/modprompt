#!/usr/bin/env node

import { templates, ModelTemplate } from "modprompt";

console.log("Available templates:", Object.keys(templates));
// load template
const tpl = new ModelTemplate(templates.llama)
// render the template
console.log(tpl.render())