# Bühler BRAM Calculator

A professional ROI calculator for Bühler's BRAM service solutions with corporate-grade PDF export functionality.

## Features

- 🧮 **ROI Calculator** - Interactive calculation of return on investment
- 📊 **Data Visualization** - ECharts-powered ROI projection charts  
- 📄 **Professional PDF Export** - Corporate-branded reports with jsPDF
- 🎨 **Corporate Design** - Bühler brand colors and styling
- 🔒 **Basic Authentication** - Protected demo access
- ☁️ **Cloud Ready** - Optimized for Google Cloud Run deployment

## Authentication

The production deployment uses Basic Authentication:

- **Username**: `buhler`
- **Password**: `demo2024`

## Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Deployment

### Docker
```bash
# Build image
docker build -t buhler-roi-calculator .

# Run container
docker run -p 8080:8080 buhler-roi-calculator
```

### Google Cloud Run
The project includes `cloudbuild.yaml` for automated deployment:

1. Connect repository to Cloud Build
2. Push to `main` branch triggers automatic deployment
3. Deployed to `europe-west1` region
4. Includes Basic Auth protection

### Environment Variables

- `BASIC_AUTH_USER` - Basic auth username (default: "buhler")
- `BASIC_AUTH_PASSWORD` - Basic auth password (default: "demo2024")
- `NODE_ENV` - Environment mode (production enables auth)

## API Endpoints

- `/` - ROI Calculator interface
- `/api/health` - Health check endpoint for monitoring

## PDF Export Features

- Executive summary with key metrics
- Detailed input parameters table
- Current downtime impact analysis
- BRAM service benefits breakdown
- Financial analysis with ROI calculations
- Interactive chart export with optimized scaling
- Two-page professional layout

## Tech Stack

- **Frontend**: Nuxt 3, Vue 3, TypeScript
- **Charts**: ECharts, Vue-ECharts
- **PDF**: jsPDF, jsPDF-AutoTable
- **Styling**: PrimeVue, PrimeIcons
- **Deployment**: Docker, Google Cloud Run, Cloud Build
