interface SpacingSlots {
  system?: number;
  user?: number;
  assistant?: number;
}

interface PromptBlock {
  schema: string;
  message?: string;
}

interface TurnBlock {
  user: string;
  assistant: string;
}

interface LmTemplate {
  name: string;
  user: string;
  assistant: string;
  system?: PromptBlock;
  shots?: Array<TurnBlock>;
  stop?: Array<string>;
  linebreaks?: SpacingSlots;
}

export { SpacingSlots, PromptBlock, TurnBlock, LmTemplate }