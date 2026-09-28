<script setup lang="ts">
defineI18nRoute({
  paths: {
    fr: '/journal',
    en: '/changelog',
    es: '/novedades',
  },
})

const { t, locale } = useI18n()
const config = useRuntimeConfig()
const releases = useReleases()
const latest = useLatestRelease()

useSeoMeta({
  title: () => t('changelog.meta.title'),
  description: () => t('changelog.meta.description'),
  ogTitle: () => t('changelog.meta.title'),
  ogDescription: () => t('changelog.meta.description'),
})

defineOgImageComponent('PenslyOg', {
  title: t('changelog.title'),
  description: latest.version ? `${t('common.version')} ${latest.version}` : t('brand.tagline'),
})
</script>

<template>
  <article>
    <section class="section--tight changelog__head">
      <div class="wrap">
        <h1>{{ t('changelog.title') }}</h1>
        <p class="lede changelog__lede">{{ t('changelog.lede') }}</p>
      </div>
    </section>

    <section class="section" :aria-label="t('changelog.title')">
      <div class="wrap">
        <!-- Repli : l'API GitHub n'a pas répondu au moment du build. -->
        <div v-if="!releases.length" class="callout">
          <Icon class="callout__icon" name="lucide:info" :size="20" />
          <div>
            <h2 class="changelog__empty-title">{{ t('changelog.emptyTitle') }}</h2>
            <p>{{ t('changelog.emptyBody') }}</p>
            <p>
              <a class="prose-link" :href="`${config.public.repoUrl}/releases`" rel="noopener noreferrer">
                {{ t('changelog.emptyLink') }}
              </a>
            </p>
          </div>
        </div>

        <ol v-else class="changelog">
          <li v-for="(release, index) in releases" :key="release.tag" class="changelog__item">
            <div class="changelog__aside">
              <h2 class="changelog__version">{{ release.version }}</h2>
              <p class="changelog__date">
                <time :datetime="release.publishedAt">{{ formatDate(release.publishedAt, locale) }}</time>
              </p>
              <p v-if="index === 0 && !release.prerelease" class="changelog__badge">
                {{ t('changelog.current') }}
              </p>
              <p v-if="release.prerelease" class="changelog__badge changelog__badge--muted">
                {{ t('changelog.prerelease') }}
              </p>
            </div>

            <div class="changelog__body">
              <!-- Le HTML est produit au build par modules/github-release.ts :
                   le texte est échappé avant qu'un jeu fermé de balises ne soit
                   réintroduit. Aucune balise ne provient des notes elles-mêmes. -->
              <div v-if="release.bodyHtml" class="prose changelog__notes" v-html="release.bodyHtml" />
              <p v-else class="muted">{{ t('changelog.noNotes') }}</p>

              <p class="changelog__link">
                <a class="prose-link" :href="release.htmlUrl" rel="noopener noreferrer">
                  {{ t('changelog.viewOnGithub') }}
                </a>
              </p>
            </div>
          </li>
        </ol>
      </div>
    </section>
  </article>
</template>

<style scoped>
.changelog__head { padding-top: clamp(2.5rem, 6vw, 4rem); }
.changelog__lede { margin-top: 1.1rem; max-width: 60ch; }

.changelog {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: clamp(2.5rem, 6vw, 4rem);
}

.changelog__item {
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
  gap: clamp(1rem, 3vw, 2.5rem);
  padding-top: 1.5rem;
  border-top: 2px solid var(--rule-strong);
}

.changelog__aside { position: sticky; top: 6rem; align-self: start; }

.changelog__version {
  font-size: var(--step-3);
  letter-spacing: -0.03em;
  margin-bottom: 0.3rem;
}

.changelog__date {
  font-family: var(--font-mono);
  font-size: var(--step-000);
  color: var(--ink-muted);
  max-width: none;
}

.changelog__badge {
  display: inline-block;
  margin-top: 0.75rem;
  padding: 0.15rem 0.55rem;
  border: 1px solid var(--green-solid);
  border-radius: 999px;
  font-size: var(--step-000);
  font-weight: 600;
  color: var(--green-ink);
  max-width: none;
}

.changelog__badge--muted {
  border-color: var(--rule-strong);
  color: var(--ink-muted);
  font-weight: 500;
}

.changelog__notes :deep(h3),
.changelog__notes :deep(h4) { font-size: var(--step-1); margin-top: 1.6rem; }
.changelog__notes :deep(h3:first-child),
.changelog__notes :deep(h4:first-child) { margin-top: 0; }
.changelog__notes :deep(p) { font-size: var(--step-00); }
.changelog__notes :deep(li) { font-size: var(--step-00); }
.changelog__notes :deep(a) {
  color: var(--green-ink);
  text-decoration: underline;
  text-underline-offset: 0.22em;
}
.changelog__notes :deep(code) {
  background: var(--paper-sunk);
  border: 1px solid var(--rule);
  border-radius: 3px;
  padding: 0.1em 0.35em;
}

.changelog__link { margin-top: 1.5rem; font-size: var(--step-00); }

.changelog__empty-title { font-size: var(--step-2); margin-bottom: 0.6rem; }

@media (max-width: 52rem) {
  .changelog__item { grid-template-columns: minmax(0, 1fr); }
  .changelog__aside { position: static; }
}
</style>
