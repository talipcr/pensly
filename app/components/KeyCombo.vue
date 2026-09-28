<script setup lang="ts">
const props = defineProps<{ combo: string }>()

const keys = computed(() => props.combo.split('+').map(k => k.trim()).filter(Boolean))
</script>

<template>
  <span class="kbd-seq">
    <template v-for="(key, index) in keys" :key="key + index">
      <span v-if="index > 0" class="kbd-plus" aria-hidden="true">+</span>
      <kbd class="kbd">{{ key }}</kbd>
    </template>
  </span>
</template>
