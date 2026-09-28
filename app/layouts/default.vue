<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <a class="skip-link" href="#main">{{ t('nav.skip') }}</a>

  <SiteHeader />

  <main id="main" tabindex="-1">
    <slot />
  </main>

  <SiteFooter />
</template>

<style scoped>
.skip-link {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  padding: 0.75rem 1.25rem;
  background: var(--green-solid);
  color: var(--on-green);
  font-weight: 600;
  text-decoration: none;
  transform: translateY(-120%);
  transition: transform var(--dur-fast) var(--ease);
}

.skip-link:focus {
  transform: translateY(0);
  color: var(--on-green);
}

main:focus { outline: none; }
</style>
