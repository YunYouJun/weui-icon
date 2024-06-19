<script setup lang="ts">
import { ref } from "vue";
import HelloWorld from './components/HelloWorld.vue'

import { icons } from '../../packages/iconify/icons.json'

import { pascalCase } from "scule";

import { useClipboard } from '@vueuse/core'
const source = ref('')
const { text, copy, copied, isSupported } = useClipboard({ source })


function copyIcon(type: string) {
  const iconTxt = `<i class="i-weui:${type}"></i>`
  copy(iconTxt)  
}

import { useHead } from "@vueuse/head";
import { isDark } from "./composables/dark";

useHead({
  title: 'WeUI Icons',
  meta: [
    {
      name: 'description',
      content: 'WeUI Icons',
    },
    {
      name: 'theme-color',
      content: () => isDark.value ? '#000000' : '#ffffff',
    },
  ],
})
</script>

<template>
  <ToggleDark absolute top-5 right-5 />

  <!-- <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div> -->
  <!-- <HelloWorld msg="Vite + Vue" /> -->
  <div class="text-5xl fw100 pt-8">WeUI Unocss Test</div>

  <p class="flex p-4">
    <span class="mr-1">Icons imported from SVG files:</span>
    <span
      class="i-weui:info-filled text-blue-600 hover:text-red-600 icon24 inline-icon"
    ></span>
    <span
      class="i-weui:info-outlined text-blue-600 hover:text-red-600 icon24 inline-icon"
    ></span>
  </p>

  <div class="flex flex-wrap p-4">
    <span 
      v-for="(icon, key) in icons" :key="key" 
      class="active:scale-90"
      :class="`i-weui:${key} hover:text-blue-500 size-8 cursor-pointer`"
      @click="copyIcon(key)"
    >
    </span>
  </div>

  <br />
  <div>
    <IconAddFilled />

    <i class="i-weui:previous2-outlined"></i>
    <span class="i-weui:mosaic-filled size-8 text-blue-600"></span>
  </div>

  <!-- TODO: dynamic all import -->
  <!-- <component
    v-for="(icon, key) in icons"
    :key="key"
    :is="'Icon' + pascalCase(key)"
    class="text-blue-600 hover:text-red-600 icon24 inline-icon"
  /> -->
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
