#!/usr/bin/env node

const { templates, useTemplate } = require("modprompt");


console.log("Available templates:", Object.keys(templates));
// load template
const tpl = useTemplate(templates.alpaca);
// render the template
console.log(tpl.render())