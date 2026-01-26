import type { ToolCallSpec } from "@locallm/types";
import { extractGlmToolSpec } from "./glm.js";
import { extractJsonToolSpec } from "./json.js";

function routeToolResponseParsing(
    text: string,
    startTag: string,
    endTag?: string,
    parser?: string
): ToolCallSpec[] {
    if (!parser) {
        return extractJsonToolSpec(text, startTag, endTag)
    } else if (parser == "glm") {
        return extractGlmToolSpec(text, startTag, endTag)
    } else {
        throw new Error(`unknown tool response parser ${parser}`)
    }
}

export {
    routeToolResponseParsing,
}