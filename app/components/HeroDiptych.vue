<script setup lang="ts">
/**
 * L'ancre visuelle du site : à gauche la note dans Pensly, à droite le fichier
 * .md qui s'écrit au même instant. Ce n'est pas une décoration — c'est la
 * promesse du produit, démontrée plutôt qu'affirmée.
 *
 * L'animation se joue une fois à l'entrée. Sous prefers-reduced-motion, seul
 * l'état final est affiché (règle globale dans base.css, plus la neutralisation
 * explicite en bas de ce fichier).
 */

const { t } = useI18n()

interface Typed { text: string, delay: number, dur: number, tone?: 'muted' }

const MONO_SPEED = 0.010
const PROSE_SPEED = 0.014
const MIN_DUR = 0.22
const GAP = 0.05

/** Enchaîne des lignes à partir d'un instant donné, à vitesse de frappe constante. */
function schedule(texts: (string | [string, 'muted'])[], start: number, speed: number): Typed[] {
  let clock = start
  return texts.map((entry) => {
    const [text, tone] = Array.isArray(entry) ? entry : [entry, undefined]
    const dur = Math.max(MIN_DUR, text.length * speed)
    const line: Typed = { text, dur, delay: clock, tone: tone as 'muted' | undefined }
    clock += dur + GAP
    return line
  })
}

const endOf = (lines: Typed[]) => lines.reduce((max, l) => Math.max(max, l.delay + l.dur), 0)

/* Les deux colonnes partagent les mêmes instants de départ : c'est ce qui donne
   l'impression que la note et le fichier s'écrivent ensemble. */
const T_META = 0.20
const T_TAGS = 0.85
const T_BODY = 2.45

const noteTitle = computed(() => t('home.diptych.noteTitle'))
const tag1 = computed(() => t('home.diptych.tag1'))
const tag2 = computed(() => t('home.diptych.tag2'))
const bodyLines = computed(() => [
  t('home.diptych.line1'),
  t('home.diptych.line2'),
  t('home.diptych.line3'),
])

/* --- Colonne gauche : la note dans l'application ------------------------- */

const appTitle = computed(() => schedule([noteTitle.value], T_META, PROSE_SPEED)[0]!)
const appTags = computed(() => schedule([`${tag1.value} ${tag2.value}`], T_TAGS, PROSE_SPEED)[0]!)
const appBody = computed(() => schedule(bodyLines.value, T_BODY, PROSE_SPEED))

/* --- Colonne droite : le fichier sur le disque --------------------------- */

const fileHead = computed(() => schedule([
  ['---', 'muted'],
  `title: ${noteTitle.value}`,
], T_META, MONO_SPEED))

const fileMeta = computed(() => schedule([
  `tags: [${tag1.value}, ${tag2.value}]`,
  'pinned: false',
  'created_at: 2026-07-14T09:12:00',
  'updated_at: 2026-07-14T09:18:33',
  ['---', 'muted'],
], T_TAGS, MONO_SPEED))

const fileBody = computed(() => schedule([
  `# ${noteTitle.value}`,
  ...bodyLines.value.map(line => `- ${line}`),
], T_BODY, MONO_SPEED))

const endsAt = computed(() => Math.max(endOf(appBody.value), endOf(fileBody.value)))

function typeStyle(line: Typed) {
  return {
    '--d': `${line.delay.toFixed(2)}s`,
    '--t': `${line.dur.toFixed(2)}s`,
    '--n': String(Math.max(3, line.text.length)),
  }
}

const fadeStyle = computed(() => ({ '--d': `${(endsAt.value + 0.15).toFixed(2)}s` }))

/* Rejouer : on remonte le sous-arbre pour relancer les animations CSS. */
const runKey = ref(0)
</script>

<template>
  <figure class="diptych">
    <div :key="runKey" class="diptych__panels">
      <!-- Dans l'application -->
      <div class="diptych__col">
        <p class="diptych__label">{{ t('home.diptych.appLabel') }}</p>

        <div class="mock">
          <div class="mock__bar">
            <span class="mock__dots" aria-hidden="true"><i /><i /><i /></span>
            <span class="mock__app">{{ t('home.diptych.windowTitle') }}</span>
          </div>

          <div class="mock__body">
            <p class="mock__title">
              <span class="type" :style="typeStyle(appTitle)">{{ appTitle.text }}</span>
            </p>

            <p class="mock__tags">
              <span class="type" :style="typeStyle(appTags)">
                <span class="mock__tag">{{ tag1 }}</span>
                <span class="mock__tag">{{ tag2 }}</span>
              </span>
            </p>

            <p v-for="line in appBody" :key="line.text" class="mock__line">
              <span class="type" :style="typeStyle(line)">{{ line.text }}</span>
            </p>

            <p class="mock__saved fade" :style="fadeStyle">
              <Icon name="lucide:check" :size="14" />
              <span>{{ t('home.diptych.savedLabel') }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Sur le disque -->
      <div class="diptych__col">
        <p class="diptych__label">{{ t('home.diptych.fileLabel') }}</p>

        <p class="diptych__path path">
          <Icon name="lucide:file-text" :size="14" />
          <span>{{ t('home.diptych.path') }}</span>
        </p>

        <pre class="file"><code
          v-for="(line, i) in fileHead"
          :key="`head-${i}`"
          class="file__line"
        ><span class="type" :class="line.tone && `is-${line.tone}`" :style="typeStyle(line)">{{ line.text }}</span></code><code
          v-for="(line, i) in fileMeta"
          :key="`meta-${i}`"
          class="file__line"
        ><span class="type" :class="line.tone && `is-${line.tone}`" :style="typeStyle(line)">{{ line.text }}</span></code><code class="file__line file__line--blank"> </code><code
          v-for="(line, i) in fileBody"
          :key="`body-${i}`"
          class="file__line"
        ><span class="type" :style="typeStyle(line)">{{ line.text }}</span></code><code class="file__line"><span class="file__caret fade" :style="fadeStyle" aria-hidden="true" /></code></pre>
      </div>
    </div>

    <figcaption class="diptych__caption">
      {{ t('home.diptych.caption') }}
      <button type="button" class="diptych__replay" @click="runKey++">
        <Icon name="lucide:rotate-ccw" :size="14" />
        <span>{{ t('home.diptych.replayLabel') }}</span>
      </button>
    </figcaption>
  </figure>
</template>

<style scoped>
.diptych { margin: 0; }

/* Asymétrie assumée : le fichier, qui est l'argument, prend plus de place. */
.diptych__panels {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: clamp(1.25rem, 3vw, 2.25rem);
  align-items: start;
}

.diptych__col { min-width: 0; }

.diptych__label {
  margin-bottom: 0.6rem;
  font-family: var(--font-mono);
  font-size: var(--step-000);
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-muted);
  max-width: none;
}

.diptych__path {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.55rem;
  max-width: none;
}

.diptych__path svg { flex: none; }

/* --- Fenêtre de l'application ------------------------------------------- */

.mock {
  border: 1px solid var(--rule);
  border-radius: var(--radius-lg);
  background: var(--paper-raised);
  box-shadow: var(--shade-2);
  overflow: hidden;
}

.mock__bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.55rem 0.85rem;
  border-bottom: 1px solid var(--rule);
  background: var(--paper-sunk);
}

.mock__dots { display: inline-flex; gap: 0.3rem; }

.mock__dots i {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--rule-strong);
}

.mock__app {
  font-family: var(--font-mono);
  font-size: var(--step-000);
  color: var(--ink-muted);
}

.mock__body { padding: clamp(1rem, 2.5vw, 1.4rem); min-height: 15rem; }

.mock__title {
  font-family: var(--font-display);
  font-size: var(--step-2);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.02em;
  font-variation-settings: 'SOFT' 40, 'WONK' 1;
  max-width: none;
}

.mock__tags { margin-top: 0.6rem; max-width: none; }

.mock__tag {
  display: inline-block;
  padding: 0.1rem 0.5rem;
  margin-right: 0.35rem;
  border: 1px solid var(--rule-strong);
  border-radius: 999px;
  font-size: var(--step-000);
  color: var(--ink-muted);
}

.mock__line {
  margin-top: 0.75rem;
  font-size: var(--step-00);
  line-height: 1.6;
  max-width: none;
}

.mock__saved {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 1.25rem;
  font-size: var(--step-000);
  color: var(--ink-muted);
  max-width: none;
}

/* --- Le fichier ---------------------------------------------------------- */

.file {
  margin: 0;
  padding: clamp(0.9rem, 2.2vw, 1.25rem);
  border: 1px solid var(--rule);
  border-radius: var(--radius-lg);
  background: var(--paper-raised);
  box-shadow: var(--shade-2);
  overflow-x: auto;
  font-size: var(--step-000);
  line-height: 1.85;
  min-height: 15rem;
  tab-size: 2;
}

.file__line { display: block; white-space: pre; }
.file__line--blank { height: 1.85em; }

.file .is-muted { color: var(--ink-muted); }

.file__caret {
  display: inline-block;
  width: 0.55em;
  height: 1.05em;
  vertical-align: -0.18em;
  background: var(--green-ink);
}

/* --- Légende ------------------------------------------------------------- */

.diptych__caption {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem 1rem;
  margin-top: 1.1rem;
  font-size: var(--step-00);
  color: var(--ink-muted);
  max-width: 62ch;
}

.diptych__replay {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.4rem;
  border: 0;
  border-radius: 3px;
  background: none;
  color: var(--ink-muted);
  font-size: var(--step-000);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.diptych__replay:hover { color: var(--ink); }

/* --- L'animation --------------------------------------------------------- */

.type {
  display: inline-block;
  clip-path: inset(0 100% 0 0);
  animation: diptych-write var(--t) steps(var(--n), end) var(--d) forwards;
}

.fade {
  opacity: 0;
  animation: diptych-fade 0.35s var(--ease) var(--d) forwards;
}

@keyframes diptych-write {
  to { clip-path: inset(0 0 0 0); }
}

@keyframes diptych-fade {
  to { opacity: 1; }
}

@media (max-width: 60rem) {
  .diptych__panels { grid-template-columns: minmax(0, 1fr); }
  .mock__body, .file { min-height: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .type { clip-path: none; animation: none; }
  .fade { opacity: 1; animation: none; }
  /* Rien à rejouer si rien ne bouge. */
  .diptych__replay { display: none; }
}
</style>
