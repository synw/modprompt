import { templates } from "./db.js";
import { LmTemplate } from "./interfaces.js";


const useTemplate = (_template?: string | LmTemplate) => {
  let template: LmTemplate = templates.alpaca;
  let _systemBlock = "";
  if (_template) {
    if (typeof _template == "string") {
      load(_template);
    } else {
      template = _template;
      if (template?.system) {
        _systemBlock = _buildSystemBlock();
      }
    }
  }

  function load(name: string) {
    try {
      if (name in templates) {
        console.log("Loading", name)
        template = templates[name];
      } else {
        throw new Error(`Template ${name} not found`)
      }
    } catch (err) {
      throw new Error(`Error loading template ${name}`)
    }
    if (template?.system) {
      _systemBlock = _buildSystemBlock();
    }
  }

  function _buildSystemBlock(systemMsg?: string): string {
    let res = "";
    if (!template?.system) {
      throw new Error(`The template ${template.name} has no system var`)
    }
    if (systemMsg) {
      res = template.system.schema.replace("{system}", systemMsg)
    } else {
      if (template.system?.message) {
        res = template.system.schema.replace("{system}", template.system.message)
      } else {
        res = template.system.schema
      }
    }
    return res
  }

  function _buildUserBlock(msg?: string): string {
    let buf = [];
    buf.push(template.user);
    if (template?.spacing?.user) {
      buf.push(" ".repeat(template.spacing.user))
    }
    if (template?.linebreaks?.user) {
      buf.push("\n".repeat(template.linebreaks.user))
    }
    if (msg) {
      buf[0] = buf[0].replace("{prompt}", msg)
    }
    return buf.join("")
  }

  function _buildAssistantBlock(msg?: string): string {
    let buf = [];
    buf.push(template.assistant);
    if (template?.spacing?.assistant) {
      buf.push(" ".repeat(template.spacing.assistant))
    }
    if (template?.linebreaks?.assistant) {
      buf.push("\n".repeat(template.linebreaks.assistant))
    }
    if (msg) {
      buf[0] = buf[0] + msg + "\n"
    }
    return buf.join("")
  }

  const addShot = (user: string, assistant: string) => {
    if (!template?.shots) {
      template.shots = [];
    }
    template.shots.push({
      user: user,
      assistant: assistant,
    })
  }

  const system = (msg: string) => {
    _systemBlock = _buildSystemBlock(msg)
  }

  const afterSystem = (msg: string) => {
    if (!template.system) {
      throw new Error("This template has no system var")
    }
    if (!template.system?.message) {
      template.system.message = ""
    }
    _systemBlock = _buildSystemBlock(template.system.message + " " + msg)
  }

  const render = (): string => {
    const buf = new Array<string>();
    // system prompt if any
    if (_systemBlock.length > 0) {
      buf.push(_systemBlock);
      if (template?.spacing?.system) {
        buf.push(" ".repeat(template.spacing.system))
      }
      if (template?.linebreaks?.system) {
        buf.push("\n".repeat(template.linebreaks.system))
      }
    }
    // shots
    if (template?.shots) {
      for (const shot of template.shots) {
        buf.push(_buildUserBlock(shot.user));
        buf.push(_buildAssistantBlock(shot.assistant))
      }
    }
    // user block
    buf.push(_buildUserBlock());
    // assistant block
    buf.push(_buildAssistantBlock());
    return buf.join("");
  }

  const prompt = (msg: string): string => {
    return render().replace("{prompt}", msg)
  }

  return {
    template,
    system,
    afterSystem,
    render,
    prompt,
    addShot,
  }
}

export { useTemplate }