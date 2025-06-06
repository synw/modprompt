import { ToolCallSpec } from "./interfaces.js";

function extractBetweenTags(
  text: string,
  startTag: string,
  endTag?: string
): string {
  try {
    // Find start position
    const startIndex = text.indexOf(startTag);
    if (startIndex === -1) return text;

    // Calculate content boundaries
    let contentStart = startIndex + startTag.length;
    let contentEnd: number;

    if (endTag) {
      contentEnd = text.indexOf(endTag, contentStart);
      if (contentEnd === -1) return text;
    } else {
      // Find next newline for self-closing tags
      contentEnd = text.indexOf('\n', contentStart);
      if (contentEnd === -1) contentEnd = text.length;
    }

    // Extract content
    return text.substring(contentStart, contentEnd).trim();
  } catch (error) {
    throw new Error(`Error parsing content between tags ${startTag} ${endTag}: ${error}`);
  }
}

function extractToolSpec(
  text: string,
  startTag: string,
  endTag?: string
): ToolCallSpec[] {
  try {
    // Extract content
    let content = extractBetweenTags(text, startTag, endTag)
    // try to patch malformed tool c
    if (content.startsWith("[") && !content.endsWith("]")) {
      content = content + "]"
    }
    // Parse JSON content
    let parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      parsed = [parsed]
    }
    return parsed;
  } catch (error) {
    throw new Error(`tool call parsing error: ${error}`);
  }
}

export { extractBetweenTags, extractToolSpec }