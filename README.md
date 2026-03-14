# clm.ink — Site vitrine Astro

Site statique pour le tatoueur clm.ink à Chambéry, réalisé avec Astro et Tailwind CSS en noir et blanc, mobile first.

---

## Stack technique

- **Astro** : générateur de site statique
- **Tailwind CSS 4** : design minimaliste, noir et blanc
- **TypeScript** : typage strict optionnel
- **@astrojs/sitemap** : génération du sitemap

## Démarrage

```bash
npm install
npm run dev
```

Le site est accessible sur `http://localhost:4321`.

### Scripts disponibles

| Commande | Description |
| -------- | ----------- |
| `npm run dev` / `npm run start` | Serveur de développement |
| `npm run build` | Build de production (sortie dans `dist/`) |
| `npm run preview` | Prévisualisation du build |
| `npm run check` | Vérification TypeScript / Astro |

## Structure du projet

### Pages

- **File**: `src/pages/index.astro` — Landing one-page (hero, galerie, infos)
- **File**: `src/pages/studio.astro` — Page studio
- **File**: `src/pages/studio-hygiene.astro` — Hygiène et déroulé des séances
- **File**: `src/pages/faq.astro` — FAQ tatouage
- **File**: `src/pages/faq-tatouage.astro` — FAQ dédiée
- **File**: `src/pages/blackwork.astro` — Galerie blackwork
- **File**: `src/pages/geometric.astro` — Galerie géométrique
- **File**: `src/pages/realism.astro` — Galerie réalisme
- **File**: `src/pages/contact.astro` — Page contact (SEO)

### Composants et layout

- **File**: `src/layouts/BaseLayout.astro` — Layout de base (SEO, header, footer)
- **File**: `src/components/Hero.astro` — Section hero
- **File**: `src/components/Portfolio.astro` — Galerie portfolio et liens par style (geometric, realism, blackwork)
- **File**: `src/components/InfoSection.astro` — Bloc infos pratiques

Les assets statiques (images, favicon, etc.) sont dans `public/`.

## Déploiement

Le dossier `dist/` est ignoré par Git. Sur un hébergeur statique (GitHub Pages, Netlify, etc.), configurer la commande de build : `npm run build`, et le répertoire de publication : `dist`.
