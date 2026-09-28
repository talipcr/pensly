export type Platform = 'windows' | 'mac' | 'linux' | 'other'

/**
 * Détection côté client uniquement : le HTML prérendu affiche toujours le CTA
 * Windows (la seule plateforme qui existe), et l'avertissement honnête
 * n'apparaît qu'après l'hydratation, chez les visiteurs concernés.
 */
export function usePlatform() {
  const platform = ref<Platform | null>(null)

  onMounted(() => {
    const nav = navigator as Navigator & { userAgentData?: { platform?: string } }
    const raw = (nav.userAgentData?.platform || nav.userAgent || '').toLowerCase()

    if (raw.includes('win')) platform.value = 'windows'
    else if (raw.includes('mac') || raw.includes('iphone') || raw.includes('ipad')) platform.value = 'mac'
    else if (raw.includes('android')) platform.value = 'other'
    else if (raw.includes('linux') || raw.includes('x11')) platform.value = 'linux'
    else platform.value = 'other'
  })

  return { platform }
}
