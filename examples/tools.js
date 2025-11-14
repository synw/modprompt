#!/usr/bin/env node
import { Lm } from "@locallm/api";
import { PromptTemplate } from "../dist/main.js";

const templateName = "chatml-tools";
const prompt = `I am landing in Barcelona soon: I plan to reach my hotel and then go for outdoor sport. 
How are the conditions in the city? Use your tools to get weather and traffic information.`;
const model = "qwen4b";

const tools = {
    get_current_weather: {
        "name": "get_current_weather",
        "description": "Get the current weather",
        "arguments": {
            "location": {
                "description": "The city and state, e.g. San Francisco, CA"
            }
        },
        execute: (args) => { return { "temperature": 24, "weather": "sunny" } }
    },
    get_current_traffic: {
        "name": "get_current_traffic",
        "description": "Get the current road traffic conditions",
        "arguments": {
            "location": {
                "description": "The city and state, e.g. San Francisco, CA"
            }
        },
        execute: (args) => { return { "trafic": "heavy" } }
    }
};

const lm = new Lm({
    providerType: "llamacpp",
    serverUrl: "http://localhost:8080",
    onToken: (t) => process.stdout.write(t),
});

async function main()
{
    const template = new PromptTemplate(templateName)
        .addTool(tools.get_current_weather)
        .addTool(tools.get_current_traffic)
        .afterSystem("\nYou are a touristic AI assistant");
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
    }, { debug: true });
    console.log("Processing answer ...");
    const { isToolCall, toolsCall, error } = template.processAnswer(res.text);
    console.log("Tool call:", isToolCall);
    if (error) {
        throw new Error(`Error processing tool call answer:\n, ${answer}`);
    }
    if (!isToolCall) {
        console.log("no tools called")
        return
    }
    const toolsUsed = [];
    toolsCall.forEach((tc) =>
    {
        console.log("\n> Executing tool call:", tc);
        const tresp = tools[tc.name].execute(tc.arguments);
        toolsUsed.push({
            call: tc,
            response: tresp,
        });
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
        model: { name: model },
    }, { debug: true });
    template.pushToHistory({
        assistant: res2.text,
    });
    console.log("\n\n----------- Template history:");
    console.log(JSON.stringify(template.history, null, "  "));
    console.log()
    console.log("\n----------- Final template:");
    console.log(template.render());
}

(async () =>
{
    await main();
})();

