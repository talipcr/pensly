<script setup lang="ts">
defineI18nRoute({
  paths: {
    fr: '/guide',
    en: '/guide',
    es: '/guia',
  },
})

const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: () => t('guide.meta.title'),
  description: () => t('guide.meta.description'),
  ogTitle: () => t('guide.meta.title'),
  ogDescription: () => t('guide.meta.description'),
})

defineOgImageComponent('PenslyOg', {
  title: t('guide.title'),
  description: t('guide.lede'),
})

const sections = computed(() => [
  { id: 'demarrage', label: t('guide.start.title') },
  { id: 'raccourcis', label: t('guide.shortcuts.title') },
  { id: 'fichiers', label: t('guide.files.title') },
  { id: 'import', label: t('guide.import.title') },
  { id: 'reglages', label: t('guide.comfort.title') },
])

const startSteps = computed(() => [
  { title: t('guide.start.step1Title'), body: t('guide.start.step1Body') },
  { title: t('guide.start.step2Title'), body: t('guide.start.step2Body') },
  { title: t('guide.start.step3Title'), body: t('guide.start.step3Body') },
  { title: t('guide.start.step4Title'), body: t('guide.start.step4Body') },
])

const shortcuts = computed(() => [
  { combo: 'Ctrl+Shift+N', label: t('guide.shortcuts.global'), global: true },
  { combo: 'Ctrl+N', label: t('guide.shortcuts.new'), global: false },
  { combo: 'Ctrl+F', label: t('guide.shortcuts.search'), global: false },
  { combo: 'Ctrl+D', label: t('guide.shortcuts.delete'), global: false },
  { combo: 'Ctrl+P', label: t('guide.shortcuts.pin'), global: false },
  { combo: 'Ctrl+B', label: t('guide.shortcuts.bold'), global: false },
  { combo: 'Ctrl+I', label: t('guide.shortcuts.italic'), global: false },
])

const settings = computed(() => [
  { icon: 'lucide:sun-moon', title: t('guide.comfort.themeTitle'), body: t('guide.comfort.themeBody') },
  { icon: 'lucide:languages', title: t('guide.comfort.langTitle'), body: t('guide.comfort.langBody') },
  { icon: 'lucide:folder-open', title: t('guide.comfort.folderTitle'), body: t('guide.comfort.folderBody') },
  { icon: 'lucide:refresh-cw', title: t('guide.comfort.updateTitle'), body: t('guide.comfort.updateBody') },
])

const frontmatter = computed(() => [
  '---',
  `title: ${t('home.diptych.noteTitle')}`,
  `tags: [${t('home.diptych.tag1')}, ${t('home.diptych.tag2')}]`,
  'pinned: false',
  'created_at: 2026-07-14T09:12:00',
  'updated_at: 2026-07-14T09:18:33',
  '---',
])
</script>

<template>
  <article>
    <section class="section--tight guide__head">
      <div class="wrap grid-asym">
        <div>
          <h1>{{ t('guide.title') }}</h1>
          <p class="lede guide__lede">{{ t('guide.lede') }}</p>
        </div>

        <nav class="guide__toc" :aria-labelledby="'toc-title'">
          <h2 id="toc-title" class="guide__toc-title">{{ t('guide.tocTitle') }}</h2>
          <ol>
            <li v-for="section in sections" :key="section.id">
              <a class="link-draw" :href="`#${section.id}`">{{ section.label }}</a>
            </li>
          </ol>
        </nav>
      </div>
    </section>

    <!-- ── Démarrage rapide ────────────────────────────────────────────────── -->
    <section id="demarrage" class="section" aria-labelledby="start-title">
      <div class="wrap">
        <h2 id="start-title">{{ t('guide.start.title') }}</h2>

        <ol class="list-numbered guide__steps">
          <li v-for="step in startSteps" :key="step.title">
            <div>
              <h3 class="guide__step-title">{{ step.title }}</h3>
              <p>{{ step.body }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- ── Raccourcis ──────────────────────────────────────────────────────── -->
    <section id="raccourcis" class="band section" aria-labelledby="shortcuts-title">
      <div class="wrap grid-asym">
        <div>
          <h2 id="shortcuts-title" class="visually-hidden">{{ t('guide.shortcuts.title') }}</h2>
          <div class="table-scroll">
            <table class="table">
              <caption>{{ t('guide.shortcuts.caption') }}</caption>
              <thead>
                <tr>
                  <th scope="col">{{ t('guide.shortcuts.colShortcut') }}</th>
                  <th scope="col">{{ t('guide.shortcuts.colAction') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in shortcuts" :key="item.combo">
                  <td><KeyCombo :combo="item.combo" /></td>
                  <td>{{ item.label }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <aside class="callout guide__shortcut-note">
          <Icon class="callout__icon" name="lucide:keyboard" :size="20" />
          <div>
            <p>{{ t('guide.shortcuts.note') }}</p>
          </div>
        </aside>
      </div>
    </section>

    <!-- ── Comment marche la « synchro » ───────────────────────────────────── -->
    <section id="fichiers" class="section" aria-labelledby="files-title">
      <div class="wrap grid-asym">
        <div class="stack">
          <h2 id="files-title">{{ t('guide.files.title') }}</h2>
          <p class="lede guide__lede">{{ t('guide.files.body') }}</p>

          <ol class="list-numbered guide__flow">
            <li><p>{{ t('guide.files.step1') }}</p></li>
            <li><p>{{ t('guide.files.step2') }}</p></li>
            <li><p>{{ t('guide.files.step3') }}</p></li>
          </ol>

          <h3 class="guide__sub">{{ t('guide.files.warnTitle') }}</h3>
          <ul class="list-crosses">
            <li>
              <Icon name="lucide:x" :size="18" />
              <span>{{ t('guide.files.warn1') }}</span>
            </li>
            <li>
              <Icon name="lucide:x" :size="18" />
              <span>{{ t('guide.files.warn2') }}</span>
            </li>
            <li>
              <Icon name="lucide:x" :size="18" />
              <span>{{ t('guide.files.warn3') }}</span>
            </li>
          </ul>
        </div>

        <figure class="guide__file">
          <figcaption class="guide__file-caption">{{ t('guide.files.frontmatterTitle') }}</figcaption>
          <p class="path guide__file-path">
            <Icon name="lucide:file-text" :size="14" />
            <span>{{ t('home.diptych.path') }}</span>
          </p>
          <pre class="code-block"><code v-for="(line, i) in frontmatter" :key="i" :class="{ 'is-muted': line === '---' }">{{ line }}</code><code class="is-blank"> </code><code># {{ t('home.diptych.noteTitle') }}</code><code class="is-blank"> </code><code>- {{ t('home.diptych.line1') }}</code></pre>
        </figure>
      </div>
    </section>

    <!-- ── Import / export ─────────────────────────────────────────────────── -->
    <section id="import" class="section" aria-labelledby="import-title">
      <div class="wrap">
        <div class="guide__import-head">
          <h2 id="import-title">{{ t('guide.import.title') }}</h2>
          <p>{{ t('guide.import.body') }}</p>
        </div>

        <div class="card-grid guide__import-grid">
          <div class="card">
            <h3 class="card__title">
              <Icon class="card__icon" name="lucide:folder-input" :size="20" />
              <span>{{ t('guide.import.obsidianTitle') }}</span>
            </h3>
            <p>{{ t('guide.import.obsidianBody') }}</p>
          </div>

          <div class="card">
            <h3 class="card__title">
              <Icon class="card__icon" name="lucide:package-open" :size="20" />
              <span>{{ t('guide.import.notionTitle') }}</span>
            </h3>
            <p>{{ t('guide.import.notionBody') }}</p>
          </div>

          <div class="card">
            <h3 class="card__title">
              <Icon class="card__icon" name="lucide:folder-output" :size="20" />
              <span>{{ t('guide.import.exportTitle') }}</span>
            </h3>
            <p>{{ t('guide.import.exportBody') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Réglages ────────────────────────────────────────────────────────── -->
    <section id="reglages" class="section" aria-labelledby="settings-title">
      <div class="wrap">
        <h2 id="settings-title">{{ t('guide.comfort.title') }}</h2>

        <dl class="settings">
          <div v-for="item in settings" :key="item.title" class="settings__item">
            <dt class="settings__term">
              <Icon class="settings__icon" :name="item.icon" :size="18" />
              <span>{{ item.title }}</span>
            </dt>
            <dd class="settings__desc">{{ item.body }}</dd>
          </div>
        </dl>

        <p class="guide__back">
          <NuxtLink class="prose-link" :to="localePath('telecharger')">{{ t('common.downloadPage') }}</NuxtLink>
        </p>
      </div>
    </section>
  </article>
</template>

<style scoped>
.guide__head { padding-top: clamp(2.5rem, 6vw, 4rem); }
.guide__lede { max-width: 56ch; margin-top: 1.1rem; }

/* --- Sommaire ------------------------------------------------------------ */

.guide__toc {
  padding: 1.25rem 1.4rem;
  border: 1px solid var(--rule);
  border-radius: var(--radius-lg);
  background: var(--paper-raised);
}

.guide__toc-title {
  font-family: var(--font-mono);
  font-size: var(--step-000);
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-muted);
  margin-bottom: 0.85rem;
}

.guide__toc ol {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: toc;
  font-size: var(--step-00);
}

.guide__toc li { counter-increment: toc; }

.guide__toc li::before {
  content: counter(toc, decimal-leading-zero) ' ';
  font-family: var(--font-mono);
  font-size: var(--step-000);
  color: var(--ink-muted);
}

/* --- Étapes -------------------------------------------------------------- */

.guide__steps { margin-top: 2rem; max-width: 62ch; }
.guide__step-title { font-size: var(--step-1); margin-bottom: 0.35rem; }
.guide__steps p { font-size: var(--step-00); }

.guide__flow { margin-top: 1.75rem; }
.guide__flow p { font-size: var(--step-00); }

.guide__sub { margin-top: 2.25rem; margin-bottom: 1rem; font-size: var(--step-1); }

/* --- Listes de limites --------------------------------------------------- */

.list-crosses {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 0.75rem;
  font-size: var(--step-00);
  color: var(--ink-muted);
}

.list-crosses li {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.65rem;
  align-items: start;
}

.list-crosses svg { margin-top: 0.3rem; flex: none; }

/* --- Le fichier d'exemple ------------------------------------------------ */

.guide__file { margin: 0; }

.guide__file-caption {
  font-family: var(--font-mono);
  font-size: var(--step-000);
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-muted);
  margin-bottom: 0.6rem;
}

.guide__file-path {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.55rem;
}

.code-block {
  margin: 0;
  padding: clamp(0.9rem, 2.2vw, 1.25rem);
  border: 1px solid var(--rule);
  border-radius: var(--radius-lg);
  background: var(--paper-raised);
  box-shadow: var(--shade-1);
  overflow-x: auto;
  font-size: var(--step-000);
  line-height: 1.85;
}

.code-block code { display: block; white-space: pre; }
.code-block .is-muted { color: var(--ink-muted); }
.code-block .is-blank { height: 1.85em; }

/* --- Import -------------------------------------------------------------- */

.guide__import-head { margin-bottom: clamp(1.5rem, 4vw, 2.5rem); }
.guide__import-head p { margin-top: 1rem; }
.guide__import-grid p { max-width: none; font-size: var(--step-00); }

/* --- Réglages ------------------------------------------------------------ */

.settings {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
  gap: clamp(1.25rem, 3vw, 2rem);
  margin-top: 2rem;
}

.settings__item { padding-top: 1rem; border-top: 2px solid var(--rule-strong); }

.settings__term {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-display);
  font-size: var(--step-1);
  font-weight: 600;
  margin-bottom: 0.4rem;
}

.settings__icon { color: var(--green-ink); flex: none; }

.settings__desc { margin: 0; font-size: var(--step-00); color: var(--ink-muted); }

.guide__back { margin-top: clamp(2rem, 5vw, 3rem); }

.guide__shortcut-note { align-self: start; }
.guide__shortcut-note p { font-size: var(--step-00); }
</style>
