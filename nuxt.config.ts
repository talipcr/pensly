// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-07-31',

  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
  ],

  css: [
    '~/assets/css/tokens.css',
    '~/assets/css/base.css',
    '~/assets/css/components.css',
  ],

  // Le domaine définitif se règle sans toucher au code :
  // NUXT_PUBLIC_SITE_URL=https://… au moment du build.
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://pensly.app',
    name: 'Pensly',
    defaultLocale: 'fr',
  },

  runtimeConfig: {
    public: {
      /** Renseigné au build par modules/github-release.ts */
      penslyVersion: '',
      repoUrl: 'https://github.com/talipcr/pensly-releases',
    },
  },

  app: {
    head: {
      // Les titres portent déjà la marque dans les fichiers de traduction :
      // sans cela, @nuxtjs/seo ajouterait un « | Pensly » redondant.
      titleTemplate: '%s',
      htmlAttrs: { lang: 'fr' },
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/pensly-logo.svg' }],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#36373d', media: '(prefers-color-scheme: dark)' },
      ],
    },
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storageKey: 'pensly-color-mode',
  },

  i18n: {
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://pensly.app',
    defaultLocale: 'fr',
    strategy: 'prefix_except_default',
    // Les slugs traduits sont déclarés page par page via defineI18nRoute().
    customRoutes: 'page',
    locales: [
      { code: 'fr', language: 'fr-FR', name: 'Français', file: 'fr.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'es', language: 'es-ES', name: 'Español', file: 'es.json' },
    ],
    bundle: { optimizeTranslationDirective: false },
    // Aucune détection ni cookie : le site promet de ne déposer aucun cookie.
    // La langue se choisit dans l'en-tête, l'URL la porte (/, /en, /es).
    detectBrowserLanguage: false,
  },

  fonts: {
    // @nuxt/fonts télécharge les fichiers au build et les sert depuis /_fonts :
    // aucune requête vers Google côté visiteur.
    defaults: { subsets: ['latin'] },
    families: [
      { name: 'Inter', provider: 'google', weights: [400, 500, 600, 700], styles: ['normal'], preload: true },
      { name: 'JetBrains Mono', provider: 'google', weights: [400, 500], styles: ['normal'] },
    ],
  },

  icon: {
    // Aucune requête vers api.iconify.design : tout est embarqué au build,
    // et le repli réseau du runtime Iconify est coupé.
    mode: 'svg',
    serverBundle: 'local',
    clientBundle: { scan: true, sizeLimitKb: 512 },
    fallbackToApi: false,
  },

  // Le vérificateur de liens n'apporte rien ici (site de 6 pages) et pollue
  // la sortie du build de warnings sur les ancres externes GitHub.
  linkChecker: { enabled: false },

  sitemap: { autoI18n: true },

  robots: { disallow: [] },

  ogImage: {
    fonts: ['Inter:400', 'Inter:700'],
    defaults: { component: 'PenslyOg', width: 1200, height: 630 },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/en', '/es', '/404.html'],
      failOnError: true,
    },
  },

  experimental: { payloadExtraction: true },

  devtools: { enabled: false },
})
