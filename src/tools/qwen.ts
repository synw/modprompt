import type { ToolCallSpec, ToolDefSpec } from "@locallm/types";

function extractQwenToolSpec(
    text: string,
    startTag: string,
    endTag: string
): ToolCallSpec[] {
    try {
        // Optional: Pre-filter to only content between startTag/endTag blocks
        const toolCallRegex = /<function=([^>]+)>([\s\S]*?)<\/function>/g;
        const tcs: ToolCallSpec[] = [];
        let match;

        while ((match = toolCallRegex.exec(text)) !== null) {
            const functionName = match[1].trim();
            const paramsBlock = match[2];

            // Extract parameters with newline-safe regex
            const paramRegex = /<parameter=([^>]+)>([\s\S]*?)<\/parameter>/g;
            const parameters: Record<string, string> = {};
            let paramMatch;

            while ((paramMatch = paramRegex.exec(paramsBlock)) !== null) {
                const key = paramMatch[1].trim();
                const value = paramMatch[2].trim(); // trim to remove surrounding whitespace/newlines
                parameters[key] = value;
            }

            tcs.push({
                id: crypto.randomUUID(),
                name: functionName,
                arguments: Object.keys(parameters).length > 0 ? parameters : undefined
            });
        }

        return tcs;
    } catch (error) {
        throw new Error(`tool call parsing error: ${error}`);
    }
}

function buildQwenToolDef(tools: Array<ToolDefSpec>): string {
    const buf = new Array<string>();
    for (const td of tools) {
        buf.push("<function>");
        buf.push(`<name>${td.name}</name>`);
        buf.push(`<description>${td.description}</description>`);
        const args = Object.keys(td.arguments);
        if (args.length > 0) {
            buf.push("<parameters>")
        };
        const required = new Array<string>();
        args.forEach(a => {
            const p = td.arguments[a];
            buf.push("<parameter>");
            buf.push(`<name>${a}</name>`);
            buf.push(`<description>${p.description}</description>`);
            buf.push("</parameter>");
            if (p.required) {
                required.push(a)
            }
        });
        if (args.length > 0) {
            if (required.length > 0) {
                const r = required.toString().replaceAll('"', "`");
                buf.push(`<required>${r}</required>`)
            }
            buf.push("</parameters>");
        };
        buf.push("</function>");
    }
    return buf.join("\n")
}

export {
    extractQwenToolSpec,
    buildQwenToolDef,
}