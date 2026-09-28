<script setup lang="ts">
const { t } = useI18n()
const release = useLatestRelease()
const config = useRuntimeConfig()
const repoUrl = config.public.repoUrl

useSeoMeta({
  title: () => t('home.meta.title'),
  description: () => t('home.meta.description'),
  ogTitle: () => t('home.meta.title'),
  ogDescription: () => t('home.meta.description'),
})

// Les props sont sérialisées au prérendu : ce sont des chaînes, pas des getters.
defineOgImageComponent('PenslyOg', {
  title: t('brand.tagline'),
  description: t('home.hero.lede'),
})

// Schéma SoftwareApplication : la version vient de l'API GitHub lue au build,
// jamais de package.json (qui reste figé à 0.1.0 dans le dépôt de dev).
useHead(() => ({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'Pensly',
      'description': t('home.meta.description'),
      'applicationCategory': 'Productivity',
      'operatingSystem': 'Windows 10, Windows 11',
      'inLanguage': ['fr', 'en', 'es'],
      'license': 'https://opensource.org/licenses/MIT',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'EUR' },
      ...(release.ok
        ? { softwareVersion: release.version, downloadUrl: release.url, fileSize: `${release.size}` }
        : {}),
    }),
  }],
}))

/** Fragment inséré dans une phrase traduite : touches clavier ou code. */
interface Insert { kind: 'kbd' | 'code', values: string[] }
interface Item { key: string, inserts?: Record<string, Insert> }

const proofs = [
  { icon: 'lucide:user-x', key: 'account' },
  { icon: 'lucide:server-off', key: 'server' },
  { icon: 'lucide:eye-off', key: 'telemetry' },
  { icon: 'lucide:file-text', key: 'markdown' },
]

const featureGroups: { id: string, icon: string, items: Item[] }[] = [
  {
    id: 'write',
    icon: 'lucide:pen-line',
    items: [
      { key: 'i1' },
      { key: 'i2' },
      { key: 'i3', inserts: { vars: { kind: 'code', values: ['{{date}}', '{{heure}}', '{{titre}}'] } } },
      { key: 'i4', inserts: { task: { kind: 'code', values: ['- [ ]'] } } },
    ],
  },
  {
    id: 'capture',
    icon: 'lucide:zap',
    items: [
      { key: 'i1', inserts: { keys: { kind: 'kbd', values: ['Ctrl+Shift+N'] } } },
      { key: 'i2' },
      { key: 'i3' },
    ],
  },
  {
    id: 'organize',
    icon: 'lucide:link',
    items: [
      { key: 'i1', inserts: { link: { kind: 'code', values: ['[[wikilink]]'] } } },
      { key: 'i2' },
      { key: 'i3' },
    ],
  },
  {
    id: 'find',
    icon: 'lucide:search',
    items: [
      { key: 'i1' },
      { key: 'i2', inserts: { keys: { kind: 'kbd', values: ['Ctrl+K'] } } },
      { key: 'i3', inserts: { keys: { kind: 'kbd', values: ['Ctrl+N', 'Ctrl+F', 'Ctrl+P', 'Ctrl+D'] } } },
    ],
  },
]

const fileItems: Item[] = [
  { key: 'i1', inserts: { path: { kind: 'code', values: ['Documents/Pensly'] } } },
  { key: 'i2' },
  { key: 'i3' },
  { key: 'i4' },
  { key: 'i5' },
]

const securityCards = [
  { icon: 'lucide:file-lock', key: 'enc' },
  { icon: 'lucide:shield-check', key: 'leak' },
  { icon: 'lucide:history', key: 'history' },
]

const comfort = [
  { icon: 'lucide:sun-moon', key: 'theme' },
  { icon: 'lucide:languages', key: 'lang' },
  { icon: 'lucide:panel-left-close', key: 'sidebar' },
  { icon: 'lucide:refresh-cw', key: 'updates' },
]

const faq = [1, 2, 3, 4, 5, 6]
</script>

<template>
  <!-- ── Hero ────────────────────────────────────────────────────────────── -->
  <section class="hero" aria-labelledby="hero-title">
    <div class="wrap hero__grid">
      <div class="hero__intro">
        <BrandMark :size="56" class="hero__logo" />

        <h1 id="hero-title">{{ t('brand.tagline') }}</h1>

        <p class="hero__lede">{{ t('home.hero.lede') }}</p>

        <div class="hero__actions">
          <DownloadButton size="lg" :label="t('common.downloadWindows')" />
          <a class="btn btn--ghost btn--lg" :href="repoUrl" rel="noopener noreferrer">
            <Icon class="btn__icon" name="lucide:github" :size="20" />
            <span>{{ t('common.onGithub') }}</span>
          </a>
        </div>

        <p class="hero__meta">{{ t('home.hero.meta') }}</p>

        <PlatformNotice class="hero__platform" />
      </div>

      <!-- Captures à remplacer : public/screenshots/hero-light.png et hero-dark.png (1600×1000). -->
      <div class="window hero__shot">
        <div class="window__bar" aria-hidden="true">
          <BrandMark :size="14" />
          <span class="window__title">Pensly</span>
          <span class="window__controls"><i /><i /><i /></span>
        </div>
        <img
          class="window__img window__img--light"
          src="/screenshots/hero-light.png"
          :alt="t('home.hero.shotAlt')"
          width="1600"
          height="1000"
          fetchpriority="high"
        >
        <img
          class="window__img window__img--dark"
          src="/screenshots/hero-dark.png"
          :alt="t('home.hero.shotAlt')"
          width="1600"
          height="1000"
          loading="lazy"
        >
      </div>
    </div>
  </section>

  <!-- ── Bandeau de preuves ──────────────────────────────────────────────── -->
  <section class="proofs" :aria-label="t('home.proofs.label')">
    <ul class="wrap proofs__list">
      <li v-for="proof in proofs" :key="proof.key" class="proofs__pill">
        <Icon :name="proof.icon" :size="18" />
        <span>{{ t(`home.proofs.${proof.key}`) }}</span>
      </li>
    </ul>
  </section>

  <!-- ── Fonctionnalités ─────────────────────────────────────────────────── -->
  <section id="features" class="section" aria-labelledby="features-title">
    <div class="wrap">
      <div class="section__head">
        <p class="eyebrow">{{ t('home.features.eyebrow') }}</p>
        <h2 id="features-title">{{ t('home.features.title') }}</h2>
      </div>

      <div class="features">
        <article v-for="group in featureGroups" :key="group.id" class="card card--hover">
          <h3 class="card__title">
            <Icon class="card__icon" :name="group.icon" :size="20" />
            <span>{{ t(`home.features.${group.id}.title`) }}</span>
          </h3>
          <ul class="features__list">
            <li v-for="item in group.items" :key="item.key">
              <i18n-t :keypath="`home.features.${group.id}.${item.key}`" tag="span">
                <template v-for="(insert, name) in item.inserts" :key="name" #[name]>
                  <template v-for="(value, i) in insert.values" :key="value">
                    <template v-if="i > 0">, </template>
                    <KeyCombo v-if="insert.kind === 'kbd'" :combo="value" />
                    <code v-else class="code-inline">{{ value }}</code>
                  </template>
                </template>
              </i18n-t>
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>

  <!-- ── Vos fichiers, pas notre cloud ───────────────────────────────────── -->
  <section id="privacy" class="section files" aria-labelledby="files-title">
    <div class="wrap files__grid">
      <div>
        <p class="eyebrow">{{ t('home.files.eyebrow') }}</p>
        <h2 id="files-title">{{ t('home.files.title') }}</h2>
        <p class="files__body">{{ t('home.files.body') }}</p>

        <ul class="list-ticks files__list">
          <li v-for="item in fileItems" :key="item.key">
            <Icon name="lucide:check" :size="18" />
            <i18n-t :keypath="`home.files.${item.key}`" tag="span">
              <template v-for="(insert, name) in item.inserts" :key="name" #[name]>
                <code v-for="value in insert.values" :key="value" class="code-inline">{{ value }}</code>
              </template>
            </i18n-t>
          </li>
        </ul>
      </div>

      <figure class="mdfile">
        <figcaption class="mdfile__bar">
          <Icon name="lucide:file-text" :size="15" />
          <span>{{ t('home.files.fileLabel') }}</span>
        </figcaption>
        <pre class="mdfile__code"><code><span class="md-muted">---</span>
<span class="md-key">title:</span> {{ t('home.files.fm.title') }}
<span class="md-key">tags:</span> [{{ t('home.files.fm.tag1') }}, {{ t('home.files.fm.tag2') }}]
<span class="md-key">pinned:</span> true
<span class="md-muted">---</span>
<span class="md-muted">- [ ]</span> {{ t('home.files.fm.task') }} <span class="md-link">[[{{ t('home.files.fm.link') }}]]</span></code></pre>
      </figure>
    </div>
  </section>

  <!-- ── Sécurité et fiabilité ───────────────────────────────────────────── -->
  <section id="security" class="section" aria-labelledby="security-title">
    <div class="wrap">
      <div class="section__head">
        <p class="eyebrow">{{ t('home.security.eyebrow') }}</p>
        <h2 id="security-title">{{ t('home.security.title') }}</h2>
      </div>

      <ul class="card-grid security">
        <li v-for="card in securityCards" :key="card.key" class="card">
          <h3 class="card__title">
            <Icon class="card__icon" :name="card.icon" :size="20" />
            <span>{{ t(`home.security.${card.key}Title`) }}</span>
          </h3>
          <p>{{ t(`home.security.${card.key}Body`) }}</p>
        </li>
      </ul>

      <!-- L'unique touche chaude (--pin) de la page. -->
      <p class="security__warn">
        <Icon class="security__warn-icon" name="lucide:triangle-alert" :size="18" />
        <span><strong>{{ t('home.security.warnTitle') }}</strong> {{ t('home.security.warnBody') }}</span>
      </p>
    </div>
  </section>

  <!-- ── IA ──────────────────────────────────────────────────────────────── -->
  <section id="ai" class="section ai" aria-labelledby="ai-title">
    <div class="wrap">
      <div class="section__head">
        <p class="eyebrow">{{ t('home.ai.eyebrow') }}</p>
        <h2 id="ai-title">{{ t('home.ai.title') }}</h2>
        <p class="lede">{{ t('home.ai.lede') }}</p>
      </div>

      <figure class="ai__demo">
        <p class="ai__demo-text">
          <span>{{ t('home.ai.demoText') }}</span><span class="ai__ghost">{{ t('home.ai.demoGhost') }}</span><span class="ai__caret" aria-hidden="true" />
        </p>
        <figcaption class="ai__hint">
          <span class="visually-hidden">{{ t('home.ai.demoLabel') }} — </span>
          <i18n-t keypath="home.ai.hint" tag="span">
            <template #tab><kbd class="kbd">Tab</kbd></template>
            <template #esc><kbd class="kbd">{{ t('home.ai.escKey') }}</kbd></template>
          </i18n-t>
        </figcaption>
      </figure>

      <div class="ai__options">
        <article class="card">
          <h3 class="card__title">
            <Icon class="card__icon" name="lucide:hard-drive" :size="20" />
            <span>{{ t('home.ai.localTitle') }}</span>
          </h3>
          <p class="badge">{{ t('home.ai.localBadge') }}</p>
          <i18n-t keypath="home.ai.localBody" tag="p">
            <template #models>
              <code class="code-inline">gemma3:1b</code>, <code class="code-inline">qwen2.5:1.5b</code>
            </template>
          </i18n-t>
        </article>

        <article class="card">
          <h3 class="card__title">
            <Icon class="card__icon" name="lucide:cloud" :size="20" />
            <span>{{ t('home.ai.cloudTitle') }}</span>
          </h3>
          <p class="badge">{{ t('home.ai.cloudBadge') }}</p>
          <p>{{ t('home.ai.cloudBody') }}</p>
        </article>
      </div>
    </div>
  </section>

  <!-- ── Confort ─────────────────────────────────────────────────────────── -->
  <section class="comfort" aria-labelledby="comfort-title">
    <div class="wrap comfort__inner">
      <h2 id="comfort-title" class="eyebrow">{{ t('home.comfort.title') }}</h2>
      <ul class="comfort__list">
        <li v-for="item in comfort" :key="item.key">
          <Icon :name="item.icon" :size="18" />
          <span>{{ t(`home.comfort.${item.key}`) }}</span>
        </li>
      </ul>
    </div>
  </section>

  <!-- ── FAQ ─────────────────────────────────────────────────────────────── -->
  <section id="faq" class="section" aria-labelledby="faq-title">
    <div class="wrap wrap--narrow">
      <div class="section__head">
        <p class="eyebrow">{{ t('home.faq.eyebrow') }}</p>
        <h2 id="faq-title">{{ t('home.faq.title') }}</h2>
      </div>

      <div class="faq">
        <details v-for="n in faq" :key="n" class="faq__item">
          <summary class="faq__q">
            <span>{{ t(`home.faq.q${n}`) }}</span>
            <Icon class="faq__chevron" name="lucide:chevron-down" :size="20" />
          </summary>
          <p class="faq__a">{{ t(`home.faq.a${n}`) }}</p>
        </details>
      </div>
    </div>
  </section>

  <!-- ── Appel final ─────────────────────────────────────────────────────── -->
  <section class="section final-cta" aria-labelledby="cta-title">
    <div class="wrap final-cta__inner">
      <BrandMark :size="48" />
      <h2 id="cta-title">{{ t('home.cta.title') }}</h2>
      <p>{{ t('home.cta.body') }}</p>
      <DownloadButton size="lg" :label="t('common.downloadWindows')" />
      <p class="final-cta__meta">{{ t('home.hero.meta') }}</p>
      <p v-if="!release.ok" class="final-cta__meta">{{ t('common.fallbackNotice') }}</p>
    </div>
  </section>
</template>

<style scoped>
/* --- Titres de section --------------------------------------------------- */

.section__head { margin-bottom: clamp(1.75rem, 4vw, 2.75rem); }
.section__head h2 { margin-top: 0.75rem; }
.section__head .lede { margin-top: 1rem; }

.code-inline {
  padding: 0.1em 0.35em;
  border: 1px solid var(--rule);
  border-radius: var(--radius-sm);
  background: var(--paper-sunk);
  color: var(--ink);
  font-size: 0.85em;
  white-space: nowrap;
}

/* --- Hero ---------------------------------------------------------------- */

.hero { padding-block: clamp(2.5rem, 7vw, 5.5rem) clamp(2.5rem, 6vw, 4.5rem); }

.hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(2.5rem, 6vw, 4rem);
  align-items: center;
}

@media (min-width: 64rem) {
  .hero__grid { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); }
}

.hero__logo { margin-bottom: 1.5rem; }

.hero__lede {
  margin-top: 1.25rem;
  font-size: var(--step-1);
  line-height: 1.55;
  color: var(--ink-2);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

.hero__meta {
  margin-top: 1rem;
  /* Inter transforme « 11 x64 » en « 11 ×64 » : on coupe cette alternance. */
  font-feature-settings: 'calt' 0;
  font-size: var(--step-00);
  color: var(--ink-muted);
}

.hero__platform { margin-top: 1.5rem; }

/* Cadre de fenêtre autour de la capture */
.window {
  border: 1px solid var(--rule);
  border-radius: var(--radius-lg);
  background: var(--paper-raised);
  box-shadow: var(--shade-2);
  overflow: hidden;
}

.window__bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 2.25rem;
  padding-inline: 0.85rem;
  border-bottom: 1px solid var(--rule);
  background: var(--paper-side);
}

.window__title { font-size: 0.8125rem; color: var(--ink-muted); }

.window__controls { display: inline-flex; gap: 1.1rem; margin-left: auto; }

.window__controls i {
  width: 0.65rem;
  height: 0.65rem;
  border: 1.5px solid var(--ink-muted);
  border-radius: 2px;
  opacity: 0.55;
}

.window__controls i:first-child { height: 0; border-width: 1.5px 0 0; border-radius: 0; align-self: center; }

.window__img {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  background: var(--paper-sunk);
}

.window__img--dark { display: none; }
:global(.dark .window__img--light) { display: none; }
:global(.dark .window__img--dark) { display: block; }

/* --- Preuves ------------------------------------------------------------- */

.proofs {
  border-block: 1px solid var(--rule);
  background: var(--paper-side);
  padding-block: 1.25rem;
}

.proofs__list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  list-style: none;
  padding: 0;
}

.proofs__pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  background: var(--green-light);
  color: var(--ink);
  font-size: var(--step-00);
  font-weight: 500;
}

.proofs__pill svg { color: var(--green-ink); flex: none; }

/* --- Fonctionnalités ----------------------------------------------------- */

.features {
  display: grid;
  gap: clamp(1rem, 2.5vw, 1.5rem);
  grid-template-columns: minmax(0, 1fr);
}

@media (min-width: 48rem) {
  .features { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

.features__list {
  display: grid;
  gap: 0.6rem;
  margin-top: 0.75rem;
  padding-left: 1.1rem;
  color: var(--ink-2);
  font-size: var(--step-00);
  line-height: 1.6;
}

.features__list li::marker { color: var(--green-icon); }

/* --- Fichiers ------------------------------------------------------------ */

.files {
  background: var(--green-tint);
  border-block: 1px solid var(--rule);
}

.files__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(2rem, 5vw, 4rem);
  align-items: center;
}

@media (min-width: 60rem) {
  .files__grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
}

.files h2 { margin-top: 0.75rem; }
.files__body { margin-top: 1rem; color: var(--ink-2); }
.files__list { margin-top: 1.5rem; color: var(--ink-2); }

.mdfile {
  margin: 0;
  border: 1px solid var(--rule);
  border-radius: var(--radius-lg);
  background: var(--paper-raised);
  box-shadow: var(--shade-2);
  overflow: hidden;
}

.mdfile__bar {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 1rem;
  border-bottom: 1px solid var(--rule);
  background: var(--paper-side);
  font-size: 0.8125rem;
  color: var(--ink-muted);
}

.mdfile__bar svg { flex: none; }

.mdfile__code {
  margin: 0;
  padding: clamp(1rem, 3vw, 1.5rem);
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.8;
  color: var(--ink);
}

.md-muted { color: var(--ink-muted); }
.md-key { color: var(--green-ink); }
.md-link { color: var(--green-ink); text-decoration: underline; text-underline-offset: 0.2em; }

/* --- Sécurité ------------------------------------------------------------ */

.security { list-style: none; padding: 0; }
.security p { color: var(--ink-2); font-size: var(--step-00); }

.security__warn {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  margin-top: 1.5rem;
  max-width: none;
  color: var(--ink-2);
  font-size: var(--step-00);
}

.security__warn-icon { color: var(--pin); flex: none; margin-top: 0.15rem; }

/* --- IA ------------------------------------------------------------------ */

.ai { background: var(--paper-sunk); }

.ai__demo {
  margin: 0 0 clamp(1.5rem, 4vw, 2rem);
  padding: clamp(1rem, 3vw, 1.5rem);
  border: 1px solid var(--rule);
  border-radius: var(--radius-lg);
  background: var(--paper-raised);
  box-shadow: var(--shade-1);
}

.ai__demo-text { max-width: none; font-size: var(--step-0); color: var(--ink); }
.ai__ghost { color: var(--ink-muted); font-style: italic; }

.ai__caret {
  display: inline-block;
  width: 2px;
  height: 1.15em;
  margin-left: 1px;
  vertical-align: -0.2em;
  background: var(--green-icon);
  animation: caret-blink 1.1s steps(1) infinite;
}

@keyframes caret-blink { 50% { opacity: 0; } }

.ai__hint {
  margin-top: 0.85rem;
  padding-top: 0.85rem;
  border-top: 1px solid var(--rule-subtle);
  font-size: var(--step-00);
  color: var(--ink-muted);
}

.ai__options {
  display: grid;
  gap: clamp(1rem, 2.5vw, 1.5rem);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
}

.ai__options p { color: var(--ink-2); font-size: var(--step-00); }

.badge {
  display: inline-block;
  margin-bottom: 0.75rem;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  background: var(--green-light);
  color: var(--ink) !important;
  font-size: 0.8125rem !important;
  font-weight: 500;
}

/* --- Confort ------------------------------------------------------------- */

.comfort {
  border-bottom: 1px solid var(--rule);
  padding-block: 1.5rem;
}

.comfort__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 2rem;
}

.comfort__list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.75rem;
  list-style: none;
  padding: 0;
  font-size: var(--step-00);
  color: var(--ink-2);
}

.comfort__list li { display: inline-flex; align-items: center; gap: 0.5rem; }
.comfort__list svg { color: var(--green-icon); flex: none; }

/* --- FAQ ----------------------------------------------------------------- */

.faq { border-top: 1px solid var(--rule); }

.faq__item { border-bottom: 1px solid var(--rule); }

.faq__q {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 3.5rem;
  padding-block: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  list-style: none;
  transition: color var(--dur-fast) var(--ease);
}

.faq__q::-webkit-details-marker { display: none; }
.faq__q:hover { color: var(--green-ink); }

.faq__chevron {
  flex: none;
  color: var(--ink-muted);
  transition: transform var(--dur-fast) var(--ease);
}

.faq__item[open] .faq__chevron { transform: rotate(180deg); }

.faq__a { padding-bottom: 1.1rem; color: var(--ink-2); }

/* --- Appel final --------------------------------------------------------- */

.final-cta {
  background: var(--paper-side);
  border-top: 1px solid var(--rule);
}

.final-cta__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}

.final-cta__inner p { color: var(--ink-2); }
.final-cta__inner .download-btn { margin-top: 0.5rem; justify-items: center; }

.final-cta__meta { font-size: var(--step-00); color: var(--ink-muted) !important; font-feature-settings: 'calt' 0; }
</style>
