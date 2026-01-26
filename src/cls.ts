import type { HistoryTurn, ToolCallSpec, ToolDefSpec, ToolTurn } from "@locallm/types";
import { templates } from "./db.js";
import { LmTags, LmTemplate, LmToolsDef, PromptBlock, SpacingSlots } from "./interfaces.js";
import { routeToolResponseParsing } from "./tools/router.js";
import { extractBetweenTags } from "./utils.js";

/**
 * Represents a modified language model template.
 * 
 * @example
 * const tpl = new PromptTemplate('alpaca');
 */
class PromptTemplate {
  id: string;
  name: string;
  user: string;
  assistant: string;
  history: Array<HistoryTurn> = [];
  toolsDef: LmToolsDef | null = null;
  tools: Array<ToolDefSpec> = [];
  tags: LmTags = {};
  system?: PromptBlock;
  shots?: Array<HistoryTurn>;
  stop?: Array<string>;
  linebreaks?: SpacingSlots;
  afterShot?: string;
  prefix?: string;
  // internal state
  private _extraSystem = "";
  private _extraAssistant = "";
  private _replacePrompt = "";
  private _replaceSystem = "";
  private _toolCallStart: string = "";
  private _toolCallEnd: string | null = null;
  private _toolCallParser: string | null = null;
  private _beforeToolResponse: string | null = null;

  /**
   * Constructs a new `PromptTemplate` instance.
   * 
   * @param template - Either the name of the template to load or an instance of `LmTemplate`.
   * 
   * @example
   * const tpl = new PromptTemplate('alpaca');
   */
  constructor(template: string | LmTemplate) {
    let tpl: LmTemplate
    if (typeof template == "string") {
      tpl = this._load(template);
    } else {
      tpl = template;
    }
    this.id = tpl.id;
    this.name = tpl.name;
    this.user = tpl.user;
    this.assistant = tpl.assistant;
    this.system = tpl?.system;
    this.shots = tpl?.shots;
    this.stop = tpl?.stop;
    this.linebreaks = tpl?.linebreaks;
    this.afterShot = tpl?.afterShot;
    this.prefix = tpl?.prefix;
    if (tpl?.tags) {
      this.tags = tpl?.tags;
    }
    if (tpl?.tools) {
      //console.log("TEMPLATE TOOLS", tpl.tools);
      this.toolsDef = tpl.tools;
      const toolCallStartEnd = this.toolsDef?.call.split("{tools}");
      if (!toolCallStartEnd) {
        throw new Error(`Tool definition malformed in template ${this.name}`)
      }
      if (toolCallStartEnd.length == 0) {
        throw new Error(`Tool definition malformed in template ${this.name}: no start tool call definition`)
      }
      this._toolCallStart = this.tags?.toolCall?.start || "";
      this._toolCallEnd = this.tags?.toolCall?.end || null;
      this._toolCallParser = tpl?.tools?.parser ?? null;
      this._beforeToolResponse = tpl?.tools?.beforeResponse ?? null;
    }
  }

  get hasTools(): boolean {
    return this.tools.length > 0
  }

  /**
 * Render a turn block
 *
 * @param {HistoryTurn} shot the shot to render
 * @returns {string} ther rendered text
 */
  renderShot(shot: HistoryTurn): string {
    const buf = [];
    //console.log("S user", shot.user);
    if (shot?.user) {
      buf.push(this._buildUserBlock(shot.user));
      //buf.push(shot.user)
    }
    //console.log("BS user", this._buildUserBlock(shot.user))
    if (shot?.assistant) {
      let _assistantMsg = shot.assistant;
      if (this.afterShot) {
        _assistantMsg += this.afterShot
      } /*else {
      _assistantMsg += "\n\n"
    }*/
      buf.push(this._buildAssistantBlock(_assistantMsg));
    }
    if (shot?.tools) {
      const resp = this._buildToolsResponse(shot.tools);
      buf.push(resp);
      /*if (this?.linebreaks?.tools) {
        buf.push("\n".repeat(this.linebreaks.tools))
      }*/
    }
    return buf.join("")
  }

  /**
   * Renders the template into a string representation.
   * 
   * @returns The rendered template as a string.
   * 
   * @example
   * const rendered = tpl.render();
   * console.log(rendered);
   */
  render(skip_empty_system: boolean = true): string {
    const buf = new Array<string>();
    // prefix
    if (this.prefix) {
      buf.push(this.prefix)
    }
    const hasSystemTools = this?.toolsDef?.def == "{system}";
    // system prompt if any
    const _systemBlock = this._buildSystemBlock(skip_empty_system, hasSystemTools);
    if (_systemBlock.length > 0) {
      buf.push(_systemBlock);
      if (this?.linebreaks?.system) {
        buf.push("\n".repeat(this.linebreaks.system))
      }
    }
    // tools if any
    if (this.toolsDef && !hasSystemTools) {
      const _toolsBlock = this._buildToolsBlock();
      if (_toolsBlock.length > 0) {
        buf.push(_toolsBlock);
        if (this?.linebreaks?.tools) {
          buf.push("\n".repeat(this.linebreaks.tools))
        }
      }
    }
    // shots if any
    if (this?.shots) {
      for (const shot of this.shots) {
        buf.push(this.renderShot(shot));
      }
    }
    // history
    let isToolResponse = false;
    if (this.history.length > 0) {
      for (const turn of this.history) {
        buf.push(this.renderShot(turn));
      }
      if (this.history[this.history.length - 1]?.tools) {
        isToolResponse = true
      }
    }
    if (!isToolResponse) {
      // user block
      buf.push(this._buildUserBlock());
      // assistant block      
    } else {
      if (this?.linebreaks?.tools) {
        buf.push("\n".repeat(this.linebreaks.tools))
      }
    }
    buf.push(this._buildAssistantBlock());
    //console.log(buf)
    return buf.join("");
  }

  addTool(tool: ToolDefSpec): PromptTemplate {
    if (!this?.toolsDef) {
      throw new Error("This template does not support tools");
    }
    this.tools.push(tool);
    return this;
  }

  processAnswer(answer: string): { isToolCall: boolean; toolsCall: Array<ToolCallSpec>; error?: string } {
    if (!this.hasTools) {
      return { isToolCall: false, toolsCall: [] };
    }
    let isToolCall = false;
    let toolsCall: Array<ToolCallSpec> = [];
    const ans = answer.trim();
    //console.log("\nTC ANSWER", ans);
    //console.log("TC SW", this._toolCallStart + "||", ans.includes(this._toolCallStart));
    if (ans.includes(this._toolCallStart)) {
      isToolCall = true;
      //console.log("TCS", tc);
      let rawTc: string;
      if (ans.startsWith(this._toolCallStart)) {
        rawTc = ans;
      } else {
        const index = ans.indexOf(this._toolCallStart);
        //const answerText = ans.slice(0, index);
        //console.log("Answer text:", answerText);
        rawTc = ans.slice(index);
      }
      let errMsg = "";
      try {
        const tc = routeToolResponseParsing(
          rawTc,
          this._toolCallStart,
          this._toolCallEnd ?? undefined,
          this._toolCallParser ?? undefined
        )
        //const tc = JSON.parse(tcs);
        if (!Array.isArray(tc)) {
          throw new Error(`error parsing tool call response from model: the response object is not an Array:\n${tc}`);
        }
        //console.log("TC", tc)
        toolsCall = tc;
      } catch (e) {
        const buf = new Array<string>();
        buf.push("error parsing tool call from model:");
        buf.push("------------- tool call ---------------");
        buf.push(answer);
        buf.push("----------- parsing error --------------");
        buf.push(`${e}`);
        throw new Error(buf.join("\n"));
      }
      if (errMsg) {
        return { isToolCall: false, toolsCall: [], error: errMsg };
      }
    }
    //console.log("FTC", isToolCall, toolsCall);
    return { isToolCall: isToolCall, toolsCall: toolsCall };
  }

  /*encodeToolResponse(response: any): string {
    if (!this.toolsDef) {
      throw new Error("can not encode tool response: the template has no tools definition")
    }
    if (!this.toolsDef.response.includes("{tools_response}")) {
      throw new Error(`Template ${this.name} has invalid tool response format`);
    }
    const resp = typeof response == "string" ? response : JSON.stringify(response);
    return this.toolsDef.response.replace("{tools_response}", resp)
  }*/

  /**
   * Clones the current `PromptTemplate` instance to a new instance of `PromptTemplate`.
   *
   * This function creates a new `PromptTemplate` instance with the same state as the current instance.
   * It is useful when you want to work with a copy of the current template without modifying the original one.
   *
   * @param {string | LmTemplate} template - The id or template instance of the new `PromptTemplate` to make
   * @param {boolean} keepShots - Keep the shots for the template instance: this will also clone the shots 
   * @returns {PromptTemplate} - A new `PromptTemplate` instance with the same state as the current one.
   *
   * @example
   * const tpl = new PromptTemplate('alpaca');
   * const clonedTpl = tpl.cloneTo('chatml');
   * console.log(clonedTpl);
   */
  cloneTo(template: string | LmTemplate, keepShots: boolean = true): PromptTemplate {
    const tpl = new PromptTemplate(template);
    Object.assign(tpl, this); // Shallow copy all properties

    if (!keepShots) {
      tpl.shots = []; // Clear shots if keepShots is false
    } else {
      tpl.history = this.history.map(h => ({ ...h })); // Deep copy history
    }

    return tpl;
  }

  /**
* Converts the current `PromptTemplate` instance to a JSON object.
*
* This function serializes the current state of the `PromptTemplate` instance into a JSON object,
* which can be used for storing the template or transmitting it over a network.
*
* @returns {LmTemplate} - A JSON object representing the current state of the `PromptTemplate`.
*
* @example
* const tpl = new PromptTemplate('alpaca');
* const json = tpl.toJson();
* console.log(json);
*/
  toJson(): LmTemplate {
    const res: LmTemplate = {
      id: this.id,
      name: this.name,
      user: this.user,
      assistant: this.assistant,
    }
    if (this?.prefix) {
      res.prefix = this.prefix
    }
    if (this?.system) {
      res.system = this.system
    }
    if (this?.shots) {
      res.shots = this.shots
    }
    if (this?.afterShot) {
      res.afterShot = this.afterShot
    }
    if (this?.stop) {
      res.stop = this.stop
    }
    if (this?.linebreaks) {
      res.linebreaks = this.linebreaks
    }
    return res
  }

  /**
   * Replaces the system block with a given message.
   * 
   * @param msg - The message to replace the system block with.
   * @returns A reference to the current `PromptTemplate` instance for chaining.
   * 
   * @example
   * tpl.replaceSystem('You are a javascript expert');
   */
  replaceSystem(msg: string): PromptTemplate {
    if (!this.system) {
      return this
    }
    this._replaceSystem = msg;
    return this
  }

  /**
   * Appends a given message after the system message.
   * 
   * @param msg - The message to append.
   * @returns A reference to the current `PromptTemplate` instance for chaining.
   * 
   * @example
   * tpl.afterSystem('You are a javascript expert');
   */
  afterSystem(msg: string): PromptTemplate {
    if (!this.system) {
      return this
    }
    this._extraSystem = msg;
    return this
  }

  /**
   * Appends a given message after the assistant prompt token.
   * 
   * @param msg - The message to append.
   * @returns A reference to the current `PromptTemplate` instance for chaining.
   * 
   * @example
   * tpl.afterAssistant('( answer in json )');
   */
  afterAssistant(msg: string): PromptTemplate {
    this._extraAssistant = msg;
    return this
  }

  /**
   * Replaces the `{prompt}` placeholder in the user message with a given message.
   * 
   * @param msg - The message to replace the placeholder with.
   * @returns A reference to the current `PromptTemplate` instance for chaining.
   * 
   * @example
   * tpl.replacePrompt(fix this invalid json:\n\n```json\n{prompt}\n```);
   */
  replacePrompt(msg: string): PromptTemplate {
    this._replacePrompt = msg;
    return this
  }

  /**
   * Adds a new shot (a user-assistant interaction) to the template.
   * 
   * @param user - The user's message.
   * @param assistant - The assistant's response.
   * @returns A reference to the current `PromptTemplate` instance for chaining.
   * 
   * @example
   * tpl.addShot('Is it raining?', 'No, it is sunny.');
   */
  addShot(t: HistoryTurn): PromptTemplate {
    if (t.tools && !this.toolsDef) {
      throw new Error("This template does not support tools");
    }
    if (!this.shots) { this.shots = [] };
    this.shots.push(t);
    return this;
  }

  /**
   * Adds multiple shots (user-assistant interactions) to the template.
   *
   * This function allows you to add multiple turns to the conversation. Each turn is represented by an object
   * with a 'user' property (the user's message) and an 'assistant' property (the assistant's response).
   *
   * @param {Array<HistoryTurn>} shots - An array of objects, where each object represents a user-assistant interaction.
   * @returns {PromptTemplate} - A reference to the current `PromptTemplate` instance for chaining.
   *
   * @example
   * const tpl = new PromptTemplate('alpaca');
   * tpl.addShots([
   *   { user: 'What is the weather like?', assistant: 'It is sunny today!' },
   *   { user: 'What is the weather like tomorrow?', assistant: 'I am sorry, but I can\'t predict the future.' }
   * ]);
   */
  addShots(shots: Array<HistoryTurn>): PromptTemplate {
    shots.forEach((s) => this.addShot(s));
    return this
  }

  /**
  * Renders the template with the provided message replacing the `{prompt}` placeholder.
  * 
  * @param msg - The message to use for replacing the `{prompt}` placeholder.
  * @returns The rendered template with the provided message.
  * 
  * @example
  * const prompted = tpl.prompt("list the planets of the solar system");
  * console.log(prompted);
  */
  prompt(msg: string, skip_empty_system: boolean = true): string {
    return this.render(skip_empty_system).replace("{prompt}", msg)
  }

  /**
   * Push a turn into history
   *
   * @param {HistoryTurn} turn the history turn
   * @returns {PromptTemplate}
   */
  pushToHistory(turn: HistoryTurn, extractThinking = true): PromptTemplate {
    if (extractThinking) {
      if (turn?.assistant && this.tags?.think) {
        const tks = turn.assistant.split(this.tags.think.end);
        if (tks.length > 1) {
          turn.think = extractBetweenTags(turn.assistant, this.tags.think.start, this.tags.think.end);
          turn.assistant = tks[1].trim()
        }
      }
    }
    this.history.push(turn)
    return this
  }

  private _buildSystemBlock(skip_empty_system: boolean, systemTools = false): string {
    let res = "";
    if (!this?.system) {
      return "";
    }

    // Combine original system.message with _extraSystem without mutation
    let combinedMessage = this._replaceSystem || (this.system.message || "");
    if (this._extraSystem) {
      combinedMessage += this._extraSystem;
    }

    if (combinedMessage) {
      res = this.system.schema.replace("{system}", combinedMessage);
    } else {
      // Handle cases where system.message is empty but schema still needs to be present
      if (!skip_empty_system) {
        res = this.system.schema.replace("{system}", "");
      }
    }

    if (systemTools && this.tools.length > 0) {
      res = res.replace("{tools}", this._buildToolsBlock(true));
    }

    return res;
  }

  private _buildToolsResponse(toolTurns: Array<ToolTurn>): string {
    if (!this.toolsDef) {
      throw new Error("No tools def in template to build tool response");
    }
    const buf = new Array<string>();
    //console.log("TOOL TURNS", toolTurns);
    for (const tt of toolTurns) {
      buf.push(this.toolsDef.response.replace("{tools_response}", JSON.stringify(tt.response)));
    }
    let tr = buf.join("");
    if (this._beforeToolResponse) {
      tr = this._beforeToolResponse + tr;
    }
    return tr
  }

  private _buildToolsBlock(raw = false): string {
    if (!this.toolsDef) {
      throw new Error(`Can not build tools block: no tools definition found in template`)
    }
    let toolsBlock = "";
    if (this.tools.length == 0) {
      return ""
    }
    const _t = JSON.stringify(this.tools);
    if (raw) {
      return _t
    }
    toolsBlock += this.toolsDef.def.replace("{tools}", _t);
    /*console.log("TB-------");
    console.log(toolsBlock);
    console.log("END------------")*/
    return toolsBlock
  }

  private _buildUserBlock(msg?: string): string {
    let buf = [];
    // prompt replacement
    let _userBlock = this.user;
    if (this._replacePrompt.length > 0) {
      _userBlock = _userBlock.replace("{prompt}", this._replacePrompt)
    }
    buf.push(_userBlock);
    if (this?.linebreaks?.user) {
      buf.push("\n".repeat(this.linebreaks.user))
    }
    if (msg) {
      // this is a shot
      buf[0] = this.user.replace("{prompt}", msg);
    }
    return buf.join("")
  }

  private _buildAssistantBlock(msg?: string): string {
    let txt = "";
    let amsg = this.assistant;
    if (this?.linebreaks?.assistant) {
      amsg += "\n".repeat(this.linebreaks.assistant)
    }
    if (this._extraAssistant.length > 0) {
      amsg += this._extraAssistant
    }
    txt += amsg;
    if (msg) {
      // this is a shot
      txt += msg
    }
    return txt
  }

  private _load(name: string): LmTemplate {
    try {
      if (name in templates) {
        //console.log("Loading", name)
        return templates[name];
      } else {
        throw new Error(`Template ${name} not found`)
      }
    } catch (err) {
      throw new Error(`Error loading template ${name}: ${err}`)
    }
  }
}

export { PromptTemplate };
