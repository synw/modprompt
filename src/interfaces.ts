import type { HistoryTurn } from "@locallm/types";

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
 *   assistant: 1,
 *   tools: 0
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

  /**
   * Number of line breaks to be applied after tool messages.
   */
  tools?: number;
}

/**
 * Represents a block of system-level prompts or instructions in the conversation.
 * 
 * @interface PromptBlock
 * @typedef {PromptBlock}
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
 * Definition of language model tools.
 *
 * @interface LmToolsDef
 * @typedef {LmToolsDef}
 * 
 * @example
 * const toolDefExample: LmToolsDef = {
 *   def: "Tool definition",
 *   call: "Tool call format",
 *   response: "Expected tool response"
 * };
 */
interface LmToolsDef {
  /**
   * The definition or description of the tool.
   */
  def: string;

  /**
   * The call format for the tool.
   */
  call: string;

  /**
   * The expected response format from the tool.
   */
  response: string;
  beforeResponse?: string;
  afterResponse?: string;
  parser?: string;
  builder?: string;
}

interface LmTags {
  think?: { start: string, end: string };
  toolCall?: { start: string, end: string };
}

/**
 * Represents a template for language modeling, detailing the structure and interaction elements of a conversation.
 * 
 * @interface LmTemplate
 * @typedef {LmTemplate}
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
 *   },
 *   tools: {
 *     def: "Tool definition",
 *     call: "Tool call format",
 *     response: "Expected tool response"
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
  shots?: Array<HistoryTurn>;

  /**
   * Tool definitions for the template.
   */
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

  tags?: LmTags;
}

export {
  SpacingSlots,
  PromptBlock,
  LmTemplate,
  LmToolsDef,
  LmTags,
}
