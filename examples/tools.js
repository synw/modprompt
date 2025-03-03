#!/usr/bin/env node
import { Lm } from "@locallm/api";
import { PromptTemplate } from "../dist/main.js";

const tool1 = {
    "name": "get_current_weather",
    "description": "Get the current weather",
    "arguments": {
        "location": {
            "description": "The city and state, e.g. San Francisco, CA"
        }
    }
};

const template = new PromptTemplate("granite-tools").addTool(tool1);
const model = "granite3.2:2b-instruct-q8_0";
const prompt = "What is the current weather in London?";

async function main() {
    const lm = new Lm({
        providerType: "ollama",
        serverUrl: "http://localhost:11434",
        onToken: (t) => process.stdout.write(t),
    });
    process.on('SIGINT', () => {
        lm.abort().then(() => process.exit());
    });
    await lm.loadModel(model, 8192);
    console.log("Loaded model", lm.model);
    const _prompt = template.prompt(prompt);
    console.log("\n----------- Turn 1 prompt:");
    console.log(_prompt);
    const res = await lm.infer(_prompt, {
        stream: true,
        temperature: 0.1,
        max_tokens: 1024,
        extra: {
            raw: true
        }
    });
    //return
    template.pushToHistory({
        user: prompt,
        assistant: res.text,
        tool: '{“temp”: 20.5, “unit”: “C”}'
    });
    console.log("\n----------- Turn 2 prompt:");
    const _nextPrompt = template.render();
    console.log(_nextPrompt);
    await lm.infer(_nextPrompt, {
        stream: true,
        temperature: 0.1,
        max_tokens: 1024,
        extra: {
            raw: true
        }
    });
}

(async () => {
    await main();
})();

