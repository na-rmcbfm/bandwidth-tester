# Bandwidth Test Application

Application web moderne de test de bande passante Internet avec historique des résultats. Conçue pour mesurer la vitesse de téléchargement, d'upload, la latence et le jitter.

## 🚀 Fonctionnalités

- **Test de vitesse complet**
  - Mesure de la vitesse de téléchargement (download)
  - Mesure de la vitesse d'upload
  - Test de latence (ping)
  - Calcul du jitter

- **Historique des tests**
  - Sauvegarde automatique de tous les tests
  - Visualisation sous forme de tableau
  - Graphiques d'évolution temporelle
  - Export des données (à venir)

- **Interface moderne**
  - Design Material-UI responsive
  - Navigation intuitive
  - Affichage en temps réel des résultats
  - Indicateurs visuels (jauges circulaires)

## 📋 Prérequis

- Docker & Docker Compose (recommandé)
- OU Node.js 18+ et Python 3.11+ pour développement local

## 🐳 Installation avec Docker (Recommandé)

### Démarrage rapide

```bash
# Cloner le repository
git clone <repository-url>
cd test_project

# Lancer l'application
docker-compose up --build

# L'application sera disponible sur :
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Documentation API: http://localhost:8000/docs
```

### Arrêter l'application

```bash
docker-compose down
```

### Voir les logs

```bash
docker-compose logs -f
```

## 💻 Installation locale (Développement)

### Backend

```bash
cd backend

# Créer un environnement virtuel
python3 -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Lancer le serveur
uvicorn app.main:app --reload

# Le backend sera disponible sur http://localhost:8000
```

### Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Le frontend sera disponible sur http://localhost:5173
```

## 🧪 Tests

### Tests Backend

```bash
cd backend
source venv/bin/activate

# Lancer tous les tests
pytest

# Avec couverture de code
pytest --cov=app --cov-report=term-missing

# Génrer un rapport HTML
pytest --cov=app --cov-report=html

# Le rapport sera dans htmlcov/index.html
```

**Couverture actuelle : 96%**

### Tests Frontend

```bash
cd frontend

# Lancer les tests
npm test

# Mode watch pour développement
npm test -- --watch

# Avec couverture
npm run test:coverage

# Interface UI pour les tests
npm run test:ui
```

**Tests : 8 tests passent avec succès**

## 📁 Structure du projet

```
.
├── backend/              # API Python FastAPI
│   ├── app/
│   │   ├── main.py      # Point d'entrée
│   │   ├── models.py    # Modèles Pydantic & SQLAlchemy
│   │   ├── database.py  # Configuration DB
│   │   └── routers/     # Endpoints API
│   ├── tests/           # Tests unitaires et d'intégration
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/            # Application React TypeScript
│   ├── src/
│   │   ├── components/  # Composants réutilisables
│   │   ├── pages/       # Pages (Test, History)
│   │   ├── services/    # Appels API
│   │   ├── types/       # Types TypeScript
│   │   └── __tests__/   # Tests
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml   # Orchestration
├── CLAUDE.md           # Instructions de développement
└── README.md           # Ce fichier
```

## 🔌 API Endpoints

### Health Check
```
GET /api/health
```

### Tests de bande passante
```
GET  /api/test/ping          # Test de latence
POST /api/test/download      # Test de téléchargement
POST /api/test/upload        # Test d'upload
```

### Gestion des résultats
```
GET    /api/results/         # Liste des résultats
POST   /api/results/         # Sauvegarder un résultat
GET    /api/results/{id}     # Récupérer un résultat
DELETE /api/results/{id}     # Supprimer un résultat
```

### Documentation interactive
Accédez à la documentation Swagger : `http://localhost:8000/docs`

## 🛠️ Technologies utilisées

### Backend
- FastAPI - Framework web moderne et rapide
- SQLAlchemy - ORM pour base de données
- SQLite - Base de données légère
- Pydantic - Validation des données
- Pytest - Framework de tests

### Frontend
- React 19 - Bibliothèque UI
- TypeScript - Typage statique
- Material-UI - Composants UI
- Recharts - Graphiques
- Axios - Client HTTP
- Vitest - Framework de tests

### DevOps
- Docker & Docker Compose
- Nginx - Serveur web pour le frontend

## 📊 Comment fonctionne le test de vitesse ?

1. **Test de latence** : 10 pings sont envoyés au serveur pour mesurer le temps de réponse moyen et calculer le jitter (variance)

2. **Test de téléchargement** : Le serveur génère des données aléatoires (5MB par défaut) que le client télécharge. La vitesse est calculée en mesurant le temps de transfert.

3. **Test d'upload** : Le client génère des données aléatoires (3MB par défaut) et les envoie au serveur. La vitesse est calculée de la même manière.

4. **Sauvegarde** : Les résultats sont automatiquement sauvegardés dans la base de données avec horodatage.

## 🔐 Sécurité

- CORS configuré pour autoriser les requêtes cross-origin
- Rate limiting (à implémenter en production)
- Validation stricte des données avec Pydantic
- Anonymisation des adresses IP (hash recommandé)

## 🚧 Améliorations futures

- [ ] Authentification utilisateur
- [ ] Filtrage et recherche dans l'historique
- [ ] Export CSV/JSON des résultats
- [ ] Comparaison avec d'autres utilisateurs
- [ ] Support multi-serveurs pour tests géo-localisés
- [ ] PWA pour installation sur mobile
- [ ] Notifications de baisse de performance
- [ ] Tests planifiés automatiquement

## 📝 License

Ce projet est sous licence MIT.

## 👥 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

**Important** : Assurez-vous que tous les tests passent et que la couverture reste >80%.

## 🐛 Support

Pour signaler un bug ou demander une fonctionnalité, ouvrez une issue sur GitHub.

## 📸 Screenshots

### Page de test
![Test Page](docs/test-page-screenshot.png)

### Page d'historique
![History Page](docs/history-page-screenshot.png)

---

Développé avec ❤️ pour mesurer votre bande passante
