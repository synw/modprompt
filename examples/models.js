#!/usr/bin/env node
import { Lm } from "@locallm/api";
import { PromptTemplate } from "../dist/main.js";

const templateName = "gptoss";
const prompt = `List the planets of the solar system`;
const model = "oss20b";

const lm = new Lm({
    providerType: "llamacpp",
    serverUrl: "http://localhost:8080",
    onToken: (t) => process.stdout.write(t),
});

async function main()
{
    const template = new PromptTemplate(templateName);
    process.on('SIGINT', () =>
    {
        lm.abort().then(() => process.exit());
    });
    const _prompt = template.prompt(prompt);
    console.log("\n----------- Turn 1 prompt:");
    console.log(_prompt);
    console.log("----------------------------");
    console.log("Ingesting prompt ...\n");
    const res = await lm.infer(_prompt, {
        stream: true,
        temperature: 0.3,
        max_tokens: 4096,
        model: { name: model },
    });
}

(async () =>
{
    await main();
})();