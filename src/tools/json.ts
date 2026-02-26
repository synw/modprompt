import type { ToolCallSpec, ToolDefSpec } from "@locallm/types";

function extractJsonToolSpec(
    text: string,
    startTag: string,
    endTag: string
): ToolCallSpec[] {
    try {
        const _rtcs = text.trim().split(endTag).map(t => t.replace(startTag, ""));
        const rtcs = new Array<string>();
        _rtcs.forEach(r => {
            if (r.length > 0) {
                rtcs.push(r.trim().replace(startTag, ""))
            }
        })
        const tcs = new Array<ToolCallSpec>();
        for (const content of rtcs) {
            // Extract content
            // Parse JSON content
            let parsed = JSON.parse(content);
            if (!parsed?.id) {
                parsed.id = crypto.randomUUID();
            }
            tcs.push(parsed);
        }
        return tcs
    } catch (error) {
        throw new Error(`tool call parsing error: ${error}`);
    }
}

export {
    extractJsonToolSpec,
}