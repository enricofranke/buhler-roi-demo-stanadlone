# Bühler ROI Calculator - Deployment Guide

## 📋 Übersicht

Diese Anwendung ist ein ROI-Calculator für Bühler BRAM Service-Lösungen, gebaut mit Nuxt.js und deployed auf Google Cloud Run.

## 🚀 Deployment auf Google Cloud

### Voraussetzungen

1. **Google Cloud SDK installiert**
   ```bash
   # Installation auf macOS
   brew install --cask google-cloud-sdk
   
   # Oder direkt von Google herunterladen
   # https://cloud.google.com/sdk/docs/install
   ```

2. **Authentifizierung**
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **APIs aktivieren**
   ```bash
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   ```

### 🔄 Update/Deployment Prozess

#### Option 1: Automatisches Deployment via Git Push

1. **Code-Änderungen committen**
   ```bash
   git add .
   git commit -m "Update: Beschreibung der Änderungen"
   git push origin main
   ```

2. **Cloud Build Trigger ausführen** (falls konfiguriert)
   - Das Deployment erfolgt automatisch bei Push auf den main Branch
   - Build-Status in der Google Cloud Console überwachen

#### Option 2: Manuelles Deployment

1. **Cloud Build manuell starten**
   ```bash
   gcloud builds submit --config cloudbuild.yaml .
   ```

2. **Deployment-Status überprüfen**
   ```bash
   gcloud run services describe buhler-roi-calculator --region=europe-west1
   ```

### 📦 Deployment-Konfiguration

#### Cloud Build (`cloudbuild.yaml`)
- **Docker Image**: `gcr.io/$PROJECT_ID/buhler-roi-calculator`
- **Region**: `europe-west1`
- **Port**: `8080`
- **Memory**: `1Gi`
- **CPU**: `1`
- **Instanzen**: `0-10` (Auto-scaling)

#### Umgebungsvariablen
```yaml
BASIC_AUTH_USER=buhler
BASIC_AUTH_PASSWORD=demo2024
NODE_ENV=production
```

### 🛠 Lokale Entwicklung

1. **Dependencies installieren**
   ```bash
   npm install
   ```

2. **Development Server starten**
   ```bash
   npm run dev
   ```
   Anwendung läuft auf: `http://localhost:3003`

3. **Production Build testen**
   ```bash
   npm run build
   npm run start
   ```

### 🐳 Docker Entwicklung

1. **Docker Image lokal bauen**
   ```bash
   docker build -t buhler-roi-calculator .
   ```

2. **Container lokal ausführen**
   ```bash
   docker run -p 8080:8080 buhler-roi-calculator
   ```
   Anwendung läuft auf: `http://localhost:8080`

### 📋 Deployment Checklist

#### Vor dem Deployment:
- [ ] Code getestet (`npm run dev`)
- [ ] Build erfolgreich (`npm run build`)
- [ ] Linting sauber (`npm run lint`)
- [ ] Git Repository aktuell (`git status`)

#### Deployment:
- [ ] `git add . && git commit -m "Update: ..." && git push`
- [ ] Oder: `gcloud builds submit --config cloudbuild.yaml .`

#### Nach dem Deployment:
- [ ] Cloud Run Service Status prüfen
- [ ] Live-URL testen
- [ ] Funktionalität überprüfen

### 🔗 Nützliche Links

- **Google Cloud Console**: https://console.cloud.google.com/
- **Cloud Build**: https://console.cloud.google.com/cloud-build
- **Cloud Run**: https://console.cloud.google.com/run
- **Container Registry**: https://console.cloud.google.com/gcr

### 🆘 Troubleshooting

#### Build Fehler
```bash
# Build Logs anzeigen
gcloud builds list --limit=1
gcloud builds log [BUILD_ID]
```

#### Service Fehler
```bash
# Service Logs anzeigen
gcloud run services logs read buhler-roi-calculator --region=europe-west1
```

#### Rollback
```bash
# Vorherige Version deployen
gcloud run services replace-traffic buhler-roi-calculator --to-revisions=REVISION_NAME=100 --region=europe-west1
```

### 🔧 Konfiguration anpassen

#### Memory/CPU ändern
```bash
gcloud run services update buhler-roi-calculator \
  --memory=2Gi \
  --cpu=2 \
  --region=europe-west1
```

#### Umgebungsvariablen aktualisieren
```bash
gcloud run services update buhler-roi-calculator \
  --set-env-vars="BASIC_AUTH_PASSWORD=neues_passwort" \
  --region=europe-west1
```

---

## 🚨 Wichtige Hinweise

- **Basic Auth**: Die Anwendung ist mit Basic Authentication geschützt
  - User: `buhler`
  - Password: `demo2024`
- **Region**: Deployment erfolgt in `europe-west1`
- **Auto-Scaling**: Automatische Skalierung von 0-10 Instanzen
- **HTTPS**: Cloud Run stellt automatisch HTTPS zur Verfügung

---

**Letzte Aktualisierung**: $(date)