<script lang="ts" setup>
import { toggleDark } from '~/composables/dark'
</script>

<template>
  <button class="text-black dark:text-white rounded-full border-none w-8 h-8 inline-flex justify-center items-center cursor-pointer bg-transparent" title="Toggle Dark" @click="toggleDark()">
    <div i="carbon-sun dark:carbon-moon" />
  </button>
</template>
