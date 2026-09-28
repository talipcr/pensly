<script setup lang="ts">
// lang, dir et les alternates hreflang, tenus à jour par @nuxtjs/i18n.
const localeHead = useLocaleHead()
useHead(() => localeHead.value)
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
