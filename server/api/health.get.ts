export default defineEventHandler((event) => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'buhler-roi-calculator',
    version: '1.0.0'
  }
})