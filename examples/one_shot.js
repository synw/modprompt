#!/usr/bin/env node

//import { templates, PromptTemplate } from "modprompt";
import { templates, PromptTemplate } from "../dist/main.js";

//console.log("Available templates:", Object.keys(templates));
const _prompt = "fix this invalid json:\n\n```json\n{prompt}\n```";
// load template
const tpl = new PromptTemplate(templates.phi4)
  .replaceSystem("You are a javascript specialist")
  .afterAssistant("```json")
  .replacePrompt(_prompt)
  .addShot(
    _prompt.replace("{prompt}", "{'a':1,}"),
    '\n{"a":1}\n```',
  );

// render the template
console.log(tpl.render())