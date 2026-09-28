<script setup lang="ts">
const { t } = useI18n()
const config = useRuntimeConfig()
const { platform } = usePlatform()

const label = computed(() => (platform.value === 'mac' ? t('common.platformMac') : t('common.platformLinux')))
const show = computed(() => platform.value === 'mac' || platform.value === 'linux')
</script>

<template>
  <p v-if="show" class="platform-notice">
    <Icon name="lucide:info" :size="17" />
    <span>
      {{ t('common.platformNotice', { platform: label }) }}
      <a class="prose-link" :href="`${config.public.repoUrl}/issues`" rel="noopener noreferrer">
        {{ t('common.platformNoticeLink') }}
      </a>
    </span>
  </p>
</template>

<style scoped>
.platform-notice {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.6rem;
  max-width: 60ch;
  padding: 0.85rem 1rem;
  border: 1px solid var(--rule-strong);
  border-radius: var(--radius);
  background: var(--paper-raised);
  font-size: var(--step-00);
  color: var(--ink-muted);
}

.platform-notice svg { margin-top: 0.2rem; flex: none; }
</style>
