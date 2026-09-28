<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const open = ref(false)

// Ancres de la page d'accueil, en liens simples : NuxtLink les marquerait
// toutes aria-current sur l'accueil. Elles fonctionnent aussi depuis les autres pages.
const links = computed(() => [
  { hash: '#features', label: t('nav.features') },
  { hash: '#privacy', label: t('nav.privacy') },
  { hash: '#ai', label: t('nav.ai') },
  { hash: '#faq', label: t('nav.faq') },
])

watch(() => route.fullPath, () => { open.value = false })

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) open.value = false
}
</script>

<template>
  <header class="site-header" @keydown="onKeydown">
    <div class="wrap site-header__inner">
      <NuxtLink class="brand" :to="localePath('index')">
        <BrandMark :size="26" />
        <span class="brand__name">{{ t('brand.name') }}</span>
      </NuxtLink>

      <nav class="site-nav" :aria-label="t('nav.primary')">
        <ul class="site-nav__list">
          <li v-for="link in links" :key="link.hash">
            <a class="link-draw site-nav__link" :href="localePath('index') + link.hash">
              {{ link.label }}
            </a>
          </li>
        </ul>
      </nav>

      <div class="site-header__tools">
        <LangSwitcher />
        <ThemeToggle />
        <DownloadButton class="site-header__cta" size="sm" :label="t('common.downloadShort')" />
      </div>

      <button
        type="button"
        class="nav-toggle"
        :aria-label="open ? t('nav.closeMenu') : t('nav.openMenu')"
        :aria-expanded="open"
        aria-controls="site-menu"
        @click="open = !open"
      >
        <Icon :name="open ? 'lucide:x' : 'lucide:menu'" :size="22" />
      </button>
    </div>

    <div v-show="open" id="site-menu" class="site-menu">
      <div class="wrap site-menu__inner">
        <nav :aria-label="t('nav.primary')">
          <ul class="site-menu__list">
            <li>
              <NuxtLink class="site-menu__link" :to="localePath('index')">{{ t('nav.home') }}</NuxtLink>
            </li>
            <li v-for="link in links" :key="link.hash">
              <a class="site-menu__link" :href="localePath('index') + link.hash" @click="open = false">{{ link.label }}</a>
            </li>
          </ul>
        </nav>

        <div class="site-menu__tools">
          <LangSwitcher />
          <ThemeToggle />
        </div>

        <DownloadButton block :label="t('common.downloadWindows')" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--paper);
  border-bottom: 1px solid var(--rule);
}

.site-header__inner {
  display: flex;
  align-items: center;
  gap: clamp(1rem, 3vw, 2.5rem);
  min-height: 4.25rem;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: var(--ink);
  text-decoration: none;
  margin-right: auto;
}

.brand__name {
  font-family: var(--font-display);
  font-size: var(--step-1);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.site-nav__list {
  display: flex;
  align-items: center;
  gap: clamp(1rem, 2.2vw, 1.9rem);
  list-style: none;
  margin: 0;
  padding: 0;
}

.site-nav__link {
  font-size: var(--step-00);
  font-weight: 500;
  color: var(--ink-muted);
}

.site-nav__link:hover,
.site-nav__link[aria-current='page'] { color: var(--ink); }

.site-header__tools {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.nav-toggle {
  display: none;
  place-items: center;
  width: 2.6rem;
  height: 2.6rem;
  padding: 0;
  border: 1px solid var(--rule);
  border-radius: var(--radius);
  background: transparent;
  color: var(--ink);
  cursor: pointer;
}

.site-menu {
  border-top: 1px solid var(--rule);
  background: var(--paper-raised);
}

.site-menu__inner {
  display: grid;
  gap: 1.25rem;
  padding-block: 1.25rem 1.75rem;
}

.site-menu__list {
  display: grid;
  gap: 0.15rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.site-menu__link {
  display: block;
  padding: 0.7rem 0;
  border-bottom: 1px solid var(--rule);
  font-size: var(--step-1);
  font-weight: 600;
  color: var(--ink);
  text-decoration: none;
}

.site-menu__link[aria-current='page'] { color: var(--green-ink); }

.site-menu__tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

@media (min-width: 62rem) {
  .site-menu { display: none !important; }
}

@media (max-width: 61.999rem) {
  .site-nav,
  .site-header__tools { display: none; }

  .nav-toggle { display: grid; }
}
</style>
