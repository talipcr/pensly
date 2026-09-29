# Site vitrine de PandaKeep

Site statique de [PandaKeep](https://github.com/talipcr/pensly-releases) — application de notes
locale pour Windows. Nuxt 4, prérendu, sans serveur ni analytics.

## Prérequis

Node **20.19+** ou **22+** (`.node-version` fixe 22). Une version antérieure ne construira pas.

```bash
npm install
```

### Avec le dev container (recommandé si Node local ≠ 22)

Le dépôt fournit un [dev container](.devcontainer/devcontainer.json) VS Code : Node 22 tourne
dans le conteneur, indépendamment de ce qui est installé sur la machine hôte.

1. Extension **Dev Containers** (`ms-vscode-remote.remote-containers`) installée dans VS Code.
2. Palette de commandes → **Dev Containers: Reopen in Container**.
3. `npm install` s'exécute automatiquement à la création ; ensuite `npm run dev` comme d'habitude.

Le port 3000 est transféré automatiquement. `node_modules` vit dans un volume Docker nommé (pas
un bind-mount) pour rester rapide sur Windows.

## Développement

```bash
npm run dev
```

## Construction

```bash
npm run generate
```

Le résultat est dans `.output/public`, déployable tel quel sur n'importe quel hébergement
statique. Pour prévisualiser localement :

```bash
npx serve .output/public
```

## Ce qui se passe au build

`modules/github-release.ts` interroge l'API GitHub **au moment de la construction** :

- `…/releases/latest` → version, date, taille et **URL directe** de l'asset correspondant à
  `Pensly_*_x64-setup.exe`, plus le fichier `.sig` associé ;
- `…/releases?per_page=30` → le journal des versions, dont les notes Markdown sont converties
  en HTML par un rendu à balises allowlistées (le texte est échappé d'abord).

Rien n'est codé en dur : l'URL de l'asset change à chaque version. Les données sont exposées à
l'application via `#build/pandakeep-releases.mjs` ; aucune requête n'est faite depuis le navigateur.

**Repli.** Si l'API ne répond pas (quota anonyme de 60 req/h, réseau coupé), le build affiche un
avertissement puis continue : le bouton pointe alors vers
`https://github.com/talipcr/pensly-releases/releases/latest` et la version n'est pas affichée.
Le build n'échoue jamais pour cette raison, et il n'y a jamais de bouton mort.

Sur une CI, définir `GITHUB_TOKEN` relève le quota à 5 000 req/h (facultatif).

> La version affichée vient toujours de l'API. Ne jamais la lire dans `package.json` ou
> `tauri.conf.json` du dépôt de développement : elle y est figée à `0.1.0`.

## Configuration

| Variable | Défaut | Rôle |
|---|---|---|
| `NUXT_PUBLIC_SITE_URL` | `https://pandakeep.app` | Domaine canonique — sert au sitemap, aux `hreflang`, aux URL d'images sociales. **À régler avant la première mise en ligne.** |
| `GITHUB_TOKEN` | — | Facultatif, relève le quota de l'API GitHub au build. |

## Déploiement (Cloudflare Pages)

| Réglage | Valeur |
|---|---|
| Commande de build | `npm run generate` |
| Dossier de sortie | `.output/public` |
| Version de Node | 22 (lue depuis `.node-version`) |
| Variable | `NUXT_PUBLIC_SITE_URL=https://…` |

`public/_headers` définit le cache long des ressources hachées et quelques en-têtes de sécurité.

### Reconstruire à chaque nouvelle version

Le site est figé au build : une nouvelle release de PandaKeep n'apparaît qu'après une nouvelle
construction. Créer un *Deploy hook* dans Cloudflare Pages, puis, dans le dépôt
`talipcr/pensly-releases`, ajouter à la fin du workflow de release :

```yaml
- name: Rebuild the website
  run: curl -fsS -X POST "${{ secrets.PENSLY_SITE_DEPLOY_HOOK }}"
```

## Structure

```
app/
  assets/css/     tokens.css (jetons) · base.css (socle) · components.css (composants)
  components/     SiteHeader, SiteFooter, HeroDiptych, DownloadButton…
  composables/    useRelease (données de build), usePlatform (détection client)
  pages/          index · telecharger · guide · journal · confidentialite
i18n/locales/     fr.json (référence) · en.json · es.json
modules/          github-release.ts — récupération au build
public/           pandakeep-logo.svg (logo, favicon) · screenshots/hero-{light,dark}.png (captures à remplacer)
```

Les slugs sont traduits page par page via `defineI18nRoute` :
`/telecharger` · `/en/download` · `/es/descargar`, etc.

## Choix à connaître

- **Pas de Tailwind.** CSS natif et variables : la direction artistique est trop typée pour des
  utilitaires, et le site tient en six pages.
- **Inter et JetBrains Mono auto-hébergées.** `@nuxt/fonts` télécharge les fichiers au build et
  les sert depuis `/_fonts` : aucune requête vers Google côté visiteur.
- **Aucun analytics.** Poser un traqueur sur le site d'un produit « aucune télémétrie » détruirait
  l'argument. Si une mesure devient nécessaire, l'annoncer sur `/confidentialite`.
- **Aucun cookie.** Seul le thème est conservé (stockage local). La langue est portée par l'URL
  (`/`, `/en`, `/es`), sans détection ni cookie. C'est dit sur la page Confidentialité.
- **Le journal se remplit tout seul.** Les releases actuelles de `pensly-releases` sont publiées
  sans notes : la page affiche donc « publiée sans note ». Écrire un corps de release sur GitHub
  suffit à le remplir.
