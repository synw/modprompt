import type { ToolCallSpec } from "@locallm/types";

function extractGlmToolSpec(
    text: string,
    startTag: string,
    endTag?: string
): ToolCallSpec[] {
    try {
        const _rtcs = text.trim().split("</tool_call>").map(t => t.replace("<tool_call>", ""));
        const rtcs = new Array<string>();
        _rtcs.forEach(r => {
            if (r.length > 0) {
                rtcs.push(r.trim().replace("<tool_call>", ""))
            }
        })
        const tcs = new Array<ToolCallSpec>();
        for (const rtc of rtcs) {
            if (!rtc.includes("<arg_key>")) {
                const tc: ToolCallSpec = {
                    id: crypto.randomUUID(),
                    name: rtc.trim()
                };
                tcs.push(tc)
            } else {
                const idx = rtc.indexOf("<arg_key>");
                const name = rtc.slice(0, idx).trim();
                const rawtc = rtc.slice(idx);
                const args: Record<string, string> = {};
                const parts = rawtc.split(/<\/arg_key>|<\/arg_value>/).filter(part => part.trim());
                let currentKey = '';
                for (const part of parts) {
                    if (part.includes('<arg_key>')) {
                        currentKey = part.replace(/<arg_key>/g, '').trim();
                    } else {
                        const value = part.replace(/<arg_value>/g, '').trim();
                        args[currentKey] = value;
                    }
                }
                tcs.push({
                    id: crypto.randomUUID(),
                    name,
                    arguments: Object.keys(args).length > 0 ? args : undefined
                });
            }
        }
        /*console.log("----------- FINAL TCS");
        console.log(tcs);
        console.log("----------- END");*/
        return tcs
    } catch (error) {
        throw new Error(`tool call parsing error: ${error}`);
    }
}

export {
    extractGlmToolSpec,
}