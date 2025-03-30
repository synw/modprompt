<template>
    <div>
        <div class="prosed">
            <h1>Tools</h1>
        </div>
        <div class="flex flex-wrap gap-2 justify-evenly">
            <button v-for="tpl in templatesList" class="btn bord-lighter" :class="currentTpl == tpl.id ? 'success' : ''"
                @click="renderTemplate(tpl.id)">
                {{ tpl.name }}
            </button>
        </div>
        <template v-if="currentTpl.length > 0">
            <!-- @vue-ignore-->
            <RenderTemplate :tpl="tpl" class="mt-12 max-w-6xl flex flex-row justify-center"></RenderTemplate>
        </template>
    </div>
</template>

<script setup lang="ts">
import { PromptTemplate, templates } from "modprompt";
import { reactive, ref } from "@vue/reactivity";
import RenderTemplate from "@/components/RenderTemplate.vue";
import { LmTemplate } from "modprompt";
import { onBeforeMount } from "vue";

const tpl = ref<PromptTemplate>({} as PromptTemplate);
const currentTpl = ref("");
const templatesList = reactive<Record<string, LmTemplate>>({});

const tool1 = {
    "name": "get_current_weather",
    "description": "Get the current weather",
    "arguments": {
        "location": {
            "description": "The city and state, e.g. San Francisco, CA"
        }
    }
};

function renderTemplate(id: string) {
    tpl.value = new PromptTemplate(id).addTool(tool1);
    currentTpl.value = id;
}

function init() {
    for (const [k, v] of Object.entries(templates)) {
        console.log(v)
        if (v?.tools) {
            templatesList[k] = v
        }
    }
}

onBeforeMount(() => init())
</script>
