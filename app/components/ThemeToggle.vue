<script setup lang="ts">
const { t } = useI18n()
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

function toggle() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <!-- Le mode réel n'est connu qu'après l'hydratation : on réserve la place
       pour éviter tout décalage de mise en page. -->
  <ClientOnly>
    <button
      type="button"
      class="theme-toggle"
      :aria-label="isDark ? t('theme.toLight') : t('theme.toDark')"
      :aria-pressed="isDark"
      @click="toggle"
    >
      <Icon :name="isDark ? 'lucide:sun' : 'lucide:moon'" :size="18" />
    </button>

    <template #fallback>
      <span class="theme-toggle theme-toggle--placeholder" aria-hidden="true" />
    </template>
  </ClientOnly>
</template>

<style scoped>
.theme-toggle {
  display: grid;
  place-items: center;
  width: 2.35rem;
  height: 2.35rem;
  padding: 0;
  border: 1px solid var(--rule);
  border-radius: var(--radius);
  background: transparent;
  color: var(--ink-muted);
  cursor: pointer;
  transition: color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease), background-color var(--dur-fast) var(--ease);
}

.theme-toggle:hover {
  color: var(--ink);
  border-color: var(--rule-strong);
  background: var(--paper-raised);
}

.theme-toggle--placeholder { cursor: default; }
</style>
