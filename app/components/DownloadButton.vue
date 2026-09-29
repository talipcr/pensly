<script setup lang="ts">
const props = withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'ghost'
  block?: boolean
  /** Affiche le nom de fichier réel sous le bouton. */
  showFile?: boolean
  /** Remplace le libellé par défaut (« Télécharger PandaKeep x.y.z »). */
  label?: string
}>(), { size: 'md', variant: 'primary', block: false, showFile: false, label: '' })

const { t } = useI18n()
const release = useLatestRelease()

const text = computed(() =>
  props.label ? props.label : release.ok
    ? t('common.downloadVersion', { version: release.version })
    : t('common.downloadWindows'),
)
</script>

<template>
  <div class="download-btn">
    <a
      class="btn"
      :class="[
        `btn--${variant}`,
        size === 'lg' && 'btn--lg',
        size === 'sm' && 'btn--sm',
        block && 'btn--block',
      ]"
      :href="release.url"
      :download="release.direct ? release.fileName : undefined"
      :rel="release.direct ? 'noopener' : 'noopener noreferrer'"
    >
      <Icon class="btn__icon" name="lucide:download" :size="size === 'sm' ? 16 : 20" />
      <span>{{ text }}</span>
    </a>

    <p v-if="showFile && release.direct" class="path download-btn__file">
      {{ release.fileName }}
    </p>
  </div>
</template>

<style scoped>
.download-btn { display: grid; gap: 0.5rem; justify-items: start; }
.download-btn__file { margin: 0; }
</style>
