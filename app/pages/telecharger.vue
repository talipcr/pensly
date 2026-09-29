<script setup lang="ts">
defineI18nRoute({
  paths: {
    fr: '/telecharger',
    en: '/download',
    es: '/descargar',
  },
})

const { t, locale } = useI18n()
const config = useRuntimeConfig()
const release = useLatestRelease()

useSeoMeta({
  title: () => t('download.meta.title'),
  description: () => t('download.meta.description'),
  ogTitle: () => t('download.meta.title'),
  ogDescription: () => t('download.meta.description'),
})

defineOgImageComponent('PandaKeepOg', {
  title: t('download.title'),
  description: t('common.windowsOnly'),
})

const sizeLabel = computed(() => formatSize(release.size, locale.value))
const dateLabel = computed(() => formatDate(release.publishedAt, locale.value))

const steps = computed(() => [
  { title: t('download.step1Title'), body: t('download.step1Body') },
  { title: t('download.step2Title'), body: t('download.step2Body') },
  { title: t('download.step3Title'), body: t('download.step3Body') },
  { title: t('download.step4Title'), body: t('download.step4Body') },
])
</script>

<template>
  <article>
    <!-- ── En-tête + carte de téléchargement ───────────────────────────────── -->
    <section class="section">
      <div class="wrap grid-asym">
        <div class="stack">
          <h1>{{ t('download.title') }}</h1>
          <p class="lede">{{ t('download.lede') }}</p>
          <PlatformNotice />
        </div>

        <div class="card release">
          <p class="eyebrow">{{ t('download.cardTitle') }}</p>

          <p v-if="release.ok" class="release__version">{{ release.version }}</p>
          <p v-else class="release__version release__version--unknown">
            {{ t('download.cardUnavailable') }}
          </p>

          <dl v-if="release.ok" class="release__meta">
            <div>
              <dt>{{ t('common.size') }}</dt>
              <dd>{{ sizeLabel }}</dd>
            </div>
            <div>
              <dt>{{ t('common.published') }}</dt>
              <dd>
                <time :datetime="release.publishedAt">{{ dateLabel }}</time>
              </dd>
            </div>
          </dl>

          <DownloadButton class="release__cta" size="lg" block show-file />

          <p v-if="!release.ok" class="release__fallback">{{ t('common.fallbackNotice') }}</p>

          <ul class="release__links">
            <li v-if="release.signatureUrl">
              <a class="prose-link" :href="release.signatureUrl" rel="noopener noreferrer">
                {{ t('download.signature') }}
              </a>
            </li>
            <li>
              <a class="prose-link" :href="release.allReleasesUrl" rel="noopener noreferrer">
                {{ t('common.allVersions') }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ── Prérequis + installation ────────────────────────────────────────── -->
    <section class="band section" aria-labelledby="install-title">
      <div class="wrap grid-asym">
        <div>
          <h2 id="install-title">{{ t('download.stepsTitle') }}</h2>
          <ol class="list-numbered install__steps">
            <li v-for="step in steps" :key="step.title">
              <div>
                <h3 class="install__step-title">{{ step.title }}</h3>
                <p>{{ step.body }}</p>
              </div>
            </li>
          </ol>
        </div>

        <div class="card">
          <h2 class="card__title install__req-title">
            <Icon class="card__icon" name="lucide:monitor-check" :size="20" />
            <span>{{ t('download.requirementsTitle') }}</span>
          </h2>
          <ul class="list-ticks">
            <li>
              <Icon name="lucide:check" :size="18" />
              <span>{{ t('download.req1') }}</span>
            </li>
            <li>
              <Icon name="lucide:check" :size="18" />
              <span>{{ t('download.req2') }}</span>
            </li>
            <li>
              <Icon name="lucide:check" :size="18" />
              <span>{{ t('download.req3') }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ── SmartScreen : le point décisif ──────────────────────────────────── -->
    <section id="smartscreen" class="section" aria-labelledby="smartscreen-title">
      <div class="wrap">
        <div class="smartscreen">
          <div class="smartscreen__intro">
            <p class="eyebrow">{{ t('download.smartscreen.eyebrow') }}</p>
            <h2 id="smartscreen-title">{{ t('download.smartscreen.title') }}</h2>
            <p class="smartscreen__body">{{ t('download.smartscreen.body') }}</p>

            <h3 class="smartscreen__sub">{{ t('download.smartscreen.whyTitle') }}</h3>
            <p>{{ t('download.smartscreen.whyBody') }}</p>
          </div>

          <div class="smartscreen__how card">
            <h3 class="card__title">
              <Icon class="card__icon" name="lucide:shield-check" :size="20" />
              <span>{{ t('download.smartscreen.howTitle') }}</span>
            </h3>

            <ol class="list-numbered smartscreen__steps">
              <li><p>{{ t('download.smartscreen.how1') }}</p></li>
              <li><p>{{ t('download.smartscreen.how2') }}</p></li>
            </ol>

            <p class="smartscreen__after">{{ t('download.smartscreen.afterBody') }}</p>
          </div>
        </div>

        <div class="callout smartscreen__trust">
          <Icon class="callout__icon" name="lucide:message-circle-question" :size="20" />
          <div>
            <h3 class="smartscreen__trust-title">{{ t('download.smartscreen.trustTitle') }}</h3>
            <p>{{ t('download.smartscreen.trustBody') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Vérification de la signature ────────────────────────────────────── -->
    <section class="section" aria-labelledby="verify-title">
      <div class="wrap grid-asym">
        <div class="stack">
          <h2 id="verify-title">{{ t('download.verify.title') }}</h2>
          <p>{{ t('download.verify.body') }}</p>

          <ul class="list-ticks verify__list">
            <li>
              <Icon name="lucide:check" :size="18" />
              <span>{{ t('download.verify.item1') }}</span>
            </li>
            <li>
              <Icon name="lucide:check" :size="18" />
              <span>{{ t('download.verify.item2') }}</span>
            </li>
            <li>
              <Icon name="lucide:check" :size="18" />
              <span>{{ t('download.verify.item3') }}</span>
            </li>
          </ul>

          <p v-if="release.signatureUrl" class="verify__file path">
            {{ release.fileName }}.sig
          </p>
        </div>

        <div class="card verify__honesty">
          <h3 class="card__title">
            <Icon class="card__icon" name="lucide:triangle-alert" :size="20" />
            <span>{{ t('download.verify.honestyTitle') }}</span>
          </h3>
          <p>{{ t('download.verify.honestyBody') }}</p>
        </div>
      </div>
    </section>

    <!-- ── Versions précédentes ────────────────────────────────────────────── -->
    <section class="section--tight" aria-labelledby="previous-title">
      <div class="wrap">
        <div class="previous">
          <div>
            <h2 id="previous-title" class="previous__title">{{ t('download.previousTitle') }}</h2>
            <p>{{ t('download.previousBody') }}</p>
          </div>
          <a class="btn btn--ghost" :href="`${config.public.repoUrl}/releases`" rel="noopener noreferrer">
            <Icon class="btn__icon" name="lucide:github" :size="18" />
            <span>{{ t('common.allVersions') }}</span>
          </a>
        </div>
      </div>
    </section>
  </article>
</template>

<style scoped>
/* --- Carte de release ---------------------------------------------------- */

.release { position: sticky; top: 6rem; }

.release__version {
  margin-top: 0.75rem;
  font-family: var(--font-display);
  font-size: var(--step-4);
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.03em;
  font-variation-settings: 'SOFT' 40, 'WONK' 1;
  max-width: none;
}

.release__version--unknown {
  font-size: var(--step-1);
  line-height: 1.3;
  color: var(--ink-muted);
}

.release__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 2rem;
  margin-top: 1.1rem;
  font-size: var(--step-00);
}

.release__meta dt {
  font-family: var(--font-mono);
  font-size: var(--step-000);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-muted);
}

.release__meta dd { margin: 0.15rem 0 0; }

.release__cta { margin-top: 1.5rem; width: 100%; }
.release__cta :deep(.btn) { width: 100%; }

.release__fallback {
  margin-top: 0.9rem;
  font-size: var(--step-000);
  color: var(--ink-muted);
  max-width: none;
}

.release__links {
  display: grid;
  gap: 0.5rem;
  margin-top: 1.25rem;
  padding-top: 1.1rem;
  border-top: 1px solid var(--rule);
  list-style: none;
  font-size: var(--step-00);
}

/* --- Installation -------------------------------------------------------- */

.install__steps { margin-top: 1.75rem; }
.install__step-title { font-size: var(--step-1); margin-bottom: 0.35rem; }
.install__steps p { font-size: var(--step-00); }
.install__req-title { font-size: var(--step-1); margin-bottom: 1.1rem; }

/* --- SmartScreen --------------------------------------------------------- */

.smartscreen {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: clamp(1.75rem, 4vw, 3.5rem);
  align-items: start;
}

.smartscreen__intro h2 { margin-top: 0.9rem; }

.smartscreen__body {
  margin-top: 1.2rem;
  font-size: var(--step-1);
  line-height: 1.5;
}

.smartscreen__sub { margin-top: 2rem; margin-bottom: 0.5rem; font-size: var(--step-1); }

.smartscreen__steps { margin-top: 1.25rem; gap: 1rem; }
.smartscreen__steps p { max-width: none; font-size: var(--step-00); }

.smartscreen__after {
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid var(--rule);
  font-size: var(--step-000);
  color: var(--ink-muted);
  max-width: none;
}

.smartscreen__trust { margin-top: clamp(2rem, 5vw, 3rem); }
.smartscreen__trust-title { font-size: var(--step-1); }

/* --- Vérification -------------------------------------------------------- */

.verify__list { margin-top: 0.5rem; }
.verify__file { margin-top: 0.5rem; }
.verify__honesty p { max-width: none; font-size: var(--step-00); }

/* --- Versions précédentes ------------------------------------------------ */

.previous {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem 2rem;
  padding-top: 1.75rem;
  border-top: 2px solid var(--rule-strong);
}

.previous__title { font-size: var(--step-2); margin-bottom: 0.5rem; }

@media (max-width: 60rem) {
  .release { position: static; }
  .smartscreen { grid-template-columns: minmax(0, 1fr); }
}
</style>
