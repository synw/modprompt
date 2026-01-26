import type { ToolCallSpec } from "@locallm/types";
import { extractBetweenTags } from "../utils.js";

function extractJsonToolSpec(
    text: string,
    startTag: string,
    endTag?: string
): ToolCallSpec[] {
    try {
        // Extract content
        let content = extractBetweenTags(text, startTag, endTag)
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

export {
    extractJsonToolSpec,
}