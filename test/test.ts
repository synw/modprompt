import { templates, PromptTemplate } from "../src/main";

describe('templates', () => {
  it('base', async () => {
    const tpl = new PromptTemplate(templates.alpaca);
    expect(tpl.name).toBe("Alpaca");
    expect(tpl.user).toBe("### Instruction:\n{prompt}");
    expect(tpl.assistant).toBe("### Response:");
  });
  it('system', async () => {
    const tpl = new PromptTemplate(templates.alpaca);
    expect(tpl.system?.schema).toBe("{system}")
    const sysMsg = "Below is an instruction that describes a task. Write a response that appropriately completes the request."
    expect(tpl.system?.message).toBe(sysMsg);
    tpl.afterSystem("AFTER");
    expect(tpl.render()).toContain(sysMsg + "AFTER");
    tpl.replaceSystem("NEW SYS");
    const txt = tpl.render()
    expect(txt).not.toContain(sysMsg);
    expect(txt.startsWith("NEW SYS")).toBeTruthy()
  });
  it('shots', async () => {
    const tpl = new PromptTemplate(templates.human_response);
    tpl.addShot("2+2", "4");
    const txt = `### HUMAN:
2+2

### RESPONSE:
4

### HUMAN:
{prompt}

### RESPONSE:
`
    expect(tpl.render()).toBe(txt);
    const ntpl = tpl.cloneTo("mistral");
    const newtxt = `<s>[INST] 2+2 [/INST]4
[INST] {prompt} [/INST]`;
    expect(ntpl.render()).toBe(newtxt)
  });
});