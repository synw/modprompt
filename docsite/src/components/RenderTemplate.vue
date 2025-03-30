<template>
    <div class="mt-12 max-w-6xl flex flex-row justify-center">
        <div class="bord-lighter border rounded-lg superlight flex flex-col min-w-lg">
            <div v-if="title" class="secondary py-3 px-2 w-full pl-5">{{ title }}</div>
            <div v-html="render()" class="p-5"></div>
        </div>
    </div>
</template>*

<script setup lang="ts">
import { PromptTemplate } from "../../../dist/main";

const props = defineProps({
    tpl: {
        type: Object as () => PromptTemplate,
        required: true
    },
    title: {
        type: String
    }
});

function render() {
    const txt = props.tpl.render(false)
    return txt.replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("\n", "<br />")
        .replaceAll("{prompt}", "<b>{prompt}</b>")
        .replaceAll("{system}", "<b>{system}</b>")
        .replaceAll("{tools}", "<b>{tools}</b>")
}
</script>