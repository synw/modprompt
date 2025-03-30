<template>
    <div>
        <div class="prosed">
            <h1>Playground</h1>
        </div>
        <div class="flex flex-col space-y-5 max-w-xl">
            <div class="flex flex-col space-y-3">
                <div>List the available templates:</div>
                <js-code-block :code="code1" :on-run="onRun" :hljs="hljs"></js-code-block>
            </div>
            <div class="flex flex-col space-y-3">
                <div>Render:</div>
                <js-code-block :code="code2" :on-run="onRun" :hljs="hljs"></js-code-block>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { templates, PromptTemplate } from "modprompt";
import { JsCodeBlock } from "@docdundee/vue";
import { hljs } from "@/conf";

const t = templates;
const p = PromptTemplate;

const onRun = (code: string) => {
    const res = eval(code);
    //console.log(typeof res)
    return res
};

const code1 = `//import { templates } from "modprompt";

const templateNames = Object.keys(templates);
templateNames.join(", ");`;

const code2 = `//import { PromptTemplate } from "modprompt";

const tpl = new PromptTemplate("command-r")
tpl.replaceSystem("You are an AI assistant")
tpl.addShot('Is it raining?', 'No, it is sunny.')
tpl.prompt("Hello").replace("\\n", "<br />")`;
</script>

<style lang="sass">
.code-exec-btn
    svg
        display: inline !important
</style>