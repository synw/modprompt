#!/usr/bin/env node
import { Lm } from "@locallm/api";
import { PromptTemplate } from "../dist/main.js";

// Run an Ollama instance with one of these models:

//const model = { name: "granite3.3:2b", template: "granite-tools" };
//const model = { name: "qwen3:0.6b", template: "chatml-tools" };
//const model = { name: "qwen3:1.7b", template: "chatml-tools" };
const model = { name: "qwen3:4b", template: "chatml-tools" };
//const model = { name: "qwen3:8b", template: "chatml-tools" };
//const model = { name: "mistral-small3.1:24b", template: "mistral-system-tools" };

//const prompt = "What is the current weather in London?";
const prompt = `I am landing in Barcelona soon: I plan to reach my hotel and then go for outdoor sport. 
How are the conditions in the city?`;

function get_current_weather(args) {
    console.log("=> Running the get_current_weather tool with args", args);
    return { "temperature": 24, "weather": "sunny" }
}

function get_current_traffic(args) {
    console.log("Running the get_current_traffic tool with args", args);
    return { "trafic": "heavy" }
}

const tools = {
    get_current_weather: {
        "name": "get_current_weather",
        "description": "Get the current weather",
        "arguments": {
            "location": {
                "description": "The city and state, e.g. San Francisco, CA"
            }
        },
        execute: (args) => get_current_weather(args)
    },
    get_current_traffic: {
        "name": "get_current_traffic",
        "description": "Get the current road traffic conditions",
        "arguments": {
            "location": {
                "description": "The city and state, e.g. San Francisco, CA"
            }
        },
        "execute": get_current_traffic,
    }
};

async function main() {
    const template = new PromptTemplate(model.template)
        .addTool(tools.get_current_weather)
        .addTool(tools.get_current_traffic);
    const lm = new Lm({
        providerType: "ollama",
        serverUrl: "http://localhost:11434",
        onToken: (t) => process.stdout.write(t),
    });
    process.on('SIGINT', () => {
        lm.abort().then(() => process.exit());
    });
    await lm.loadModel(model.name, 4096);
    console.log("Loaded model", lm.model);
    const _prompt = template.prompt(prompt);
    console.log("\n----------- Turn 1 prompt:");
    console.log(_prompt);
    const res = await lm.infer(_prompt, {
        stream: true,
        temperature: 0.1,
        max_tokens: 2048,
        extra: {
            raw: true
        }
    });
    const { isToolCall, toolsCall, error } = template.processAnswer(res.text);
    if (error) {
        throw new Error(`Error processing tool call answer:\n, ${answer}`);
    }
    if (!isToolCall) {
        console.log("no tools called")
        return
    }
    const toolsUsed = {};
    toolsCall.forEach((tc) => {
        console.log("\n> Executing tool call:", tc);
        const tresp = tools[tc.name].execute(tc.arguments);
        toolsUsed[tc.name] = {
            call: tc,
            response: tresp,
        };
        console.log("> Tool response", tresp);
    });
    template.pushToHistory({
        user: prompt,
        assistant: res.text,
        tools: toolsUsed,
    });
    console.log("\n----------- Turn 2 prompt:");
    const _nextPrompt = template.prompt();
    console.log(_nextPrompt);
    console.log("------------\n");
    const res2 = await lm.infer(_nextPrompt, {
        stream: true,
        temperature: 0.1,
        max_tokens: 1024,
        extra: {
            raw: true
        }
    });
    template.pushToHistory({
        assistant: res2.text,
    });
    console.log("\n\n----------- Template history:");
    console.log(JSON.stringify(template.history, null, "  "));
    console.log()
    console.log("\n----------- Final template:");
    console.log(template.render());
}

(async () => {
    await main();
})();

