<template>
  <div class="customer-data-page-wrapper">
    <div class="customer-data-page">
      <!-- Header Section -->
      <div class="page-header">
      <div class="header-content">
        <div class="brand-section">
          <NuxtImg
            class="brand-logo-img"
            src="/images/logo.svg"
            alt="Bühler"
            width="120"
            height="auto"
          />
        </div>
        <div class="title-section">
          <h1 class="page-title">
            <i class="pi pi-chart-bar" aria-hidden="true"></i>
            <span class="title-text">
              <span class="title-bram">BRAM</span><span class="title-calculator">Calculator</span>
            </span>
          </h1>
          <p class="page-subtitle">
            Enter your data to calculate your potential return on investment
          </p>
        </div>
      </div>
    </div>

    <!-- Company Name Input -->
    <div class="company-section">
      <h2 class="section-title">
        <i class="pi pi-building"></i>
        Company Information
      </h2>
      <div class="company-input-group">
        <label class="company-label">
          Company Name
          <span class="company-hint">Your company name for the report</span>
        </label>
        <input 
          v-model="customerData.companyName" 
          type="text" 
          class="company-input"
          placeholder="Enter your company name"
          inputmode="text"
          spellcheck="false"
          autocapitalize="words"
          autocorrect="off"
        >
      </div>
    </div>

    <!-- Input Section using extracted component -->
    <div class="input-section">
      <h2 class="section-title">
        <i class="pi pi-pencil"></i>
        Production & Downtime Data
      </h2>
      
      <RoiInputForm
        :inputs="roiInputs"
        :machines-terminology="machinesTerminology"
        :weight-unit="weightUnit"
        @update:inputs="onUpdateInputs"
        @update:machines-terminology="machinesTerminology = $event"
        @update:weight-unit="weightUnit = $event"
      />

      
    </div>

    <!-- Only Downtime Impact on this page as its own card -->
    <DowntimeImpact :calculations="liveCalculations" :weight-unit="weightUnit" />

    <!-- Enhanced export action bar -->
    <div class="export-action-bar">
      <div class="export-container">
        <div class="export-info">
          <h3 class="export-title">Ready to Export</h3>
          <p class="export-description">Generate a professional PDF summary for our sales team</p>
        </div>
        <button 
          @click="exportToPDF" 
          class="export-btn-enhanced"
          :disabled="!canCalculate || isExporting"
        >
          <div class="btn-content">
            <div class="btn-icon">
              <div v-if="isExporting" class="spinner"></div>
              <ClientOnly v-else>
                <i class="pi pi-file-pdf" aria-hidden="true"></i>
              </ClientOnly>
            </div>
            <div class="btn-text">
              <span class="btn-label">{{ isExporting ? 'Generating...' : 'Export PDF' }}</span>
              <span class="btn-subtitle">Customer Summary</span>
            </div>
          </div>
          <div class="btn-arrow">
            <ClientOnly>
              <i class="pi pi-download" aria-hidden="true"></i>
            </ClientOnly>
          </div>
        </button>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
// Components
import DowntimeImpact from '../components/DowntimeImpact.vue'

// Page meta - no auth required, accessible to everyone (handled by global middleware)
definePageMeta({
  layout: false
})

// Set page title
useHead({
  title: 'Customer Data - Bühler BRAM Calculator',
  meta: [
    {
      name: 'description',
      content: 'Enter your production data to calculate your potential ROI with Bühler BRAM solutions'
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
    }
  ]
})

// Customer data
const customerData = reactive({
  companyName: ''
})

// ROI Inputs matching the component interface
const roiInputs = reactive({
  machinesInOperation: null,
  plannedMaintenanceEvents: null,
  unplannedMaintenanceEvents: null,
  plannedDowntimeDurationPerEvent: null,
  unplannedDowntimeDurationPerEvent: null,
  productionDaysPerYear: null,
  productionHoursPerDay: null,
  dailyOutputKg: null,
  salesPricePerKg: null,
  marginPercent: null
})

// State
const machinesTerminology = ref('scope')
const weightUnit = ref('')
const showResults = ref(true)
const isExporting = ref(false)
const liveCalculations = computed(() => {
  const input = roiInputs
  const machinesInOperation = input.machinesInOperation || 0
  const plannedMaintenanceEvents = input.plannedMaintenanceEvents || 0
  const unplannedMaintenanceEvents = input.unplannedMaintenanceEvents || 0
  const plannedDowntimeDurationPerEvent = input.plannedDowntimeDurationPerEvent || 0
  const unplannedDowntimeDurationPerEvent = input.unplannedDowntimeDurationPerEvent || 0
  const productionDaysPerYear = input.productionDaysPerYear || 0
  const productionHoursPerDay = input.productionHoursPerDay || 0
  const dailyOutputKg = input.dailyOutputKg || 0
  const salesPricePerKg = input.salesPricePerKg || 0
  const marginPercent = input.marginPercent || 0
  const productMarginPerKg = salesPricePerKg * (marginPercent / 100)

  const hourlyProductionRate = productionHoursPerDay > 0 ? dailyOutputKg / productionHoursPerDay : 0

  const annualPlannedDowntimeHours = plannedMaintenanceEvents * plannedDowntimeDurationPerEvent * machinesInOperation
  const annualPlannedProductionLoss = annualPlannedDowntimeHours * hourlyProductionRate
  const annualPlannedRevenueLoss = annualPlannedProductionLoss * productMarginPerKg

  const annualUnplannedDowntimeHours = unplannedMaintenanceEvents * unplannedDowntimeDurationPerEvent * machinesInOperation
  const annualUnplannedProductionLoss = annualUnplannedDowntimeHours * hourlyProductionRate
  const annualUnplannedRevenueLoss = annualUnplannedProductionLoss * productMarginPerKg

  const annualDowntimeHours = annualPlannedDowntimeHours + annualUnplannedDowntimeHours
  const annualProductionLoss = annualPlannedProductionLoss + annualUnplannedProductionLoss
  const annualRevenueLoss = annualPlannedRevenueLoss + annualUnplannedRevenueLoss

  return {
    annualPlannedDowntimeHours,
    annualPlannedProductionLoss,
    annualPlannedRevenueLoss,
    annualUnplannedDowntimeHours,
    annualUnplannedProductionLoss,
    annualUnplannedRevenueLoss,
    annualDowntimeHours,
    annualProductionLoss,
    annualRevenueLoss,
    additionalUptimeHours: 0,
    additionalOutput: 0,
    potentialSavings: 0,
    netSavings: 0,
    roi: 0,
    paybackMonths: 0
  }
})

// Computed labels
const machinesLabel = computed(() => {
  return machinesTerminology.value === 'scope' ? 'Machines in Scope' : 'Machines in Operation'
})

const dailyOutputLabel = computed(() => {
  return machinesTerminology.value === 'scope' 
    ? 'Daily Output of machines in scope' 
    : 'Daily output of machines in operation'
})

const weightUnitLabel = computed(() => {
  return weightUnit.value === 'lb' ? 'lb' : 'kg'
})

// Validation (allow 0 values; only require non-null numbers and non-empty company name)
const isNumberSet = (v) => v !== null && v !== undefined && !Number.isNaN(v)
  const canCalculate = computed(() => {
  return (
    typeof customerData.companyName === 'string' && customerData.companyName.trim().length > 0 &&
    isNumberSet(roiInputs.machinesInOperation) &&
    isNumberSet(roiInputs.productionDaysPerYear) &&
    isNumberSet(roiInputs.productionHoursPerDay) &&
    isNumberSet(roiInputs.dailyOutputKg) &&
      isNumberSet(roiInputs.salesPricePerKg) &&
      isNumberSet(roiInputs.marginPercent) &&
    roiInputs.plannedMaintenanceEvents !== null &&
    roiInputs.plannedDowntimeDurationPerEvent !== null &&
    roiInputs.unplannedMaintenanceEvents !== null &&
    roiInputs.unplannedDowntimeDurationPerEvent !== null
  )
})

// Unit conversion helpers
const kgToLb = (kg) => kg * 2.20462
const lbToKg = (lb) => lb / 2.20462

// No manual calculate action needed; values are live via computed

// Handlers
const onUpdateInputs = (updated) => {
  Object.assign(roiInputs, updated)
}

// PDF Export (Customer Summary – corporate styling)
const exportToPDF = async () => {
  if (!canCalculate.value) return

  isExporting.value = true

  try {
    if (process.server) return
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')
    const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })

    // Colors
    const buhler = [0, 155, 145]
    const dark = [30, 41, 59]
    const mid = [100, 116, 139]
    const bg = [248, 250, 252]

    // Branded header bar
    doc.setFillColor(...buhler)
    doc.rect(0, 0, 210, 22, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.text('Bühler BRAM Calculator', 20, 14)
    doc.setFontSize(12)
    doc.text('Customer Summary', 20, 19)

    // Meta
    let yPos = 34
    doc.setTextColor(...dark)
    doc.setFontSize(14)
    doc.text(`Company: ${customerData.companyName}`, 20, yPos)
    yPos += 8
    doc.setFontSize(10)
    doc.setTextColor(...mid)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPos)
    yPos += 8

    // Section: Input Parameters
    doc.setTextColor(...buhler)
    doc.setFontSize(15)
    doc.text('Input Parameters', 20, yPos)
    yPos += 4

    const inputData = [
      [machinesLabel.value, (roiInputs.machinesInOperation ?? 0).toString()],
      ['Production Days per Year', (roiInputs.productionDaysPerYear ?? 0).toString()],
      ['Production Hours per Day', (roiInputs.productionHoursPerDay ?? 0).toString()],
      [dailyOutputLabel.value, `${formatNumber(weightUnit.value === 'lb' ? kgToLb(roiInputs.dailyOutputKg ?? 0) : (roiInputs.dailyOutputKg ?? 0))} ${weightUnitLabel.value}`],
      [`Sales Price per ${weightUnitLabel.value}`, formatCurrency(roiInputs.salesPricePerKg ?? 0)],
      ['Margin', `${(roiInputs.marginPercent ?? 0).toFixed?.(1) ?? Number(roiInputs.marginPercent ?? 0).toFixed(1)}%`],
      ['Planned Maintenance Events/Year', (roiInputs.plannedMaintenanceEvents ?? 0).toString()],
      ['Planned Downtime Duration/Event', `${roiInputs.plannedDowntimeDurationPerEvent ?? 0} hrs`],
      ['Unplanned Maintenance Events/Year', (roiInputs.unplannedMaintenanceEvents ?? 0).toString()],
      ['Unplanned Downtime Duration/Event', `${roiInputs.unplannedDowntimeDurationPerEvent ?? 0} hrs`]
    ]

    autoTable(doc, {
      startY: yPos + 2,
      head: [['Parameter', 'Value']],
      body: inputData,
      theme: 'grid',
      headStyles: { fillColor: buhler, textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: bg },
      styles: { fontSize: 10, textColor: dark },
      columnStyles: { 0: { cellWidth: 100 } }
    })

    // Section: Downtime Impact
    const afterInputsY = doc && doc.lastAutoTable && doc.lastAutoTable.finalY ? doc.lastAutoTable.finalY + 10 : yPos + 40
    doc.setTextColor(...buhler)
    doc.setFontSize(15)
    doc.text('Downtime Impact', 20, afterInputsY)

    const calc = liveCalculations.value
    const downtimeData = [
      ['Annual Planned Downtime', `${formatNumber(calc.annualPlannedDowntimeHours)} hrs`],
      ['Annual Unplanned Downtime', `${formatNumber(calc.annualUnplannedDowntimeHours)} hrs`],
      ['Annual Production Loss (planned)', `${formatNumber(calc.annualPlannedProductionLoss)} ${weightUnitLabel.value}`],
      ['Annual Production Loss (unplanned)', `${formatNumber(calc.annualUnplannedProductionLoss)} ${weightUnitLabel.value}`],
      ['Annual Financial Loss (planned)', formatCurrency(calc.annualPlannedRevenueLoss)],
      ['Annual Financial Loss (unplanned)', formatCurrency(calc.annualUnplannedRevenueLoss)],
      ['Total Production Loss', `${formatNumber(calc.annualProductionLoss)} ${weightUnitLabel.value}`],
      ['Total Financial Loss', formatCurrency(calc.annualRevenueLoss)]
    ]

    autoTable(doc, {
      startY: afterInputsY + 2,
      head: [['Metric', 'Value']],
      body: downtimeData,
      theme: 'striped',
      headStyles: { fillColor: buhler, textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: bg },
      styles: { fontSize: 10, textColor: dark },
      columnStyles: { 0: { cellWidth: 100 } }
    })

    // Footer bar
    const pageCount = doc.getNumberOfPages ? doc.getNumberOfPages() : 1
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFillColor(...buhler)
      doc.rect(0, 285, 210, 10, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(9)
      doc.text('Bühler BRAM Calculator - Customer Summary', 20, 291)
      doc.text(`Page ${i} of ${pageCount}`, 170, 291)
    }

    const fileName = `${customerData.companyName.replace(/[^a-z0-9]/gi, '_')}_Customer_Summary.pdf`
    doc.save(fileName)

  } catch (error) {
    console.error('PDF export error:', error)
    alert('Error generating PDF. Please try again.')
  } finally {
    isExporting.value = false
  }
}

// Formatting helpers
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
</script>

<style scoped>
/* Page Layout */
.customer-data-page-wrapper {
  min-height: 100vh;
  min-height: 100dvh; /* Dynamic viewport height for mobile browsers */
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
}

.customer-data-page {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Header */
.page-header {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.brand-section {
  flex-shrink: 0;
}

.brand-logo-img {
  filter: drop-shadow(0 4px 8px rgba(0, 155, 145, 0.15));
  display: block;
  line-height: 1;
}

.title-section {
  flex: 1;
}

/* Company Section */
.company-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.company-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.company-label {
  display: flex;
  flex-direction: column;
  font-weight: 600;
  color: #334155;
  font-size: 0.875rem;
  gap: 0.25rem;
}

.company-hint {
  font-weight: 400;
  color: #64748b;
  font-size: 0.75rem;
}

.company-input {
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  width: 100%;
  max-width: 100%;
  min-height: 3rem; /* Minimum 48px touch target */
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  box-sizing: border-box;
}

.company-input:hover {
  border-color: #cbd5e1;
}

.company-input:focus {
  outline: none;
  border-color: var(--buhler-primary);
  box-shadow: 0 0 0 3px rgba(0, 155, 145, 0.1);
  background: white;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0;
}

.page-title i {
  color: var(--buhler-primary);
}

.title-text {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.title-bram {
  color: var(--buhler-primary);
  letter-spacing: -0.02em;
}

.title-calculator {
  color: #1e293b;
  letter-spacing: -0.01em;
}

.page-subtitle {
  color: #64748b;
  font-size: 1.1rem;
  margin: 0.5rem 0 0 0;
}

.pdf-export-btn {
  background: linear-gradient(135deg, var(--buhler-primary), var(--buhler-primary-600));
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.pdf-export-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--buhler-primary-600), var(--buhler-primary-700));
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 155, 145, 0.3);
}

.pdf-export-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Input Section */
.input-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 1.5rem 0;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.section-title i {
  color: var(--buhler-primary);
}

.input-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.group-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.group-title i {
  color: var(--buhler-primary);
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-weight: 600;
  color: #334155;
  font-size: 0.875rem;
}

.field-hint {
  font-weight: 400;
  color: #64748b;
  font-size: 0.75rem;
}

.field-input {
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  width: 100%;
  max-width: 100%;
  min-height: 3rem; /* Minimum 48px touch target */
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  box-sizing: border-box;
}

.field-input:hover {
  border-color: #cbd5e1;
}

.field-input:focus {
  outline: none;
  border-color: var(--buhler-primary);
  box-shadow: 0 0 0 3px rgba(0, 155, 145, 0.1);
  background: white;
}

.input-with-toggle {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.toggle-group {
  display: flex;
  gap: 0.5rem;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  border-color: var(--buhler-primary);
  color: var(--buhler-primary);
  background: rgba(0, 155, 145, 0.05);
}

.toggle-btn.active {
  background: var(--buhler-primary);
  color: white;
  border-color: var(--buhler-primary);
}

.calculate-section {
  display: flex;
  justify-content: center;
  padding-top: 1rem;
}

.calculate-btn {
  background: linear-gradient(135deg, var(--buhler-primary), var(--buhler-primary-600));
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
}

.calculate-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--buhler-primary-600), var(--buhler-primary-700));
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 155, 145, 0.3);
}

.calculate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Results Section */
.results-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Enhanced Export Action Bar */
.export-action-bar {
  margin-top: 1rem;
}

.export-container {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  backdrop-filter: saturate(180%) blur(12px);
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.export-info {
  flex: 1;
}

.export-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.export-description {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.export-btn-enhanced {
  background: linear-gradient(135deg, var(--buhler-primary) 0%, var(--buhler-primary-400) 100%);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 10px 15px -3px rgba(0, 155, 145, 0.3),
    0 4px 6px -2px rgba(0, 155, 145, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  min-width: 280px;
  min-height: 4rem; /* Minimum 64px touch target for important actions */
  overflow: hidden;
  position: relative;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.export-btn-enhanced::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.export-btn-enhanced::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.6s ease;
}

.export-btn-enhanced:hover::before {
  opacity: 1;
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  flex: 1;
}

.btn-icon {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  min-width: 3rem;
  min-height: 3rem;
}

/* Spinner Animation for Loading State */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.btn-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.125rem;
}

.btn-label {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.btn-subtitle {
  font-size: 0.75rem;
  opacity: 0.9;
  font-weight: 400;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.btn-arrow {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.export-btn-enhanced:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 
    0 20px 25px -5px rgba(0, 155, 145, 0.4),
    0 10px 10px -5px rgba(0, 155, 145, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  background: linear-gradient(135deg, var(--buhler-primary-400) 0%, var(--buhler-primary-300) 100%);
}

.export-btn-enhanced:hover:not(:disabled)::after {
  left: 100%;
}

.export-btn-enhanced:hover:not(:disabled) .btn-arrow {
  transform: translateX(4px);
}

.export-btn-enhanced:active:not(:disabled) {
  transform: translateY(0);
}

.export-btn-enhanced:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.export-btn-enhanced:disabled .btn-arrow {
  transform: none;
}

/* Mobile responsive export */
@media (max-width: 768px) {
  .export-container {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
    padding: 1.5rem;
  }
  
  .export-btn-enhanced {
    min-width: 100%;
    justify-content: center;
  }
  
  .btn-content {
    padding: 1.5rem;
  }
  
  /* Disable hover effects on touch devices */
  .export-btn-enhanced:hover:not(:disabled) {
    transform: none;
    box-shadow: 
      0 10px 15px -3px rgba(0, 155, 145, 0.3),
      0 4px 6px -2px rgba(0, 155, 145, 0.1);
  }
  
  .export-btn-enhanced:hover:not(:disabled) .btn-arrow {
    transform: none;
  }
  
  /* Better active states for touch */
  .export-btn-enhanced:active:not(:disabled) {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }
}

@media (max-width: 480px) {
  .export-container {
    padding: 1rem;
    border-radius: 16px;
  }
  
  .export-title {
    font-size: 1.125rem;
  }
  
  .export-description {
    font-size: 0.8rem;
  }
  
  .export-btn-enhanced {
    min-height: 4.5rem; /* Larger touch target on mobile */
  }
  
  .btn-content {
    padding: 1.5rem 1rem;
  }
  
  .btn-icon {
    min-width: 2.5rem;
    min-height: 2.5rem;
    padding: 0.625rem;
  }
  
  .btn-label {
    font-size: 0.95rem;
  }
  
  .btn-subtitle {
    font-size: 0.7rem;
  }
  
  .btn-arrow {
    padding: 0.875rem;
  }
}

/* Enhanced Mobile Responsive Design */
/* Tablet and smaller screens */
@media (max-width: 1400px) {
  .customer-data-page-wrapper {
    padding: 1rem;
  }
}

@media (max-width: 768px) {
  .customer-data-page-wrapper {
    padding: 1rem;
  }
  
  .customer-data-page {
    gap: 1.5rem;
  }
  
  .page-header {
    padding: 1.5rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
  
  .brand-logo-img {
    width: 100px;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .company-section,
  .input-section {
    padding: 1.5rem;
  }
  
  .section-title {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
  }
  
  .input-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    width: 100%;
    max-width: 100%;
  }
}

/* Mobile phones */
@media (max-width: 480px) {
  .customer-data-page-wrapper {
    padding: 0.75rem;
  }
  
  .customer-data-page {
    gap: 1rem;
  }
  
  .page-header,
  .company-section,
  .input-section {
    padding: 1rem;
    border-radius: 12px;
  }
  
  .brand-logo-img {
    width: 90px;
  }
  
  .page-title {
    font-size: 1.5rem;
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
  
  .page-subtitle {
    font-size: 0.9rem;
  }
  
  .section-title {
    font-size: 1.125rem;
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
    margin-bottom: 1.5rem;
  }
  
  .input-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    width: 100%;
    max-width: 100%;
  }
}

/* Very small screens */
@media (max-width: 360px) {
  .customer-data-page-wrapper {
    padding: 0.5rem;
  }
  
  .page-header,
  .company-section,
  .input-section {
    padding: 0.75rem;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
  
  .title-text {
    flex-direction: column;
    align-items: center;
    gap: 0.125rem;
    line-height: 1;
  }
  
  .title-bram {
    font-size: 1.25rem;
    line-height: 1;
  }
  
  .title-calculator {
    font-size: 1rem;
    line-height: 1;
    opacity: 0.8;
  }
  
  .export-container {
    padding: 0.75rem;
  }
}

/* Extra small screens - optimize for 320px and below */
@media (max-width: 320px) {
  .customer-data-page-wrapper {
    padding: 0.25rem;
  }
  
  .customer-data-page {
    gap: 0.75rem;
  }
  
  .page-header,
  .company-section,
  .input-section {
    padding: 0.5rem;
    border-radius: 8px;
  }
  
  .header-content {
    gap: 1rem;
  }
  
  .brand-logo-img {
    width: 80px;
  }
  
  .page-title {
    font-size: 1.125rem;
    gap: 0.75rem;
  }
  
  .title-text {
    flex-direction: column;
    align-items: center;
    gap: 0.1rem;
  }
  
  .title-bram {
    font-size: 1.125rem;
    font-weight: 700;
    line-height: 0.9;
  }
  
  .title-calculator {
    font-size: 0.875rem;
    opacity: 0.7;
    font-weight: 600;
    line-height: 0.9;
  }
  
  .page-subtitle {
    font-size: 0.85rem;
  }
  
  .section-title {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
  
  .company-input,
  .field-input {
    padding: 0.625rem 0.75rem;
    font-size: 0.9rem;
  }
  
  .export-container {
    padding: 0.5rem;
    gap: 1rem;
  }
  
  .export-title {
    font-size: 1rem;
  }
  
  .export-description {
    font-size: 0.75rem;
  }
}

/* Ultra small devices - under 300px */
@media (max-width: 300px) {
  .customer-data-page-wrapper {
    padding: 0.25rem;
    gap: 0.5rem;
  }
  
  .customer-data-page {
    gap: 0.5rem;
  }
  
  .page-header,
  .company-section,
  .input-section {
    padding: 0.375rem;
    border-radius: 6px;
  }
  
  .header-content {
    gap: 0.75rem;
  }
  
  .brand-logo-img {
    width: 70px;
  }
  
  .page-title {
    font-size: 1rem;
    gap: 0.5rem;
  }
  
  .title-text {
    flex-direction: column;
    align-items: center;
    gap: 0.1rem;
  }
  
  .title-bram {
    font-size: 1rem;
    font-weight: 700;
    line-height: 0.9;
  }
  
  .title-calculator {
    font-size: 0.8rem;
    opacity: 0.7;
    font-weight: 600;
    line-height: 0.9;
  }
  
  .page-subtitle {
    font-size: 0.75rem;
    margin-top: 0.375rem;
  }
  
  .section-title {
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
    gap: 0.375rem;
  }
  
  .company-input,
  .field-input {
    padding: 0.375rem 0.5rem;
    font-size: 0.85rem;
    min-height: 2.5rem;
  }
  
  .company-label,
  .field-label {
    font-size: 0.8rem;
  }
  
  .company-hint,
  .field-hint {
    font-size: 0.65rem;
  }
  
  .export-container {
    padding: 0.375rem;
    gap: 0.75rem;
    border-radius: 12px;
  }
  
  .export-title {
    font-size: 0.9rem;
  }
  
  .export-description {
    font-size: 0.7rem;
  }
  
  .export-btn-enhanced {
    min-width: 100%;
    min-height: 3.5rem;
  }
  
  .btn-content {
    padding: 1rem 0.75rem;
  }
  
  .btn-icon {
    min-width: 2rem;
    min-height: 2rem;
    padding: 0.5rem;
  }
  
  .btn-label {
    font-size: 0.85rem;
  }
  
  .btn-subtitle {
    font-size: 0.65rem;
  }
  
  .btn-arrow {
    padding: 0.75rem;
  }
}

/* Prevent zoom on input focus for iOS */
@supports (-webkit-touch-callout: none) {
  .company-input,
  .field-input {
    font-size: max(16px, 0.95rem); /* Prevents zoom on iOS */
  }
}

/* Mobile-specific touch optimizations */
@media (max-width: 768px) {
  /* Disable hover effects on touch devices */
  .company-input:hover,
  .field-input:hover,
  .toggle-btn:hover {
    border-color: #e2e8f0;
    background: #f8fafc;
  }
  
  /* Better active states for touch */
  .company-input:focus,
  .field-input:focus {
    border-color: var(--buhler-primary);
    box-shadow: 0 0 0 3px rgba(0, 155, 145, 0.1);
    background: white;
  }
  
  .toggle-btn:active {
    transform: scale(0.95);
    transition: transform 0.1s ease;
  }
}

/* Safe area support for devices with notches */
@supports (padding: max(0px)) {
  .customer-data-page-wrapper {
    padding-left: max(0.75rem, env(safe-area-inset-left));
    padding-right: max(0.75rem, env(safe-area-inset-right));
    padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
  }
}
</style>