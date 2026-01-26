#!/usr/bin/env node
import { Lm } from "@locallm/api";
import { PromptTemplate } from "../dist/main.js";

const templateName = "chatml";
const prompt = "List the planets of the solar system";
const prompt2 = "Sort the planets by mass";
const model = "qwen4b";

const lm = new Lm({
    providerType: "llamacpp",
    serverUrl: "http://localhost:8080",
    onToken: (t) => process.stdout.write(t),
});

async function main ()
{
    const template = new PromptTemplate(templateName);
    process.on('SIGINT', () => lm.abort().then(() => process.exit()));
    const _prompt = template.prompt(prompt);
    const options = { debug: true };
    console.log("\n----------- Turn 1 prompt:");
    console.log(_prompt);
    console.log("----------------------------");
    console.log("Ingesting prompt ...\n");
    const res = await lm.infer(_prompt, {
        stream: true,
        temperature: 0.3,
        model: { name: model },
    }, options);
    template.pushToHistory({ user: prompt, assistant: res.text });
    const _prompt2 = template.prompt(prompt2);
    console.log("\n----------- Turn 2 prompt:");
    console.log(_prompt2);
    console.log("----------------------------");
    const res2 = await lm.infer(_prompt2, {
        stream: true,
        temperature: 0.3,
        model: { name: model },
    }, options);
    template.pushToHistory({ user: prompt2, assistant: res2.text });
    console.log(template.render());
    console.log("--------- History ---------");
    console.log("Template history:", template.history);
}

(async () =>
{
    await main();
})();