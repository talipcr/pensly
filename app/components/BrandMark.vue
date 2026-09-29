<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 28 })
</script>

<template>
  <!-- Le logo réel du produit (public/pandakeep-logo.svg), servi tel quel. -->
  <img
    class="brand-mark"
    src="/pandakeep-logo.svg"
    :width="size"
    :height="size"
    alt=""
    role="presentation"
  >
</template>

<style scoped>
.brand-mark { flex: none; }
</style>
