<script setup lang="ts">
defineI18nRoute({
  paths: {
    fr: '/confidentialite',
    en: '/privacy',
    es: '/privacidad',
  },
})

const { t } = useI18n()
const config = useRuntimeConfig()

useSeoMeta({
  title: () => t('privacy.meta.title'),
  description: () => t('privacy.meta.description'),
  ogTitle: () => t('privacy.meta.title'),
  ogDescription: () => t('privacy.meta.description'),
})

defineOgImageComponent('PenslyOg', {
  title: t('privacy.title'),
  description: t('privacy.lede'),
})

const app = computed(() => [
  { icon: 'lucide:user-x', title: t('privacy.app1Title'), body: t('privacy.app1Body') },
  { icon: 'lucide:server-off', title: t('privacy.app2Title'), body: t('privacy.app2Body') },
  { icon: 'lucide:eye-off', title: t('privacy.app3Title'), body: t('privacy.app3Body') },
  { icon: 'lucide:radio', title: t('privacy.app4Title'), body: t('privacy.app4Body') },
])

const site = computed(() => [
  { title: t('privacy.site1Title'), body: t('privacy.site1Body') },
  { title: t('privacy.site2Title'), body: t('privacy.site2Body') },
  { title: t('privacy.site3Title'), body: t('privacy.site3Body') },
])
</script>

<template>
  <article>
    <section class="section--tight privacy__head">
      <div class="wrap wrap--narrow">
        <h1>{{ t('privacy.title') }}</h1>
        <p class="lede privacy__lede">{{ t('privacy.lede') }}</p>
      </div>
    </section>

    <section class="section" aria-labelledby="privacy-app">
      <div class="wrap wrap--narrow">
        <h2 id="privacy-app">{{ t('privacy.appTitle') }}</h2>

        <dl class="privacy__list">
          <div v-for="item in app" :key="item.title" class="privacy__item">
            <dt class="privacy__term">
              <Icon class="privacy__icon" :name="item.icon" :size="18" />
              <span>{{ item.title }}</span>
            </dt>
            <dd class="privacy__desc">{{ item.body }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <section class="band section" aria-labelledby="privacy-storage">
      <div class="wrap wrap--narrow">
        <h2 id="privacy-storage">{{ t('privacy.storageTitle') }}</h2>
        <ul class="list-ticks privacy__storage">
          <li>
            <Icon name="lucide:folder" :size="18" />
            <span>{{ t('privacy.storage1') }}</span>
          </li>
          <li>
            <Icon name="lucide:database" :size="18" />
            <span>{{ t('privacy.storage2') }}</span>
          </li>
          <li>
            <Icon name="lucide:lock-open" :size="18" />
            <span>{{ t('privacy.storage3') }}</span>
          </li>
        </ul>
      </div>
    </section>

    <section class="section" aria-labelledby="privacy-site">
      <div class="wrap wrap--narrow">
        <h2 id="privacy-site">{{ t('privacy.siteTitle') }}</h2>

        <dl class="privacy__list">
          <div v-for="item in site" :key="item.title" class="privacy__item">
            <dt class="privacy__term privacy__term--plain">{{ item.title }}</dt>
            <dd class="privacy__desc">{{ item.body }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <section class="section--tight" aria-labelledby="privacy-contact">
      <div class="wrap wrap--narrow">
        <div class="privacy__contact">
          <h2 id="privacy-contact" class="privacy__contact-title">{{ t('privacy.contactTitle') }}</h2>
          <p>{{ t('privacy.contactBody') }}</p>
          <p>
            <a class="prose-link" :href="`${config.public.repoUrl}/issues`" rel="noopener noreferrer">
              {{ t('footer.reportIssue') }}
            </a>
          </p>
          <p class="privacy__updated">{{ t('privacy.updated') }}</p>
        </div>
      </div>
    </section>
  </article>
</template>

<style scoped>
.privacy__head { padding-top: clamp(2.5rem, 6vw, 4rem); }
.privacy__lede { margin-top: 1.1rem; max-width: 56ch; }

.privacy__list { display: grid; gap: 1.75rem; margin-top: 1.9rem; }

.privacy__item { padding-top: 1rem; border-top: 1px solid var(--rule); }

.privacy__term {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-display);
  font-size: var(--step-1);
  font-weight: 600;
  margin-bottom: 0.45rem;
}

.privacy__term--plain { display: block; }

.privacy__icon { color: var(--green-ink); flex: none; }

.privacy__desc { margin: 0; max-width: var(--measure); }

.privacy__storage { margin-top: 1.75rem; }

.privacy__contact {
  padding: clamp(1.5rem, 4vw, 2.25rem);
  border: 1px solid var(--rule-strong);
  border-radius: var(--radius-lg);
  background: var(--green-tint);
}

.privacy__contact-title { font-size: var(--step-2); margin-bottom: 0.75rem; }
.privacy__contact p + p { margin-top: 0.75rem; }

.privacy__updated {
  margin-top: 1.5rem;
  font-family: var(--font-mono);
  font-size: var(--step-000);
  color: var(--ink-muted);
}
</style>
