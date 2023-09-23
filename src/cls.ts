import { LmTemplate, PromptBlock, TurnBlock, SpacingSlots } from "./interfaces";
import { templates } from "./db.js";

/**
 * Represents a modified language model template.
 * 
 * @example
 * const tpl = new ModTemplate('alpaca');
 */
class ModTemplate implements LmTemplate {
  name: string;
  user: string;
  assistant: string;
  system?: PromptBlock;
  shots?: Array<TurnBlock>;
  stop?: Array<string>;
  linebreaks?: SpacingSlots;
  spacing?: SpacingSlots;
  // internal state
  private _systemBlock = "";

  /**
   * Constructs a new `ModTemplate` instance.
   * 
   * @param template - Either the name of the template to load or an instance of `LmTemplate`.
   * 
   * @example
   * const tpl = new ModTemplate('alpaca');
   */
  constructor(template: string | LmTemplate) {
    let tpl: LmTemplate
    if (typeof template == "string") {
      tpl = this._load(template);
    } else {
      tpl = template;
    }
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
    if (tpl?.system) {
      this._systemBlock = this._buildSystemBlock();
    }
  }

  /**
   * Replaces the system block with a given message.
   * 
   * @param msg - The message to replace the system block with.
   * @returns A reference to the current `ModTemplate` instance for chaining.
   * 
   * @example
   * tpl.replaceSystem('You are a javascript expert');
   */
  replaceSystem(msg: string): ModTemplate {
    this._systemBlock = this._buildSystemBlock(msg);
    return this
  }

  /**
   * Appends a given message after the system message.
   * 
   * @param msg - The message to append.
   * @returns A reference to the current `ModTemplate` instance for chaining.
   * 
   * @example
   * tpl.afterSystem('You are a javascript expert');
   */
  afterSystem(msg: string): ModTemplate {
    if (!this.system) {
      throw new Error("This template has no system var")
    }
    if (!this.system?.message) {
      this.system.message = ""
    }
    this._systemBlock = this._buildSystemBlock(this.system.message + " " + msg);
    return this
  }

  /**
   * Appends a given message after the assistant prompt token.
   * 
   * @param msg - The message to append.
   * @returns A reference to the current `ModTemplate` instance for chaining.
   * 
   * @example
   * tpl.afterAssistant('. Have a great day!');
   */
  afterAssistant(msg: string): ModTemplate {
    this.assistant = this.assistant + msg;
    return this
  }

  /**
   * Replaces the `{prompt}` placeholder in the user message with a given message.
   * 
   * @param msg - The message to replace the placeholder with.
   * @returns A reference to the current `ModTemplate` instance for chaining.
   * 
   * @example
   * tpl.replacePrompt(fix this invalid json:\n\n```json\n{prompt}\n```);
   */
  replacePrompt(msg: string): ModTemplate {
    this.user = this.user.replace("{prompt}", msg);
    return this
  }

  /**
   * Adds a new shot (a user-assistant interaction) to the template.
   * 
   * @param user - The user's message.
   * @param assistant - The assistant's response.
   * @returns A reference to the current `ModTemplate` instance for chaining.
   * 
   * @example
   * tpl.addShot('Is it raining?', 'No, it is sunny.');
   */
  addShot(user: string, assistant: string): ModTemplate {
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
    if (this._systemBlock.length > 0) {
      buf.push(this._systemBlock);
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


  private _buildSystemBlock(systemMsg?: string): string {
    let res = "";
    if (!this?.system) {
      throw new Error(`The template ${this.name} has no system var`)
    }
    if (systemMsg) {
      res = this.system.schema.replace("{system}", systemMsg)
    } else {
      if (this.system?.message) {
        res = this.system.schema.replace("{system}", this.system.message)
      } else {
        res = this.system.schema
      }
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
    buf.push(this.assistant);
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
      throw new Error(`Error loading template ${name}`)
    }
  }
}

export { ModTemplate }