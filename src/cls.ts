import { LmTemplate, PromptBlock, TurnBlock, SpacingSlots, HistoryTurn, LmToolsDef, ToolSpec } from "./interfaces.js";
import { templates } from "./db.js";

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
  tools: Array<ToolSpec> = [];
  system?: PromptBlock;
  shots?: Array<TurnBlock>;
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
    this.system = tpl.system;
    this.shots = tpl.shots;
    this.stop = tpl.stop;
    this.linebreaks = tpl.linebreaks;
    this.afterShot = tpl.afterShot;
    this.prefix = tpl.prefix;
    if (tpl?.tools) {
      this.toolsDef = tpl.tools;
      const toolCallStartEnd = this.toolsDef?.call.split("{tools}");
      if (!toolCallStartEnd) {
        throw new Error(`Tool definition malformed in template ${this.name}`)
      }
      if (toolCallStartEnd.length == 0) {
        throw new Error(`Tool definition malformed in template ${this.name}: no start tool call definition`)
      }
      this._toolCallStart = toolCallStartEnd[0];
      if (toolCallStartEnd.length > 1) {
        this._toolCallEnd = toolCallStartEnd[1]
      }
    }
  }

  get hasTools(): boolean {
    return this.tools.length > 0
  }

  addTool(tool: ToolSpec): PromptTemplate {
    if (!this?.toolsDef) {
      throw new Error("This template does not support tools");
    }
    this.tools.push(tool);
    return this;
  }

  processAnswer(answer: string): { isToolCall: boolean; toolsCall: Array<Record<string, any>>; error?: string } {
    if (!this.hasTools) {
      return { isToolCall: false, toolsCall: [] };
    }
    let isToolCall = false;
    let toolsCall = new Array<Record<string, any>>();
    const ans = answer.trim();
    //console.log("\nTC ANSWER", ans);
    //console.log("TC SW", this._toolCallStart, ans.startsWith(this._toolCallStart));
    if (ans.startsWith(this._toolCallStart)) {
      isToolCall = true;
      let tcs = this._parseToolCallString(answer).trim();
      //console.log("TCS", tcs);
      let errMsg = "";
      try {
        const tc = JSON.parse(tcs);
        if (!Array.isArray(tc)) {
          errMsg = `error parsing tool call response from model: the response object is not an Array:\n${answer}`;
          console.log(errMsg)
        }
        //console.log("TC", tc)
        toolsCall = tc;
      } catch (e) {
        errMsg = `error parsing tool call response from model:\n${answer}`;
        console.log(errMsg)
      }
      if (errMsg) {
        return { isToolCall: false, toolsCall: [], error: errMsg };
      }
    }
    //console.log("FTC", isToolCall, toolsCall);
    return { isToolCall: isToolCall, toolsCall: toolsCall };
  }

  encodeToolResponse(response: any): string {
    if (!this.toolsDef) {
      throw new Error("can not encode tool response: the template has no tools definition")
    }
    return this.toolsDef.response.replace("{tools_response}", `${response}`)
  }

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
    if (keepShots) {
      if (this?.shots) {
        this.shots.forEach((s) => {
          tpl.addShot(s.user, s.assistant)
        })
      }
    }
    if (this._extraSystem.length > 0) {
      tpl.afterSystem(this._extraSystem)
    }
    if (this._replaceSystem.length > 0) {
      tpl.replaceSystem(this._replaceSystem)
    }
    if (this._extraAssistant.length > 0) {
      tpl.afterAssistant(this._extraAssistant)
    }
    if (this._replacePrompt.length > 0) {
      tpl.replacePrompt(this._replacePrompt)
    }
    return tpl
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
  addShot(user: string, assistant: string, tool?: string): PromptTemplate {
    if (tool && !this.toolsDef) {
      throw new Error("This template does not support tools");
    }
    if (!this.shots) { this.shots = [] };
    this.shots.push({ user, assistant, tool });
    return this;
  }

  /**
   * Adds multiple shots (user-assistant interactions) to the template.
   *
   * This function allows you to add multiple turns to the conversation. Each turn is represented by an object
   * with a 'user' property (the user's message) and an 'assistant' property (the assistant's response).
   *
   * @param {Array<TurnBlock>} shots - An array of objects, where each object represents a user-assistant interaction.
   * @returns {PromptTemplate} - A reference to the current `PromptTemplate` instance for chaining.
   *
   * @example
   * const tpl = new PromptTemplate('alpaca');
   * tpl.addShots([
   *   { user: 'What is the weather like?', assistant: 'It is sunny today!' },
   *   { user: 'What is the weather like tomorrow?', assistant: 'I am sorry, but I can\'t predict the future.' }
   * ]);
   */
  addShots(shots: Array<TurnBlock>): PromptTemplate {
    shots.forEach((s) => this.addShot(s.user, s.assistant));
    return this
  }

  /**
   * Render a turn block
   *
   * @param {TurnBlock | HistoryTurn} shot the shot to render
   * @returns {string} ther rendered text
   */
  renderShot(shot: TurnBlock | HistoryTurn): string {
    const buf = [];
    //console.log("S user", shot.user);
    buf.push(this._buildUserBlock(shot.user));
    //console.log("BS user", this._buildUserBlock(shot.user))
    let _assistantMsg = shot.assistant;
    if (this.afterShot) {
      _assistantMsg += this.afterShot
    } /*else {
      _assistantMsg += "\n\n"
    }*/
    buf.push(this._buildAssistantBlock(_assistantMsg));
    if (shot?.tool) {
      buf.push(this._buildToolResponse(shot.tool));
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
      if (this.history[this.history.length - 1]?.tool) {
        isToolResponse = true
      }
    }
    if (!isToolResponse) {
      // user block
      buf.push(this._buildUserBlock());
      // assistant block      
    }
    buf.push(this._buildAssistantBlock());
    //console.log(buf)
    return buf.join("");
  }

  /**
  * Renders the template with the provided message replacing the `{prompt}` placeholder.
  * 
  * @param msg - The message to use for replacing the `{prompt}` placeholder.
  * @returns The rendered template with the provided message.
  * 
  * @example
  * const prompted = tpl.prompt("list the planets in the solar system");
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
  pushToHistory(turn: HistoryTurn): PromptTemplate {
    this.history.push(turn)
    return this
  }

  private _buildSystemBlock(skip_empty_system: boolean, systemTools = false): string {
    let res = "";
    if (!this?.system) {
      return ""
    }
    if (this._replaceSystem.length > 0) {
      this.system.message = this._replaceSystem;
    }
    //console.log("SYS MSG", this.system?.message);
    if (this.system?.message) {
      if (this._extraSystem.length > 0) {
        this.system.message = this.system.message + this._extraSystem
      }
      //console.log("ES M", this.s);
      res = this.system.schema.replace("{system}", this.system.message);
    } else {
      //console.log("NO SYS MSG");
      if (this._extraSystem.length > 0) {
        //console.log("EXTRA SYS", this._extraSystem);
        //console.log("SYS SCHEMA", this.system.schema);
        res = this.system.schema.replace("{system}", this._extraSystem);
        //console.log("TMP SYS RES", res);
      }
    }
    //console.log("SYS RES", res);
    if (res == "") {
      if (!skip_empty_system) {
        res = this.system.schema;
      }
    }
    if (systemTools && this.tools.length > 0) {
      res = res.replace("{tools}", this._buildToolsBlock(true))
    }
    return res
  }

  private _buildToolResponse(txt: string): string {
    if (!this.toolsDef) {
      throw new Error("No tools def in template to build tool response");
    }
    return this.toolsDef.response.replace("{tools_response}", txt)
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
      //buf[0] = _userBlock.replace("{prompt}", msg);
      buf[0] = this.user.replace("{prompt}", msg);
    }
    return buf.join("")
  }

  private _buildAssistantBlock(msg?: string): string {
    let buf = [];
    let amsg = this.assistant;
    if (this?.linebreaks?.assistant) {
      amsg += "\n".repeat(this.linebreaks.assistant)
    }
    if (this._extraAssistant.length > 0) {
      amsg += this._extraAssistant
    }
    buf.push(amsg);
    if (msg) {
      // this is a shot
      buf.push(msg)
    }
    return buf.join("")
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

  private _parseToolCallString(raw: string): string {
    let call = raw.replace(this._toolCallStart, "");
    if (this._toolCallEnd) {
      call = call.replace(this._toolCallEnd, "");
    }
    return call
  }
}

export { PromptTemplate }