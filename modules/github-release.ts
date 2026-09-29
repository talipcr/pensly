import { addTemplate, addTypeTemplate, defineNuxtModule } from 'nuxt/kit'
import { consola } from 'consola'

/**
 * Récupère AU BUILD la dernière release publiée de `talipcr/pensly-releases`
 * et l'expose à l'application via `#build/pandakeep-releases.mjs`.
 *
 * Rien n'est jamais codé en dur : l'URL de l'asset change à chaque version.
 * Si l'appel échoue (quota anonyme de l'API GitHub = 60 req/h, réseau coupé,
 * CI hors ligne), on retombe sur la page « releases/latest » du dépôt.
 * Le build ne doit jamais produire un bouton mort, ni échouer pour autant.
 */

const REPO = 'talipcr/pensly-releases'
const API = `https://api.github.com/repos/${REPO}`
const FALLBACK_URL = `https://github.com/${REPO}/releases/latest`
const ALL_RELEASES_URL = `https://github.com/${REPO}/releases`
const ASSET_PATTERN = /^Pensly_.+_x64-setup\.exe$/i
const SIG_PATTERN = /\.sig$/i

export interface LatestRelease {
  /** true si l'API a répondu et qu'un installeur .exe a été trouvé */
  ok: boolean
  /** true si `url` pointe sur le binaire lui-même, false si c'est le repli */
  direct: boolean
  /** ex. « 1.5.3 » — chaîne vide si indisponible */
  version: string
  /** ex. « v1.5.3 » */
  tag: string
  /** date ISO de publication, chaîne vide si indisponible */
  publishedAt: string
  /** taille de l'installeur en octets, 0 si indisponible */
  size: number
  /** lien de téléchargement direct, ou repli vers la page des releases */
  url: string
  /** nom du fichier, ex. « Pensly_1.5.3_x64-setup.exe » */
  fileName: string
  /** URL du fichier de signature updater (.sig), chaîne vide si absent */
  signatureUrl: string
  /** page GitHub de la release */
  htmlUrl: string
  /** page « toutes les versions » */
  allReleasesUrl: string
}

export interface ReleaseEntry {
  version: string
  tag: string
  name: string
  publishedAt: string
  htmlUrl: string
  /** notes de version converties en HTML sûr au build */
  bodyHtml: string
  prerelease: boolean
}

const emptyLatest: LatestRelease = {
  ok: false,
  direct: false,
  version: '',
  tag: '',
  publishedAt: '',
  size: 0,
  url: FALLBACK_URL,
  fileName: '',
  signatureUrl: '',
  htmlUrl: FALLBACK_URL,
  allReleasesUrl: ALL_RELEASES_URL,
}

interface GhAsset { name: string, size: number, browser_download_url: string }
interface GhRelease {
  tag_name: string
  name: string | null
  body: string | null
  draft: boolean
  prerelease: boolean
  published_at: string
  html_url: string
  assets: GhAsset[]
}

function headers() {
  const h: Record<string, string> = {
    accept: 'application/vnd.github+json',
    'user-agent': 'pandakeep-site-build',
  }
  // Optionnel : relève le quota de 60 à 5000 req/h sur la CI.
  const token = process.env.GITHUB_TOKEN
  if (token) h.authorization = `Bearer ${token}`
  return h
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: headers(), signal: AbortSignal.timeout(10_000) })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return (await res.json()) as T
}

function toLatest(release: GhRelease): LatestRelease {
  const installer = release.assets.find(a => ASSET_PATTERN.test(a.name))
  const signature = release.assets.find(a => SIG_PATTERN.test(a.name) && ASSET_PATTERN.test(a.name.replace(SIG_PATTERN, '')))
  const version = release.tag_name.replace(/^v/i, '')

  if (!installer) {
    return { ...emptyLatest, version, tag: release.tag_name, publishedAt: release.published_at, htmlUrl: release.html_url }
  }

  return {
    ok: true,
    direct: true,
    version,
    tag: release.tag_name,
    publishedAt: release.published_at,
    size: installer.size,
    url: installer.browser_download_url,
    fileName: installer.name,
    signatureUrl: signature?.browser_download_url ?? '',
    htmlUrl: release.html_url,
    allReleasesUrl: ALL_RELEASES_URL,
  }
}

/* --------------------------------------------------------------------------
 * Mini-rendu Markdown, exécuté AU BUILD uniquement.
 * On échappe d'abord la totalité du texte, puis on ré-introduit une liste
 * fermée de balises : aucune injection possible depuis les notes de version.
 * -------------------------------------------------------------------------- */

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function inline(raw: string) {
  let s = escapeHtml(raw)
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>')
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  s = s.replace(/(^|\W)\*([^*\n]+)\*/g, '$1<em>$2</em>')
  // Seuls http(s) sont autorisés ; le texte est déjà échappé.
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>')
  return s
}

function renderMarkdown(md: string) {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const out: string[] = []
  let list: string[] = []
  let para: string[] = []

  const flushList = () => {
    if (!list.length) return
    out.push(`<ul>${list.map(i => `<li>${inline(i)}</li>`).join('')}</ul>`)
    list = []
  }
  const flushPara = () => {
    if (!para.length) return
    out.push(`<p>${inline(para.join(' '))}</p>`)
    para = []
  }
  const flushAll = () => { flushList(); flushPara() }

  for (const line of lines) {
    const t = line.trim()
    if (!t) { flushAll(); continue }

    const heading = /^(#{1,6})\s+(.*)$/.exec(t)
    if (heading) {
      flushAll()
      // Les notes de version vivent sous un <h2> de page : on ne descend pas
      // au-dessus de h3 pour ne pas casser la hiérarchie des titres.
      const level = Math.min(6, Math.max(3, heading[1]!.length + 2))
      out.push(`<h${level}>${inline(heading[2]!)}</h${level}>`)
      continue
    }

    const item = /^[-*+]\s+(.*)$/.exec(t)
    if (item) { flushPara(); list.push(item[1]!); continue }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(t)) { flushAll(); out.push('<hr>'); continue }

    flushList()
    para.push(t)
  }

  flushAll()
  return out.join('\n')
}

export default defineNuxtModule({
  meta: { name: 'pandakeep-github-release' },

  async setup(_options, nuxt) {
    let latest: LatestRelease = { ...emptyLatest }
    let releases: ReleaseEntry[] = []

    try {
      const [latestRaw, listRaw] = await Promise.all([
        getJson<GhRelease>(`${API}/releases/latest`),
        getJson<GhRelease[]>(`${API}/releases?per_page=30`),
      ])

      latest = toLatest(latestRaw)

      releases = listRaw
        .filter(r => !r.draft)
        .map(r => ({
          version: r.tag_name.replace(/^v/i, ''),
          tag: r.tag_name,
          name: r.name?.trim() || r.tag_name,
          publishedAt: r.published_at,
          htmlUrl: r.html_url,
          bodyHtml: renderMarkdown(r.body ?? ''),
          prerelease: r.prerelease,
        }))

      if (!latest.ok) {
        consola.warn(
          `[pandakeep] Release ${latest.tag || '?'} trouvée, mais aucun asset ne correspond à `
          + `« Pensly_*_x64-setup.exe ». Repli sur ${FALLBACK_URL}.`,
        )
      }
      else {
        consola.success(`[pandakeep] Release ${latest.tag} — ${latest.fileName} (${latest.size} o)`)
      }
    }
    catch (error) {
      consola.warn(
        `[pandakeep] API GitHub injoignable (${(error as Error).message}). `
        + `Le site est construit avec le repli : ${FALLBACK_URL}. `
        + 'Aucun bouton mort, mais la version affichée sera absente.',
      )
    }

    const contents = [
      '// Généré au build par modules/github-release.ts — ne pas éditer.',
      `export const latestRelease = ${JSON.stringify(latest, null, 2)}`,
      `export const releases = ${JSON.stringify(releases, null, 2)}`,
      '',
    ].join('\n')

    addTemplate({ filename: 'pandakeep-releases.mjs', write: true, getContents: () => contents })

    addTypeTemplate({
      filename: 'types/pandakeep-releases.d.ts',
      getContents: () => `declare module '#build/pandakeep-releases.mjs' {
  export interface LatestRelease {
    ok: boolean
    direct: boolean
    version: string
    tag: string
    publishedAt: string
    size: number
    url: string
    fileName: string
    signatureUrl: string
    htmlUrl: string
    allReleasesUrl: string
  }
  export interface ReleaseEntry {
    version: string
    tag: string
    name: string
    publishedAt: string
    htmlUrl: string
    bodyHtml: string
    prerelease: boolean
  }
  export const latestRelease: LatestRelease
  export const releases: ReleaseEntry[]
}
`,
    })

    // Utilisé par le JSON-LD et la balise de version dans le pied de page.
    nuxt.options.runtimeConfig.public.pandakeepVersion = latest.version
  },
})
