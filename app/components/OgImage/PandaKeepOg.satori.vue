<script setup lang="ts">
/**
 * Vignette sociale, rendue au build par nuxt-og-image (Satori).
 * Satori ne comprend qu'un sous-ensemble de CSS et ignore les variables :
 * les couleurs sont donc écrites en dur, aux mêmes valeurs que les jetons.
 */
withDefaults(defineProps<{
  title?: string
  description?: string
}>(), {
  title: 'PandaKeep',
  description: 'Notes rapides, esprit léger.',
})
</script>

<template>
  <div
    style="width:100%;height:100%;display:flex;flex-direction:column;justify-content:space-between;padding:72px;background-color:#ffffff;"
  >
    <div style="display:flex;align-items:center;">
      <img src="/pandakeep-logo.svg" style="width:56px;height:56px;" />
      <span style="margin-left:14px;font-family:Inter;font-size:30px;font-weight:700;color:#18181b;">PandaKeep</span>
    </div>

    <div style="display:flex;flex-direction:column;">
      <span style="font-family:Inter;font-size:66px;font-weight:700;letter-spacing:-2px;line-height:1.08;color:#18181b;">
        {{ title }}
      </span>
      <span style="margin-top:24px;font-family:Inter;font-size:30px;line-height:1.4;color:#52525b;">
        {{ description }}
      </span>
    </div>

    <div style="display:flex;align-items:center;">
      <div style="width:120px;height:4px;background-color:#15803d;" />
      <span style="margin-left:20px;font-family:Inter;font-size:24px;color:#52525b;">Windows · Open source · 100 % local</span>
    </div>
  </div>
</template>
