# 🚀 Deployment Setup - Bühler ROI Calculator

## 📋 Aktueller Status

### Google Cloud Project
- **Project ID**: `buhler-roi-standalone`
- **Project Number**: `239552980593`
- **Region**: `europe-west1`

### Deployed Service
- **Service**: `buhler-roi-calculator`
- **URL**: https://buhler-roi-calculator-239552980593.europe-west1.run.app
- **Container Registry**: `gcr.io/buhler-roi-standalone/buhler-roi-calculator`

## 🔧 GitHub Actions Setup

### 1. Service Account erstellt ✅
```bash
Service Account: github-actions@buhler-roi-standalone.iam.gserviceaccount.com
Permissions:
- roles/run.admin (Cloud Run deployment)
- roles/storage.admin (Container Registry)
- roles/iam.serviceAccountUser (Service Account usage)
```

### 2. GitHub Secret konfigurieren 📝

**Gehe zu GitHub Repository Settings:**
1. Repository: `enricofranke/buhler-roi-demo-stanadlone`
2. Settings → Secrets and variables → Actions
3. Erstelle neues Secret:
   - **Name**: `GCP_SA_KEY`
   - **Value**: Kopiere den kompletten JSON-Inhalt aus `~/github-actions-key.json`

### 3. Workflow Datei ✅
- `.github/workflows/deploy.yml` wurde erstellt
- Automatisches Deployment bei Push auf `main` branch
- Deployment auf Cloud Run mit korrekten Environment Variables

## 🎯 Deployment Process

### Automatisch (empfohlen)
```bash
git add .
git commit -m "Your commit message"
git push origin main
```
→ GitHub Action wird automatisch ausgelöst

### Manuell (falls nötig)
```bash
gcloud builds submit --config cloudbuild.yaml .
```

## 🔐 Sicherheit

### Basic Auth Konfiguration
- **Username**: `buhler`
- **Password**: `demo2025`
- Konfiguriert in GitHub Actions Workflow

### Service Account Key
- **Speicherort**: `~/github-actions-key.json`
- **⚠️ WICHTIG**: Diese Datei NICHT ins Repository committen!
- Nach Setup in GitHub Secrets kann die lokale Datei gelöscht werden

## 🧪 Testing

Nach dem Setup:
1. Mache eine kleine Änderung im Code
2. Committe und pushe auf `main`
3. Gehe zu GitHub → Actions Tab
4. Beobachte den Deployment Workflow
5. Teste die deployed URL

## 📞 Troubleshooting

### Häufige Probleme:
1. **"Permission denied"**: Service Account Permissions prüfen
2. **"Image not found"**: Container Registry Zugriff prüfen
3. **"Service not found"**: Cloud Run Service Name prüfen

### Debug Commands:
```bash
# Service Account Status
gcloud iam service-accounts list

# Cloud Run Services
gcloud run services list

# Recent Builds
gcloud builds list --limit=5

# Container Images
gcloud container images list-tags gcr.io/buhler-roi-standalone/buhler-roi-calculator --limit=5
```