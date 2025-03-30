<template>
    <div>
        <div class="prosed">
            <h1>System</h1>
        </div>
        <div class="flex flex-wrap gap-2 justify-evenly">
            <button v-for="tpl in templatesList" class="btn bord-lighter" :class="currentTpl == tpl.id ? 'success' : ''"
                @click="renderTemplate(tpl.id)">
                {{ tpl.name }}
            </button>
        </div>
        <div v-if="currentTpl.length > 0" class="flex flex-wrap gap-8 justify-center">
            <!-- @vue-ignore-->
            <RenderTemplate :tpl="tpl" class="mt-12 max-w-6xl flex flex-row justify-center"
                title="Initial system prompt"></RenderTemplate>
            <!-- @vue-ignore-->
            <RenderTemplate :tpl="tpl2" class="mt-12 max-w-6xl flex flex-row justify-center"
                title="Replace system prompt"></RenderTemplate>
            <!-- @vue-ignore-->
            <RenderTemplate :tpl="tpl3" class="mt-12 max-w-6xl flex flex-row justify-center"
                title="After system prompt"></RenderTemplate>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PromptTemplate, templates } from "../../../dist/main";
import { reactive, ref } from "@vue/reactivity";
import RenderTemplate from "@/components/RenderTemplate.vue";
import { onBeforeMount } from "vue";
import { LmTemplate } from "modprompt";

let tpl = {} as PromptTemplate;
let tpl2 = {} as PromptTemplate;
let tpl3 = {} as PromptTemplate;
const currentTpl = ref("");
const system = "You are an AI assistant.";
const afterSystem = " You are a javascript specialist.";
const templatesList = reactive<Record<string, LmTemplate>>({});

function renderTemplate(id: string) {
    currentTpl.value = id;
    tpl = new PromptTemplate(id);
    tpl2 = new PromptTemplate(id).replaceSystem(system);
    tpl3 = new PromptTemplate(id).afterSystem(afterSystem);
}

function init() {
    for (const [k, v] of Object.entries(templates)) {
        //console.log(v)
        if (v?.system) {
            templatesList[k] = v
        }
    }
}

onBeforeMount(() => init())
</script>
