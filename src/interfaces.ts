/**
 * Defines the spacing (in terms of line breaks) to be applied between different parts of the conversation.
 *
 * @interface SpacingSlots
 * @typedef {SpacingSlots}
 * 
 * @example
 * const spacingExample: SpacingSlots = {
 *   system: 2,
 *   user: 1,
 *   assistant: 1
 * };
 */
interface SpacingSlots {
  /**
   * Number of line breaks to be applied after the system message.
   */
  system?: number;

  /**
   * Number of line breaks to be applied after the user message.
   */
  user?: number;

  /**
   * Number of line breaks to be applied after the assistant message.
   */
  assistant?: number;
  tools?: number;
}

/**
 * Represents a block of system-level prompts or instructions in the conversation.
 * 
 * @example
 * const promptExample: PromptBlock = {
 *   schema: '### System: {system}',
 *   message: 'Some system message'
 * };
 */
interface PromptBlock {
  /**
   * The schema or format for the system message.
   * 
   * Can include placeholders like `{system}` which can be programmatically replaced with actual messages later.
   */
  schema: string;

  /**
   * Optional default message content for the system. 
   * 
   * Used if a dynamic value isn't provided for `{system}` placeholder.
   */
  message?: string;
}

/**
 * Represents a single turn in a conversation, consisting of a user message followed by an assistant response.
 * 
 * @example
 * const turnExample: TurnBlock = {
 *   user: 'What's the weather like?',
 *   assistant: 'It's sunny today!'
 * };
 */
interface TurnBlock {
  /**
   * The message content from the user.
   */
  user: string;

  /**
   * The corresponding response from the assistant.
   */
  assistant: string;
  tool?: string;
}

interface LmToolsDef {
  def: string;
  call: string;
  response: string;
}

/**
 * Represents a template for language modeling, detailing the structure and interaction elements of a conversation.
 * 
 * @example
 * const sampleTemplate: LmTemplate = {
 *  id: "alapaca",
 *  name: "Alpaca",
 *  system: {
 *    schema: "{system}",
 *    message: "Below is an instruction that describes a task. Write a response that appropriately completes the request.",
 *  },
 *  user: "### Instruction:\n{prompt}",
 *  assistant: "### Response:",
 *   linebreaks: {
 *     system: 2,
 *     user: 2,
 *   }
 * };
 */
interface LmTemplate {
  /**
   * The id slug of the template.
   */
  id: string;
  /**
   * The name of the template.
   */
  name: string;

  /**
   * The default message template for the user.
   * 
   * Includes a `{prompt}` placeholder which can be programmatically replaced later.
   */
  user: string;

  /**
   * The default message template for the assistant.
   */
  assistant: string;

  /**
   * Optional prompt block that represents system-level messages or instructions.
   */
  system?: PromptBlock;

  /**
   * Optional array of turn blocks representing back-and-forths between the user and the assistant.
   * 
   * Useful for simulating multi-turn interactions.
   */
  shots?: Array<TurnBlock>;
  tools?: LmToolsDef;
  /**
   * Optional array of strings that signal the end of a conversation.
   * 
   * These strings can be used to detect when a conversation should be terminated.
   */
  stop?: Array<string>;

  /**
   * Optional specifications for line breaks between different message types.
   * 
   * This can be used to format the rendered conversation.
   */
  linebreaks?: SpacingSlots;
  /**
   * String to display after a shot
   */
  afterShot?: string;
  /**
   * A prefix like a bos token to insert before content
   */
  prefix?: string;
}

/**
 * Image data
 *
 * @interface ImgData
 * @typedef {ImgData}
 */
interface ImgData {
  id: number;
  data: string;
}

/**
 * A history turn
 *
 * @interface HistoryTurn
 * @typedef {HistoryTurn}
 */
interface HistoryTurn {
  user: string;
  assistant: string;
  tool?: string;
  images?: Array<ImgData>;
}

export { SpacingSlots, PromptBlock, TurnBlock, LmTemplate, HistoryTurn, ImgData, LmToolsDef }