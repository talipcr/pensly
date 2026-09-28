import { latestRelease, releases } from '#build/pensly-releases.mjs'

/**
 * Données de release figées au build (voir modules/github-release.ts).
 * Rien n'est récupéré côté navigateur : le site reste 100 % statique et
 * n'émet aucune requête vers un domaine tiers à l'exécution.
 */
export function useLatestRelease() {
  return latestRelease
}

export function useReleases() {
  return releases
}

/** « 4,3 Mo » en français, « 4.3 MB » en anglais. */
export function formatSize(bytes: number, locale: string) {
  if (!bytes) return ''
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: 'megabyte',
    maximumFractionDigits: 1,
  }).format(bytes / 1_000_000)
}

export function formatDate(iso: string, locale: string) {
  if (!iso) return ''
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso))
}
