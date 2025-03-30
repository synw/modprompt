<template>
    <div>
        <div class="prosed">
            <h1>Templates</h1>
        </div>
        <div class="flex flex-wrap gap-2 justify-evenly">
            <button v-for="tpl in templates" class="btn bord-lighter" :class="currentTpl == tpl.id ? 'success' : ''"
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
import { ref } from "@vue/reactivity";
import RenderTemplate from "@/components/RenderTemplate.vue";

const tpl = ref<PromptTemplate>({} as PromptTemplate);
const currentTpl = ref("");

function renderTemplate(id: string) {
    tpl.value = new PromptTemplate(id);
    currentTpl.value = id;
}
</script>
