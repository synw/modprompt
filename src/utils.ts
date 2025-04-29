import { ToolCallSpec } from "./interfaces.js";

function extractBetweenTags(
  text: string,
  startTag: string,
  endTag?: string
): ToolCallSpec[] {
  try {
    // Find start position
    const startIndex = text.indexOf(startTag);
    if (startIndex === -1) return [];

    // Calculate content boundaries
    let contentStart = startIndex + startTag.length;
    let contentEnd: number;

    if (endTag) {
      contentEnd = text.indexOf(endTag, contentStart);
      if (contentEnd === -1) return [];
    } else {
      // Find next newline for self-closing tags
      contentEnd = text.indexOf('\n', contentStart);
      if (contentEnd === -1) contentEnd = text.length;
    }

    // Extract content
    const content = text.substring(contentStart, contentEnd).trim();

    // Parse JSON content
    let parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      parsed = [parsed]
    }
    return parsed;

  } catch (error) {
    throw new Error(`Error parsing tool response content: ${error}`);
  }
}

export { extractBetweenTags, }