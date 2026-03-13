# clm.ink — Site vitrine Astro

Site statique pour le tatoueur clm.ink à Chambéry, réalisé avec Astro et Tailwind CSS en noir et blanc, mobile first.

---

## Stack technique

- **Astro** : générateur de site statique.
- **Tailwind CSS 4** : design minimaliste, noir et blanc.
- **TypeScript** : typage strict optionnel.

## Démarrage du projet

```bash
npm install
npm run dev
```

Le site est accessible par défaut sur `http://localhost:4321`.

## Structure principale

- `src/pages/index.astro` : landing page one-page (hero, galerie, Instagram, infos pratiques).
- `src/pages/studio.astro` : page SEO sur le studio, l&apos;hygiène et le déroulé des séances.
- `src/pages/faq.astro` : page SEO avec questions fréquentes sur le tatouage.
- `src/components/*` : sections réutilisables (hero, galerie, flux Instagram, bloc infos).
- `src/layouts/BaseLayout.astro` : layout de base avec SEO, header et footer.

## Flux Instagram

La section Instagram est prête à consommer l&apos;API Instagram Basic Display.

Pour activer la récupération automatique des derniers posts :

1. Créez un token d&apos;accès Instagram Basic Display et récupérez votre `user_id`.
2. Ajoutez les variables dans un fichier `.env` à la racine :

```bash
PUBLIC_INSTAGRAM_ACCESS_TOKEN="votre_token"
PUBLIC_INSTAGRAM_USER_ID="votre_user_id"
```

3. Relancez `npm run dev` ou rebuild le site.

En l&apos;absence de configuration, un bloc explicatif et un lien vers le profil Instagram sont affichés.

