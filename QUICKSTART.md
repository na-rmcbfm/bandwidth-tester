# Guide de démarrage rapide

## 🚀 Lancer l'application en 3 étapes

### Option 1 : Docker (Recommandé)

```bash
# 1. Lancer l'application
docker-compose up --build

# 2. Ouvrir votre navigateur
# Frontend: http://localhost:3000
# API Docs: http://localhost:8000/docs

# 3. C'est tout ! L'application est prête.
```

### Option 2 : Développement local

**Terminal 1 - Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Lancer les tests

### Backend
```bash
cd backend
source venv/bin/activate
pytest --cov=app
```

### Frontend
```bash
cd frontend
npm test
```

## 📖 Utilisation

1. **Page de test** : Cliquez sur "Start Test" pour lancer un test de vitesse
2. **Page historique** : Consultez tous vos tests passés avec graphiques

## 🔧 Variables d'environnement

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

### Backend (optionnel)
```
DATABASE_URL=sqlite:///./bandwidth_tests.db
```

## 🐛 Problèmes courants

### Port déjà utilisé
```bash
# Tuer le processus sur le port 8000
lsof -ti:8000 | xargs kill -9

# Ou changer le port dans docker-compose.yml
```

### CORS errors
- Vérifiez que VITE_API_URL pointe vers le bon backend
- En production, configurez les origins CORS dans [backend/app/main.py](backend/app/main.py)

### Base de données
```bash
# Réinitialiser la base de données
rm backend/bandwidth_tests.db
# Redémarrer le backend
```

## 📚 Documentation complète

Consultez [README.md](README.md) pour la documentation complète.

## ✅ Vérification

Testez les endpoints :
```bash
# Health check
curl http://localhost:8000/api/health

# Ping test
curl http://localhost:8000/api/test/ping

# Liste des résultats
curl http://localhost:8000/api/results/
```

Bon test de vitesse ! 🚀
