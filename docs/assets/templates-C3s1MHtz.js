import{d as defineComponent,o as openBlock,c as createElementBlock,a as createBaseVNode,b as createVNode,u as unref,H as HighlightJS,e as cj}from"./index-Ch5I8FZ2.js";const _hoisted_1={class:"flex flex-col space-y-5 max-w-xl"},_hoisted_2={class:"flex flex-col space-y-3"},_hoisted_3={class:"flex flex-col space-y-3"},code1=`//import { templates } from "modprompt";

const templateNames = Object.keys(templates);
templateNames.join(", ");`,code2=`//import { PromptTemplate } from "modprompt";

const tpl = new PromptTemplate("command-r")
tpl.replaceSystem("You are an AI assistant")
tpl.addShot('Is it raining?', 'No, it is sunny.')
tpl.prompt("Hello").replace("\\n", "<br />")`,_sfc_main=defineComponent({__name:"templates",setup(__props){const onRun=code=>{const res=eval(code);return res};return(t,e)=>(openBlock(),createElementBlock("div",null,[e[2]||(e[2]=createBaseVNode("div",{class:"prosed"},[createBaseVNode("h1",null,"Templates")],-1)),createBaseVNode("div",_hoisted_1,[createBaseVNode("div",_hoisted_2,[e[0]||(e[0]=createBaseVNode("div",null,"List the available templates:",-1)),createVNode(unref(cj),{code:code1,"on-run":onRun,hljs:unref(HighlightJS)},null,8,["hljs"])]),createBaseVNode("div",_hoisted_3,[e[1]||(e[1]=createBaseVNode("div",null,"Render:",-1)),createVNode(unref(cj),{code:code2,"on-run":onRun,hljs:unref(HighlightJS)},null,8,["hljs"])])])]))}});export{_sfc_main as default};
