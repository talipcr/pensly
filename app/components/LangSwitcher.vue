<script setup lang="ts">
const { t, locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const available = computed(() =>
  (locales.value as { code: string, name?: string }[]).map(l => ({
    code: l.code,
    name: l.name ?? l.code,
    path: switchLocalePath(l.code as 'fr' | 'en' | 'es'),
  })),
)
</script>

<template>
  <nav class="lang" :aria-label="t('lang.label')">
    <ul class="lang__list">
      <li v-for="item in available" :key="item.code">
        <NuxtLink
          class="lang__link"
          :to="item.path"
          :hreflang="item.code"
          :aria-current="item.code === locale ? 'true' : undefined"
        >
          <abbr :title="item.name">{{ item.code.toUpperCase() }}</abbr>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.lang__list {
  display: flex;
  align-items: center;
  gap: 0.1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.lang__link {
  display: block;
  padding: 0.35rem 0.45rem;
  border-radius: 3px;
  font-family: var(--font-mono);
  font-size: var(--step-000);
  font-weight: 500;
  letter-spacing: 0.06em;
  color: var(--ink-muted);
  text-decoration: none;
  transition: color var(--dur-fast) var(--ease), background-color var(--dur-fast) var(--ease);
}

.lang__link:hover { color: var(--ink); background: var(--paper-sunk); }

/* La langue active est signalée par le soulignement ET par le poids :
   la couleur n'est jamais le seul indicateur. */
.lang__link[aria-current] {
  color: var(--green-ink);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 0.25em;
  text-decoration-thickness: 1.5px;
}

.lang__link abbr { text-decoration: inherit; }
</style>
