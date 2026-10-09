DJ AI Partnership — Espace contributeur
=======================================

Contenu
- index.html : la page (inscription, connexion, tableau de bord)
- style.css  : le design
- app.js     : la logique (comptes, activation par code, tâches, paiements)

Mettre en ligne
1. Netlify : glissez-déposez le dossier décompressé sur app.netlify.com/drop
2. GitHub Pages : envoyez les 3 fichiers dans un dépôt, puis Settings > Pages
3. Hébergeur classique : copiez les fichiers à la racine du site (ou dans /app)
Ouvrez ensuite index.html ou l'adresse du site.

Réglages (en haut de app.js)
- RATE   = 4          -> tarif par heure approuvée (USD)
- CODE   = "5PNDPR2S" -> code de la compagnie, saisi dans le site après l'inscription
- DOMAIN = "@jdaipartnership.com" -> domaine des adresses générées

Important : version de démonstration
- Les comptes sont enregistrés dans le navigateur de chaque personne (localStorage).
- Le code de la compagnie est lisible dans app.js : il ne protège pas vraiment.
- Les emails prenom@jdaipartnership.com ne sont pas créés réellement : il faut un
  hébergeur mail (Google Workspace, Zoho Mail...) et un serveur.
- Les paiements (virement bancaire, Wise, Payoneer) ne sont pas exécutés.
Pour de vrais comptes partagés, il faut une base de données et un serveur.
