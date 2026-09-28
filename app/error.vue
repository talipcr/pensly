<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const { t } = useI18n()
const localePath = useLocalePath()

const isNotFound = computed(() => props.error?.statusCode === 404)
const scope = computed(() => (isNotFound.value ? 'notFound' : 'error'))

useSeoMeta({
  title: () => (isNotFound.value ? t('notFound.meta.title') : t('error.title')),
  description: () => (isNotFound.value ? t('notFound.meta.description') : t('error.body')),
  robots: 'noindex, follow',
})
</script>

<template>
  <NuxtLayout>
    <section class="section error-page">
      <div class="wrap">
        <p v-if="isNotFound" class="error-page__code" aria-hidden="true">{{ t('notFound.code') }}</p>
        <h1>{{ t(`${scope}.title`) }}</h1>
        <p class="lede error-page__body">{{ t(`${scope}.body`) }}</p>

        <NuxtLink class="btn btn--primary error-page__cta" :to="localePath('index')">
          <Icon class="btn__icon" name="lucide:arrow-left" :size="18" />
          <span>{{ t(`${scope}.back`) }}</span>
        </NuxtLink>
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.error-page { padding-block: clamp(4rem, 12vw, 9rem); }

.error-page__code {
  font-family: var(--font-mono);
  font-size: var(--step-1);
  font-weight: 500;
  letter-spacing: 0.2em;
  color: var(--ink-muted);
  margin-bottom: 1rem;
}

.error-page__body { margin-top: 1.25rem; }
.error-page__cta { margin-top: 2rem; }
</style>
