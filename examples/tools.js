#!/usr/bin/env node
import { Lm } from "@locallm/api";
import { PromptTemplate } from "../dist/main.js";

const template = new PromptTemplate("granite-tools").addTool(weatherToolDef);
const model = "granite3.3:latest";
//const template = new PromptTemplate("chatml-tools").addTool(weatherToolDef);
//const model = "qwen2.5:3b";
//const template = new PromptTemplate("mistral-system-tools").addTool(weatherToolDef);
//const model = "mistral-small:latest";
const prompt = "What is the current weather in London?";

const weatherToolDef = {
    "name": "get_current_weather",
    "description": "Get the current weather",
    "arguments": {
        "location": {
            "description": "The city and state, e.g. San Francisco, CA"
        }
    }
};

function get_current_weather(args) {
    console.log("Running the get_current_weather tool with args", args);
    return '{“temp”: 20.5, “unit”: “C”}'
}

async function main() {
    const lm = new Lm({
        providerType: "ollama",
        serverUrl: "http://localhost:11434",
        onToken: (t) => process.stdout.write(t),
    });
    process.on('SIGINT', () => {
        lm.abort().then(() => process.exit());
    });
    await lm.loadModel(model, 2048);
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
    const { isToolCall, toolsCall, error } = template.processAnswer(res.text);
    if (error) {
        throw new Error(`Error processing tool call answer:\n, ${answer}`);
    }
    if (!isToolCall) {
        return
    }
    let toolResponse = {};
    toolsCall.forEach((tc) => {
        console.log("Executing tool call:", tc);
        if (tc.name == "get_current_weather") {
            toolResponse = get_current_weather(tc.arguments)
        }
    });
    console.log("Tools response", toolResponse);
    //console.log("\nProcessed answer", isToolCall, toolsCall, error);
    //return
    template.pushToHistory({
        user: prompt,
        assistant: res.text,
        tool: toolResponse.toString(),
    });
    console.log("\n----------- Turn 2 prompt:");
    const _nextPrompt = template.render();
    console.log(_nextPrompt);
    console.log("------------\n");
    await lm.infer(_nextPrompt, {
        stream: true,
        temperature: 0.1,
        max_tokens: 1024,
        extra: {
            raw: true
        }
    });
    console.log()
}

(async () => {
    await main();
})();

