import { LmTemplate, PromptBlock, TurnBlock, SpacingSlots } from "./interfaces";
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
  system?: PromptBlock;
  shots?: Array<TurnBlock>;
  stop?: Array<string>;
  linebreaks?: SpacingSlots;
  // internal state
  _extraSystem = "";
  _extraAssistant = "";

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
    if (tpl?.system) {
      this.system = tpl.system
    }
    if (tpl?.shots) {
      this.shots = tpl.shots
    }
    if (tpl?.stop) {
      this.stop = tpl.stop
    }
    if (tpl?.linebreaks) {
      this.linebreaks = tpl.linebreaks
    }
  }

  cloneTo(name: string): PromptTemplate {
    const tpl = new PromptTemplate(name);
    if (this?.system) {
      tpl.system = this.system
    }
    if (this?.shots) {
      tpl.shots = this.shots
    }
    if (this?.stop) {
      tpl.stop = this.stop
    }
    if (this?.linebreaks) {
      tpl.linebreaks = this.linebreaks
    }
    if (this._extraSystem.length > 0) {
      tpl.afterSystem(this._extraSystem)
    }
    if (this._extraAssistant.length > 0) {
      tpl.afterAssistant(this._extraAssistant)
    }
    tpl.user = this.user
    return tpl
  }

  toJson(): LmTemplate {
    const res: LmTemplate = {
      id: this.id,
      name: this.name,
      user: this.user,
      assistant: this.assistant,
    }
    if (this?.system) {
      this.system = this.system
    }
    if (this?.shots) {
      this.shots = this.shots
    }
    if (this?.stop) {
      this.stop = this.stop
    }
    if (this?.linebreaks) {
      this.linebreaks = this.linebreaks
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
    this.system.message = msg;
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
    if (!this.system?.message) {
      this.system.message = ""
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
    this.user = this.user.replace("{prompt}", msg);
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
  addShot(user: string, assistant: string): PromptTemplate {
    if (!this?.shots) {
      this.shots = [];
    }
    this.shots.push({
      user: user,
      assistant: assistant,
    });
    return this
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
  render(): string {
    const buf = new Array<string>();
    // system prompt if any
    const _systemBlock = this._buildSystemBlock();
    if (_systemBlock.length > 0) {
      buf.push(_systemBlock);
      if (this?.linebreaks?.system) {
        buf.push("\n".repeat(this.linebreaks.system))
      }
    }
    // shots
    if (this?.shots) {
      for (const shot of this.shots) {
        buf.push(this._buildUserBlock(shot.user));
        buf.push(this._buildAssistantBlock(shot.assistant))
      }
    }
    // user block
    buf.push(this._buildUserBlock());
    // assistant block
    buf.push(this._buildAssistantBlock());
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
  prompt(msg: string): string {
    return this.render().replace("{prompt}", msg)
  }


  private _buildSystemBlock(): string {
    let res = "";
    if (!this?.system) {
      return ""
    }
    if (this.system?.message) {
      res = this.system.schema.replace("{system}", this.system.message)
    } else {
      res = this.system.schema.replace("{system}", "")
    }
    if (this._extraSystem) {
      res = res + this._extraSystem
    }
    return res
  }

  private _buildUserBlock(msg?: string): string {
    let buf = [];
    buf.push(this.user);
    if (this?.linebreaks?.user) {
      buf.push("\n".repeat(this.linebreaks.user))
    }
    if (msg) {
      buf[0] = buf[0].replace("{prompt}", msg)
    }
    return buf.join("")
  }

  private _buildAssistantBlock(msg?: string): string {
    let buf = [];
    let amsg = this.assistant;
    if (this._extraAssistant.length > 0) {
      amsg += this._extraAssistant
    }
    buf.push(amsg);
    if (this?.linebreaks?.assistant) {
      buf.push("\n".repeat(this.linebreaks.assistant))
    }
    if (msg) {
      buf[0] = buf[0] + msg + "\n"
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
}

export { PromptTemplate }