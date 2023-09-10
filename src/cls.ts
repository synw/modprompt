import { LmTemplate, PromptBlock, TurnBlock, SpacingSlots } from "./interfaces";
import { templates } from "./db.js";

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
    this._systemBlock = this._buildSystemBlock();
  }

  replaceSystem(msg: string): ModTemplate {
    this._systemBlock = this._buildSystemBlock(msg);
    return this
  }

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

  afterAssistant(msg: string): ModTemplate {
    this.assistant = this.assistant + msg;
    return this
  }

  replacePrompt(msg: string): ModTemplate {
    this.user = this.user.replace("{prompt}", msg);
    return this
  }

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
        console.log("Loading", name)
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