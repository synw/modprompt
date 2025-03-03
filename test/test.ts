
import { templates, PromptTemplate, TurnBlock } from "../src/main";

describe('templates', () => {
  it('base', async () => {
    const tpl = new PromptTemplate(templates.alpaca);
    expect(tpl.name).toBe("Alpaca");
    expect(tpl.user).toBe("### Instruction:\n{prompt}");
    expect(tpl.assistant).toBe("### Response:");
  });

  it('system', async () => {
    const tpl = new PromptTemplate(templates.alpaca);
    expect(tpl.system?.schema).toBe("{system}");
    const sysMsg = "Below is an instruction that describes a task. Write a response that appropriately completes the request.";
    expect(tpl.system?.message).toBe(sysMsg);
    tpl.afterSystem("AFTER");
    expect(tpl.render()).toContain(sysMsg + "AFTER");
    tpl.replaceSystem("NEW SYS");
    const txt = tpl.render();
    expect(txt).not.toContain(sysMsg);
    expect(txt.startsWith("NEW SYS")).toBeTruthy();
  });

  it('shots', async () => {
    const tpl = new PromptTemplate(templates.vicuna);
    tpl.addShot("2+2", "4");
    /*const txt = `USER:
2+2

### ASSISTANT:
4

USER:
{prompt}

### ASSISTANT:
`;
    expect(tpl.render()).toBe(txt);*/
    const ntpl = tpl.cloneTo("mistral");
    const newtxt = `[INST] 2+2 [/INST]4
[INST] {prompt} [/INST]`;
    expect(ntpl.render()).toBe(newtxt);
  });

  it('toJson', async () => {
    const tpl = new PromptTemplate(templates.alpaca);
    const json = tpl.toJson();
    expect(json.id).toBe("alpaca");
    expect(json.name).toBe("Alpaca");
    expect(json.user).toBe("### Instruction:\n{prompt}");
    expect(json.assistant).toBe("### Response:");
  });

  it('prompt', async () => {
    const tpl = new PromptTemplate(templates.mistral);
    const prompted = tpl.prompt("list the planets in the solar system");
    expect(prompted).toBe("[INST] list the planets in the solar system [/INST]");
  });

  it('pushToHistory', async () => {
    const tpl = new PromptTemplate(templates.alpaca);
    tpl.pushToHistory({ user: "What's the weather like?", assistant: "It's sunny today!" });
    expect(tpl.history).toEqual([
      { user: "What's the weather like?", assistant: "It's sunny today!" }
    ]);
  });

  it('renderShot', async () => {
    const tpl = new PromptTemplate(templates.alpaca);
    const shot: TurnBlock = { user: "What's the weather like?", assistant: "It's sunny today!" };
    const rendered = tpl.renderShot(shot);
    expect(rendered).toContain("### Instruction:\nWhat's the weather like?\n\n### Response:It's sunny today!");
  });

  /*it('render with different scenarios', async () => {
    const tpl = new PromptTemplate(templates.mistral);
    tpl.afterAssistant("( answer in json )");
    tpl.addShot("2+2", "4");
    tpl.replacePrompt("fix this invalid json:\n\n```json\n{prompt}\n```");
    const rendered = tpl.render();
    expect(rendered).toContain("fix this invalid json:\n\n```json\n2+2\n```");
    expect(rendered).toContain("4\n\n( answer in json )");
  });*/
});