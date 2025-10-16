# CLAUDE.md

Ce fichier fournit des instructions à Claude Code (claude.ai/code) pour travailler sur ce projet.

## Vue d'ensemble du projet

Application web de test de bande passante Internet permettant aux utilisateurs de mesurer leur vitesse de connexion (download/upload) avec un historique complet des tests effectués.

## Objectifs

- **Page principale** : Test de bande passante en temps réel avec affichage des résultats (download, upload, latence)
- **Page historique** : Visualisation de tous les tests effectués avec horodatage et graphiques
- **Interface moderne** : Material-UI pour une expérience utilisateur fluide
- **Simplicité** : Architecture légère, déployable facilement avec Docker

## Stack technique

### Frontend
- **React** avec TypeScript
- **Material-UI (MUI)** pour les composants UI
- **Recharts** ou **Chart.js** pour les graphiques d'historique
- **React Router** pour la navigation entre pages
- **Jest** et **React Testing Library** pour les tests unitaires
- **MSW (Mock Service Worker)** pour mocker les appels API dans les tests

### Backend
- **Python FastAPI** pour l'API REST
- **SQLite** ou **PostgreSQL** pour stocker l'historique des tests
- **Uvicorn** comme serveur ASGI
- **Pytest** pour les tests unitaires
- **pytest-cov** pour la couverture de code
- **httpx** pour les tests d'endpoints

### Containerisation
- **Docker** et **Docker Compose** pour orchestrer frontend + backend + base de données

## Architecture

```
/
├── frontend/              # Application React
│   ├── src/
│   │   ├── components/   # Composants réutilisables
│   │   ├── pages/        # Pages (Test, History)
│   │   ├── services/     # Appels API
│   │   ├── __tests__/    # Tests unitaires
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
│
├── backend/              # API Python FastAPI
│   ├── app/
│   │   ├── main.py      # Point d'entrée FastAPI
│   │   ├── models.py    # Modèles de données
│   │   ├── database.py  # Configuration DB
│   │   └── routers/     # Endpoints API
│   ├── tests/           # Tests unitaires et d'intégration
│   │   ├── test_api.py
│   │   ├── test_models.py
│   │   └── conftest.py  # Fixtures pytest
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml    # Orchestration des services
└── CLAUDE.md            # Ce fichier
```

## Fonctionnalités détaillées

### 1. Page de test de bande passante
- **Bouton "Lancer le test"** : Démarre le test de vitesse
- **Indicateur de progression** : Affiche l'état du test (en cours, terminé)
- **Résultats en temps réel** :
  - Vitesse de téléchargement (Mbps)
  - Vitesse d'upload (Mbps)
  - Latence/Ping (ms)
  - Jitter
- **Affichage graphique** : Jauge ou graphique en temps réel
- **Sauvegarde automatique** : Les résultats sont enregistrés dans la base de données

### 2. Page d'historique
- **Liste des tests** : Tableau avec date/heure, download, upload, latence
- **Filtres** : Par date, par plage de vitesse
- **Graphiques** : Évolution de la bande passante dans le temps
- **Export** : Possibilité d'exporter en CSV (optionnel)

### 3. Méthode de test de bande passante
- **Download** : Téléchargement de fichiers de tailles croissantes depuis le backend
- **Upload** : Upload de données générées côté client vers le backend
- **Latence** : Mesure du temps de réponse via des requêtes ping
- **Calcul** : Mesure du temps et calcul de la vitesse en Mbps

## API Backend

### Endpoints principaux

```
GET  /api/health              # Vérification de l'état du serveur
POST /api/test/download       # Endpoint pour test de download
POST /api/test/upload         # Endpoint pour test d'upload
GET  /api/test/ping           # Endpoint pour mesurer la latence
POST /api/results             # Sauvegarder un résultat de test
GET  /api/results             # Récupérer l'historique des tests
GET  /api/results/{id}        # Récupérer un test spécifique
DELETE /api/results/{id}      # Supprimer un test (optionnel)
```

### Modèle de données (Result)

```python
{
  "id": "uuid",
  "timestamp": "datetime",
  "download_speed": "float (Mbps)",
  "upload_speed": "float (Mbps)",
  "latency": "float (ms)",
  "jitter": "float (ms)",
  "ip_address": "string",
  "user_agent": "string"
}
```

## Configuration Docker

### docker-compose.yml structure
- **Service frontend** : Port 3000, build depuis ./frontend
- **Service backend** : Port 8000, build depuis ./backend
- **Service database** : PostgreSQL ou SQLite monté en volume
- **Network** : Bridge network pour communication inter-services

### Variables d'environnement
```
BACKEND_URL=http://backend:8000
DATABASE_URL=postgresql://user:password@db:5432/bandwidth
FRONTEND_PORT=3000
BACKEND_PORT=8000
```

## Commandes de développement

### Installation locale

```bash
# Frontend
cd frontend
npm install
npm start

# Backend
cd backend
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate sur Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Docker

```bash
# Build et démarrer tous les services
docker-compose up --build

# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f

# Rebuild un service spécifique
docker-compose up --build frontend
```

### Tests

```bash
# Frontend - Tests unitaires
cd frontend
npm test                    # Lance tous les tests
npm test -- --coverage      # Lance les tests avec couverture de code
npm test -- --watch         # Mode watch pour développement

# Backend - Tests unitaires et d'intégration
cd backend
pytest                      # Lance tous les tests
pytest --cov=app            # Avec couverture de code
pytest --cov=app --cov-report=html  # Génère un rapport HTML
pytest tests/test_api.py    # Lance un fichier de test spécifique
pytest -v                   # Mode verbose
```

### Lint

```bash
# Frontend
cd frontend
npm run lint

# Backend
cd backend
flake8 app/
black app/ --check
```

## Bonnes pratiques

1. **Composants React** : Créer des composants réutilisables (SpeedGauge, TestButton, HistoryTable, etc.)
2. **Gestion d'état** : Utiliser React hooks (useState, useEffect) ou Context API si nécessaire
3. **API calls** : Centraliser les appels API dans un service dédié
4. **Responsive design** : Utiliser le système de grille Material-UI pour mobile/desktop
5. **Gestion d'erreurs** : Afficher des messages d'erreur clairs avec Snackbar MUI
6. **Loading states** : Indicateurs de chargement pendant les tests
7. **Validation** : Valider les données côté backend avec Pydantic
8. **CORS** : Configurer CORS dans FastAPI pour autoriser le frontend
9. **Logs** : Logger les erreurs et les événements importants
10. **Sécurité** : Limiter le rate limiting pour éviter les abus

## Stratégie de tests

### Objectif de couverture
- **Couverture minimale** : 80% pour le backend et le frontend
- **Couverture cible** : 90% pour les fonctions critiques (calculs de vitesse, sauvegarde de données)

### Tests Frontend (Jest + React Testing Library)

#### Composants à tester
1. **SpeedTest Component**
   - Affichage correct des résultats
   - Désactivation du bouton pendant le test
   - Gestion des erreurs réseau
   - Affichage des états de chargement

2. **HistoryTable Component**
   - Affichage correct des données
   - Tri des colonnes
   - Filtrage par date
   - Pagination

3. **SpeedGauge Component**
   - Rendu avec différentes valeurs
   - Affichage des unités (Mbps)
   - Animation de la jauge

4. **Services API**
   - Appels API avec paramètres corrects
   - Gestion des erreurs HTTP
   - Timeout des requêtes
   - Transformation des données

#### Exemple de structure de test Frontend
```typescript
// src/__tests__/components/SpeedTest.test.tsx
describe('SpeedTest Component', () => {
  it('should render the start button', () => {...})
  it('should disable button during test', () => {...})
  it('should display results after test', () => {...})
  it('should handle API errors gracefully', () => {...})
  it('should save results to database', () => {...})
})
```

### Tests Backend (Pytest)

#### Tests unitaires
1. **Models (models.py)**
   - Validation des données avec Pydantic
   - Valeurs par défaut
   - Contraintes sur les champs

2. **Database (database.py)**
   - Connexion à la base de données
   - Création de tables
   - Opérations CRUD

3. **Calculs de vitesse**
   - Conversion bytes vers Mbps
   - Calcul de la latence moyenne
   - Calcul du jitter

#### Tests d'intégration
1. **Endpoints API**
   - GET /api/health retourne 200
   - POST /api/test/download retourne des données
   - GET /api/results retourne la liste complète
   - POST /api/results sauvegarde correctement
   - Validation des données d'entrée
   - Gestion des erreurs 404, 422, 500

#### Exemple de structure de test Backend
```python
# tests/test_api.py
def test_health_endpoint(client):
    response = client.get("/api/health")
    assert response.status_code == 200

def test_create_result(client, test_result_data):
    response = client.post("/api/results", json=test_result_data)
    assert response.status_code == 201
    assert "id" in response.json()

def test_get_results_list(client, seed_database):
    response = client.get("/api/results")
    assert response.status_code == 200
    assert len(response.json()) > 0

# tests/conftest.py
@pytest.fixture
def client():
    # Configure test database
    # Return test client
    pass
```

### Tests d'intégration End-to-End (optionnel)
- **Cypress** ou **Playwright** pour tester le flux complet
- Scénario : Lancer un test → Voir les résultats → Consulter l'historique

### CI/CD - Intégration continue
1. **GitHub Actions** ou **GitLab CI**
   - Lancer les tests à chaque push
   - Vérifier la couverture de code
   - Bloquer le merge si tests échouent

2. **Exemple de workflow**
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: cd frontend && npm install && npm test -- --coverage

  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: cd backend && pip install -r requirements.txt && pytest --cov=app
```

### Règles de développement avec tests

**IMPORTANT : Chaque nouvelle fonctionnalité DOIT inclure des tests**

1. **Test-Driven Development (TDD) recommandé**
   - Écrire le test en premier
   - Implémenter la fonctionnalité
   - Refactorer si nécessaire

2. **Avant chaque commit**
   - Lancer les tests localement
   - Vérifier qu'aucun test n'est cassé
   - Ajouter des tests pour les nouvelles fonctionnalités

3. **Revue de code**
   - Vérifier la présence de tests
   - Vérifier la qualité des tests (pas de tests vides)
   - S'assurer que les tests couvrent les cas limites

4. **Tests à maintenir**
   - Mettre à jour les tests quand l'API change
   - Supprimer les tests obsolètes
   - Refactorer les tests pour éviter la duplication

### Outils de qualité de code

1. **Coverage Reports**
   - Générer des rapports HTML de couverture
   - Visualiser les lignes non testées
   - Objectif : augmenter progressivement la couverture

2. **Mutation Testing (optionnel)**
   - **Stryker** pour JavaScript
   - **mutmut** pour Python
   - Vérifier la qualité des tests en introduisant des mutations

3. **Linting et formatting**
   - ESLint pour TypeScript
   - Black et Flake8 pour Python
   - Pre-commit hooks pour automatiser

## Améliorations futures (optionnelles)

- Authentification utilisateur pour historique personnel
- Comparaison avec d'autres utilisateurs (anonymisé)
- Support multi-serveurs pour tester depuis différentes localisations
- PWA (Progressive Web App) pour installation sur mobile
- Notifications quand la bande passante baisse
- Tests planifiés automatiquement

## Notes importantes

- Les tests de bande passante doivent utiliser des fichiers de taille appropriée (1MB, 5MB, 10MB)
- Implémenter un timeout pour les tests (max 60 secondes)
- Stocker l'IP de manière anonymisée (hash) pour respecter la vie privée
- Optimiser les requêtes DB avec des index sur timestamp
- Utiliser des migrations de base de données (Alembic) pour évolutions futures
