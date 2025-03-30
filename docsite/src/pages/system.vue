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
            <div class="flex flex-col">
                <div class="flex flex-row">
                    <button class="btn" @click="renderTemplate(currentTpl)">Initial system prompt</button>
                    <button class="btn" @click="renderTemplateSys(currentTpl)">Replace system prompt</button>
                    <button class="btn" @click="renderTemplateAfterSys(currentTpl)">After system prompt</button>
                </div>
                <div v-if="tpl">
                    <RenderTemplate :tpl="tpl" class="mt-12 max-w-6xl flex flex-row justify-center"
                        title="Initial system prompt"></RenderTemplate>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PromptTemplate, templates } from "modprompt";
import { reactive, ref } from "@vue/reactivity";
import RenderTemplate from "@/components/RenderTemplate.vue";
import { onBeforeMount } from "vue";
import { LmTemplate } from "modprompt";

let tpl = ref<PromptTemplate | null>(null);
const currentTpl = ref("");
const system = "You are an AI assistant.";
const afterSystem = " You are a javascript specialist.";
const templatesList = reactive<Record<string, LmTemplate>>({});

function renderTemplate(id: string) {
    tpl.value = null;
    currentTpl.value = id;
    tpl.value = new PromptTemplate(id);
}

function renderTemplateSys(id: string) {
    tpl.value = null;
    tpl.value = new PromptTemplate(id).replaceSystem(system);
}

function renderTemplateAfterSys(id: string) {
    tpl.value = null;
    tpl.value = new PromptTemplate(id).afterSystem(afterSystem);
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
