console.log(`
========== DIAGNOSTIC SOLAR SYSTEM ==========

Le systeme solaire utilise-t-il :

OPTION A - Image statique (img src="...")
ou
OPTION B - Composant React live (<SolarSystem />)

Reponse exacte :
SolarSystem rendering mode: STATIC IMAGE

============================================

IMPORTANT - Si la nouvelle image ou vignette n'apparait pas :
  1. Relancer le serveur Next.js : npm run dev
  2. Vider le cache navigateur
  3. Faire un hard refresh : CTRL + F5

Next.js et les navigateurs gardent souvent
les anciennes images en cache.
`);
