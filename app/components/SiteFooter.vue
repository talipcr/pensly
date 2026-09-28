<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()

const repoUrl = config.public.repoUrl

const links = computed(() => [
  { name: 'telecharger', label: t('nav.download') },
  { name: 'guide', label: t('nav.guide') },
  { name: 'journal', label: t('nav.changelog') },
  { name: 'confidentialite', label: t('nav.privacy') },
])
</script>

<template>
  <footer class="site-footer">
    <div class="wrap site-footer__inner">
      <div class="site-footer__brand">
        <NuxtLink class="brand" :to="localePath('index')">
          <BrandMark :size="24" />
          <span class="brand__name">{{ t('brand.name') }}</span>
        </NuxtLink>
        <p class="site-footer__about muted">{{ t('footer.about') }}</p>
      </div>

      <nav class="site-footer__col" :aria-label="t('footer.navTitle')">
        <h2 class="site-footer__title">{{ t('footer.navTitle') }}</h2>
        <ul>
          <li v-for="link in links" :key="link.name">
            <NuxtLink class="link-draw" :to="localePath(link.name)">{{ link.label }}</NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="site-footer__col">
        <h2 class="site-footer__title">{{ t('footer.projectTitle') }}</h2>
        <ul>
          <li>
            <a class="link-draw" :href="`${repoUrl}/releases`" rel="noopener noreferrer">{{ t('footer.releases') }}</a>
          </li>
          <li>
            <a class="link-draw" :href="repoUrl" rel="noopener noreferrer">{{ t('footer.sourceCode') }}</a>
          </li>
          <li>
            <a class="link-draw" :href="`${repoUrl}/issues`" rel="noopener noreferrer">{{ t('footer.reportIssue') }}</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="wrap site-footer__legal">
      <p class="muted">{{ t('footer.license') }}</p>
      <p class="muted">{{ t('footer.noTracking') }}</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--rule);
  background: var(--paper-sunk);
  padding-block: clamp(2.5rem, 6vw, 4rem) 1.75rem;
}

.site-footer__inner {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 3fr) minmax(0, 3fr);
  gap: clamp(1.75rem, 4vw, 3rem);
  align-items: start;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--ink);
  text-decoration: none;
}

.brand__name {
  font-family: var(--font-display);
  font-size: var(--step-1);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.site-footer__about {
  margin-top: 0.75rem;
  max-width: 40ch;
  font-size: var(--step-00);
}

.site-footer__title {
  font-size: var(--step-000);
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-muted);
  margin-bottom: 0.9rem;
}

.site-footer__col ul {
  display: grid;
  gap: 0.55rem;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: var(--step-00);
}

.site-footer__legal {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem 1.5rem;
  margin-top: clamp(2rem, 5vw, 3rem);
  padding-top: 1.25rem;
  border-top: 1px solid var(--rule);
  font-size: var(--step-000);
}

.site-footer__legal p { max-width: none; }

@media (max-width: 48rem) {
  .site-footer__inner { grid-template-columns: minmax(0, 1fr); }
}
</style>
