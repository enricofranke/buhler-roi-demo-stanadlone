<template>
  <div class="roi-calculator" ref="rootRef">


    <!-- Step Progress -->
    <div class="step-progress">
      <div class="steps-header">
        <h3 class="steps-title">
          <i class="pi pi-list-check" aria-hidden="true"></i>
          Steps
        </h3>
        <span class="steps-counter">{{ currentStep }} of 3</span>
      </div>
      <div class="progress-container" :data-current-step="currentStep">
        <div 
          v-for="step in 3" 
          :key="step"
          class="progress-step"
          :class="{ 
            active: currentStep === step,
            completed: completedSteps.has(step) && currentStep !== step,
            clickable: step <= maxReachedStep
          }"
          @click="goToStep(step)"
        >
          <div class="step-circle">
            <i v-if="completedSteps.has(step) && currentStep !== step" class="pi pi-check"></i>
            <span v-else>{{ step }}</span>
          </div>
          <div class="step-info">
            <span class="step-label">{{ getStepLabel(step) }}</span>
            <span class="step-description">{{ getStepDescription(step) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Step Content -->
    <div class="step-content" :class="{ 'step-1': currentStep === 1, 'step-3': currentStep === 3 }">
      <!-- Step 1: Customer Information (shared component) -->
      <div v-if="currentStep === 1" class="step-container">
        <Step1CustomerInfo
          :inputs="inputs"
          :machines-terminology="machinesTerminology"
          :weight-unit="weightUnit"
          v-model:show-errors="showValidationErrorsStep1"
          title="Customer Information"
          subtitle="Enter the customer's production and operational details"
          @update:inputs="(v) => (inputs = v)"
          @update:machines-terminology="(v) => (machinesTerminology = v)"
          @update:weight-unit="(v) => (weightUnit = v)"
        >
          <template #downtime>
            <DowntimeImpact :calculations="liveCalculations" :weight-unit="weightUnit" />
          </template>
        </Step1CustomerInfo>
      </div>

      

      <!-- Step 2: Bühler Sales Information -->
      <div v-if="currentStep === 2" class="step-container">
        <!-- Sales Header Card -->
        <div class="sales-header-card">
          <div class="step-header">
            <h3 class="step-title">
              <i class="pi pi-briefcase" aria-hidden="true"></i>
              <span class="step-title-text">Bühler Sales Information</span>
            </h3>
            <p class="step-subtitle">Sales team: Please provide service solution details</p>
          </div>
        </div>
        
        <div class="input-grid sales-grid">
          <div class="input-section">
            <h4 class="section-title">
              <i class="pi pi-wrench" aria-hidden="true"></i>
              BRAM Service Benefits
            </h4>
          
          <div class="input-group">
              <label for="downtime-reduction" class="input-label">
                Estimated Downtime Reduction with BRAM (in hours per event)
                <span class="input-hint">Hours saved per downtime event with BRAM solution</span>
            </label>
            <div class="input-wrapper" :class="{ error: showValidationErrorsStep2 && step2ErrorState.estimatedDowntimeReductionPerEvent }">
              <input 
                  id="downtime-reduction"
                  v-model.number="inputs.estimatedDowntimeReductionPerEvent"
                type="number" 
                class="input-field"
                min="0"
                max="100"
                  step="1"
              />
                <span class="input-unit">hours</span>
            </div>
          <div v-if="showValidationErrorsStep2 && step2ErrorState.estimatedDowntimeReductionPerEvent" class="validation-hint">
            {{ inputs.estimatedDowntimeReductionPerEvent == null ? 'This field is required.' : 'Please enter a non-negative number of hours.' }}
          </div>
          </div>

          <div class="input-group">
            <label for="service-cost" class="input-label">
                Service Contract Cost / Year
              <span class="input-hint">Annual service agreement cost</span>
            </label>
            <div class="input-wrapper currency" :class="{ error: showValidationErrorsStep2 && step2ErrorState.serviceContractCost }">
              <span class="currency-symbol">$</span>
              <input 
                id="service-cost"
                v-model.number="inputs.serviceContractCost"
                type="number" 
                class="input-field"
                min="0"
                max="1000000"
                step="1000"
              />
              <span class="input-unit">per year</span>
              </div>
            <div v-if="showValidationErrorsStep2 && step2ErrorState.serviceContractCost" class="validation-hint">
              {{ inputs.serviceContractCost == null ? 'This field is required.' : 'Please enter a non-negative cost.' }}
            </div>
            </div>
          </div>

          <!-- Customer Data Preview -->
          <div class="input-section customer-preview">
            <h4 class="section-title">
              <i class="pi pi-eye" aria-hidden="true"></i>
              Customer Data Overview
            </h4>
            <div class="preview-grid">
              <div class="preview-item">
                <span class="preview-label">{{ machinesLabel }}</span>
                <span class="preview-value">{{ inputs.machinesInOperation || 0 }} units</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">Production Days/Year</span>
                <span class="preview-value">{{ inputs.productionDaysPerYear || 0 }} days</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">Production Hours/Day</span>
                <span class="preview-value">{{ inputs.productionHoursPerDay || 0 }} hours</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">{{ dailyOutputLabel }}</span>
                <span class="preview-value">
                  {{ weightUnit === 'kg' ? formatNumber(inputs.dailyOutputKg || 0) : weightUnit === 'lb' ? formatNumber(kgToLb(inputs.dailyOutputKg || 0)) : formatNumber(inputs.dailyOutputKg || 0) }} {{ weightUnitLabel }}
                </span>
              </div>
              <div class="preview-item">
                <span class="preview-label">Planned Maintenance Events/Year</span>
                <span class="preview-value">{{ inputs.plannedMaintenanceEvents || 0 }} events</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">Unplanned Maintenance Events/Year</span>
                <span class="preview-value">{{ inputs.unplannedMaintenanceEvents || 0 }} events</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">Planned Downtime Duration</span>
                <span class="preview-value">{{ inputs.plannedDowntimeDurationPerEvent || 0 }} hours</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">Unplanned Downtime Duration</span>
                <span class="preview-value">{{ inputs.unplannedDowntimeDurationPerEvent || 0 }} hours</span>
              </div>
              <div class="preview-item">
              <span class="preview-label">Sales Price / Margin</span>
              <span class="preview-value">
                ${{ (inputs.salesPricePerKg || 0).toFixed(2) }}/{{ weightUnitLabel }} · {{ (inputs.marginPercent || 0).toFixed(1) }}%
              </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Step 3: Results -->
      <div v-if="currentStep === 3" class="step-container step-3-results">
        <!-- ROI Analysis Results Header Card -->
        <div class="roi-header-card">
          <div class="step-header">
            <h3 class="step-title">
              <i class="pi pi-chart-line" aria-hidden="true"></i>
              <span class="step-title-text">ROI Analysis Results</span>
            </h3>
            <p class="step-subtitle">Your complete return on investment analysis</p>
          </div>
        </div>
        
        <!-- Downtime Impact Card -->
        <div v-if="showResults" class="metrics-section">
            <h4 class="section-header">Downtime Impact</h4>
            
            <!-- Downtime Hours -->
            <div class="results-grid">
              <div class="metric-card warning">
                <div class="metric-icon">
                  <i class="pi pi-calendar" aria-hidden="true"></i>
                </div>
                <div class="metric-content">
                  <span class="metric-label">Annual Planned Downtime</span>
                  <span class="metric-value">{{ formatNumber(calculations.annualPlannedDowntimeHours) }}</span>
                  <span class="metric-sublabel">Hours per year</span>
                </div>
              </div>

              <div class="metric-card danger">
                <div class="metric-icon">
                  <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
                </div>
                <div class="metric-content">
                  <span class="metric-label">Annual Unplanned Downtime</span>
                  <span class="metric-value">{{ formatNumber(calculations.annualUnplannedDowntimeHours) }}</span>
                  <span class="metric-sublabel">Hours per year</span>
                </div>
              </div>
            </div>

            <!-- Production Loss -->
            <div class="results-grid">
              <div class="metric-card info">
                <div class="metric-icon">
                  <i class="pi pi-balance-scale" aria-hidden="true"></i>
                </div>
                <div class="metric-content">
                  <span class="metric-label">Annual Production Loss</span>
                  <span class="metric-sublabel-top">(Through planned downtime)</span>
                  <span class="metric-value">{{ formatNumber(calculations.annualPlannedProductionLoss) }}</span>
                  <span class="metric-sublabel">{{ weightUnitLabel }} lost per year</span>
                </div>
              </div>

              <div class="metric-card info">
                <div class="metric-icon">
                  <i class="pi pi-balance-scale" aria-hidden="true"></i>
                </div>
                <div class="metric-content">
                  <span class="metric-label">Annual Production Loss</span>
                  <span class="metric-sublabel-top">(Through unplanned downtime)</span>
                  <span class="metric-value">{{ formatNumber(calculations.annualUnplannedProductionLoss) }}</span>
                  <span class="metric-sublabel">{{ weightUnitLabel }} lost per year</span>
                </div>
              </div>
            </div>

            <!-- Financial Loss -->
            <div class="results-grid">
              <div class="metric-card warning">
                <div class="metric-icon">
                  <i class="pi pi-dollar" aria-hidden="true"></i>
                </div>
                <div class="metric-content">
                  <span class="metric-label">Annual Financial Loss</span>
                  <span class="metric-sublabel-top">(Through planned downtime)</span>
                  <span class="metric-value">{{ formatCurrency(calculations.annualPlannedRevenueLoss) }}</span>
                  <span class="metric-sublabel">Revenue lost annually</span>
                </div>
              </div>

              <div class="metric-card danger">
                <div class="metric-icon">
                  <i class="pi pi-dollar" aria-hidden="true"></i>
                </div>
                <div class="metric-content">
                  <span class="metric-label">Annual Financial Loss</span>
                  <span class="metric-sublabel-top">(Through unplanned downtime)</span>
                  <span class="metric-value">{{ formatCurrency(calculations.annualUnplannedRevenueLoss) }}</span>
                  <span class="metric-sublabel">Revenue lost annually</span>
                </div>
              </div>
            </div>

            <!-- Total Impact Summary -->
            <div class="total-summary">
              <h5 class="summary-subtitle">Total Combined Impact</h5>
              <div class="results-grid">
                <div class="metric-card total-card">
                  <div class="metric-icon">
                    <i class="pi pi-clock" aria-hidden="true"></i>
                  </div>
                  <div class="metric-content">
                    <span class="metric-label">Total Annual Downtime</span>
                    <span class="metric-value">{{ formatNumber(calculations.annualDowntimeHours) }}</span>
                    <span class="metric-sublabel">Hours lost per year</span>
                  </div>
                </div>

                <div class="metric-card total-card">
                  <div class="metric-icon">
                    <i class="pi pi-balance-scale" aria-hidden="true"></i>
                  </div>
                  <div class="metric-content">
                    <span class="metric-label">Total Production Loss</span>
                    <span class="metric-value">{{ formatNumber(calculations.annualProductionLoss) }}</span>
                    <span class="metric-sublabel">{{ weightUnitLabel }} lost per year</span>
                  </div>
                </div>

                <div class="metric-card total-card">
                  <div class="metric-icon">
                    <i class="pi pi-dollar" aria-hidden="true"></i>
                  </div>
                  <div class="metric-content">
                    <span class="metric-label">Total Financial Loss</span>
                    <span class="metric-value">{{ formatCurrency(calculations.annualRevenueLoss) }}</span>
                    <span class="metric-sublabel">Revenue lost annually</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        <!-- Impact of BRAM Card -->
        <div v-if="showResults" class="metrics-section">
            <h4 class="section-header">Impact of BRAM</h4>
            <div class="results-grid">
              <div class="metric-card success">
                <div class="metric-icon">
                  <i class="pi pi-clock" aria-hidden="true"></i>
                </div>
                <div class="metric-content">
                  <span class="metric-label">Downtime Reduction</span>
                  <span class="metric-value">{{ formatNumber(calculations.additionalUptimeHours) }}</span>
                  <span class="metric-sublabel">Hours saved annually</span>
                </div>
              </div>

              <div class="metric-card success">
                <div class="metric-icon">
                  <i class="pi pi-box" aria-hidden="true"></i>
                </div>
                <div class="metric-content">
                  <span class="metric-label">Reduction of Production Loss</span>
                  <span class="metric-value">{{ formatNumber(calculations.additionalOutput) }}</span>
                  <span class="metric-sublabel">kg saved per year</span>
                </div>
              </div>

              <div class="metric-card success">
                <div class="metric-icon">
                  <i class="pi pi-chart-line" aria-hidden="true"></i>
                </div>
                <div class="metric-content">
                  <span class="metric-label">Reduction of Downtime Costs</span>
                  <span class="metric-value">{{ formatCurrency(calculations.potentialSavings) }}</span>
                  <span class="metric-sublabel">Additional margin per year</span>
                </div>
              </div>
            </div>
          </div>

        <!-- ROI Calculation Card -->
        <div v-if="showResults" class="metrics-section">
            <h4 class="section-header">ROI Calculation</h4>
            <div class="results-grid">
              <div class="metric-card primary">
                <div class="metric-icon">
                  <i class="pi pi-percentage" aria-hidden="true"></i>
                </div>
                <div class="metric-content">
                  <span class="metric-label">Return on Investment</span>
                  <span class="metric-value">{{ formatPercentage(calculations.roi) }}</span>
                  <span class="metric-sublabel">Annual ROI</span>
                </div>
              </div>

              <div class="metric-card info">
                <div class="metric-icon">
                  <i class="pi pi-calendar" aria-hidden="true"></i>
                </div>
                <div class="metric-content">
                  <span class="metric-label">Payback Period</span>
                  <span class="metric-value">{{ formatMonths(calculations.paybackMonths) }}</span>
                  <span class="metric-sublabel">ROI in years</span>
                </div>
              </div>
            </div>
          </div>

        <!-- Detailed Financial Analysis Card -->
        <div v-if="showResults" class="financial-summary">
            <h4 class="summary-title">
              <i class="pi pi-chart-bar" aria-hidden="true"></i>
              Detailed Financial Analysis
            </h4>
            
            <!-- Current Situation -->
            <div class="summary-section">
              <h5 class="summary-section-title">Current Downtime Impact</h5>
              <div class="summary-items">
                <div class="summary-item">
                  <span class="summary-label">Annual Revenue Loss</span>
                  <span class="summary-value negative">{{ formatCurrency(calculations.annualRevenueLoss) }}</span>
                </div>
              </div>
            </div>

            <!-- BRAM Impact -->
            <div class="summary-section">
              <h5 class="summary-section-title">With BRAM Service</h5>
              <div class="summary-items">
                <div class="summary-item">
                  <span class="summary-label">Estimated Reduction of Downtime Costs</span>
                  <span class="summary-value positive">{{ formatCurrency(calculations.potentialSavings) }}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Annual Service Contract Cost</span>
                  <span class="summary-value negative">{{ formatCurrency(inputs.serviceContractCost || 0) }}</span>
                </div>
                <div class="summary-item total">
                  <span class="summary-label">Net Annual Benefit</span>
                  <span class="summary-value" :class="{positive: calculations.netSavings > 0, negative: calculations.netSavings < 0}">
                    {{ formatCurrency(calculations.netSavings) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

        <!-- ROI Projection Over Time Card -->
        <div v-if="showResults" class="chart-container">
            <h4 class="chart-title">ROI Projection Over Time</h4>
            <div 
              ref="chartRef"
              class="roi-chart"
            ></div>
          </div>

        <!-- Export Action Bar for Results -->
        <div v-if="showResults" class="export-section">
          <ExportActionBar 
            :can-export="showResults && isStepCompleted(1) && isStepCompleted(2)" 
            :is-exporting="isExporting" 
            @export="exportToPDF"
            @attempt="onExportAttempt"
          />
        </div>
      </div>
    </div>

    <!-- Step Navigation -->
    <div class="step-navigation">
        <button 
        v-if="currentStep > 1"
        @click="previousStep"
        class="nav-btn nav-btn-secondary"
      >
        <i class="pi pi-arrow-left"></i>
        Previous
      </button>
      
      <div class="nav-spacer"></div>
      
      <button 
        v-if="currentStep < 3"
        @click="nextStep"
        class="nav-btn nav-btn-primary"
      >
        Next
        <i class="pi pi-arrow-right"></i>
      </button>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import DowntimeImpact from './DowntimeImpact.vue'
import Step1CustomerInfo from './Step1CustomerInfo.vue'
import ExportActionBar from './ExportActionBar.vue'

interface RoiInputs {
  machinesInOperation: number | null
  plannedMaintenanceEvents: number | null
  unplannedMaintenanceEvents: number | null
  plannedDowntimeDurationPerEvent: number | null
  unplannedDowntimeDurationPerEvent: number | null
  productionDaysPerYear: number | null
  productionHoursPerDay: number | null
  dailyOutputKg: number | null
  salesPricePerKg: number | null
  marginPercent: number | null
  estimatedDowntimeReductionPerEvent: number | null
  serviceContractCost: number | null
}

interface RoiCalculations {
  // Planned Downtime
  annualPlannedDowntimeHours: number
  annualPlannedProductionLoss: number
  annualPlannedRevenueLoss: number
  
  // Unplanned Downtime
  annualUnplannedDowntimeHours: number
  annualUnplannedProductionLoss: number
  annualUnplannedRevenueLoss: number
  
  // Combined Totals
  annualDowntimeHours: number
  annualProductionLoss: number
  annualRevenueLoss: number
  
  // BRAM Impact
  additionalUptimeHours: number
  additionalOutput: number
  potentialSavings: number
  netSavings: number
  roi: number
  paybackMonths: number
}

// Input reactive data (empty default values)
const inputs = ref<RoiInputs>({
  machinesInOperation: null,
  plannedMaintenanceEvents: null,
  unplannedMaintenanceEvents: null,
  plannedDowntimeDurationPerEvent: null,
  unplannedDowntimeDurationPerEvent: null,
  productionDaysPerYear: null,
  productionHoursPerDay: null,
  dailyOutputKg: null,
  salesPricePerKg: null,
  marginPercent: null,
  estimatedDowntimeReductionPerEvent: null,
  serviceContractCost: null
})

// Chart reference
const chartRef = ref<HTMLElement>()
// Root element ref for scrolling
const rootRef = ref<HTMLElement | null>(null)

const scrollToTopOfForm = () => {
  // Prefer scrolling the component container into view; fallback to window
  if (rootRef.value && typeof rootRef.value.scrollIntoView === 'function') {
    rootRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let chartInstance: any = null

// Get echarts instance from plugin
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { $echarts } = useNuxtApp() as unknown as { $echarts: any }

// PDF Export state
const isExporting = ref(false)

// Show results state
const showResults = ref(false)

// Step navigation state
const currentStep = ref(1)
const maxReachedStep = ref(1)

// Track which steps have been completed (have all required fields filled)
const completedSteps = ref<Set<number>>(new Set())

// Toggle for machine terminology
const machinesTerminology = ref<'operation' | 'scope'>('scope')

// Weight unit system - default to 'lb'
const weightUnit = ref<'kg' | 'lb' | ''>('lb')

// Conversion function (for display purposes)
const kgToLb = (kg: number): number => Math.round(kg * 2.20462 * 10) / 10

// Computed labels based on terminology toggle
const machinesLabel = computed(() => 
  machinesTerminology.value === 'operation' ? 'Machines in Operation' : 'Machines in Scope'
)

const dailyOutputLabel = computed(() => 
  machinesTerminology.value === 'operation' 
    ? 'Daily Output of machines in operation'
    : 'Daily Output of machines in scope'
)

// Weight unit labels
const weightUnitLabel = computed(() => weightUnit.value || 'unit')

// Removed unused field handlers; validation and clamping are handled within form components

// Live calculations for preview
const liveCalculations = computed(() => {
  const input = inputs.value
  const machinesInOperation = input.machinesInOperation || 0
  const plannedMaintenanceEvents = input.plannedMaintenanceEvents || 0
  const unplannedMaintenanceEvents = input.unplannedMaintenanceEvents || 0
  const plannedDowntimeDurationPerEvent = input.plannedDowntimeDurationPerEvent || 0
  const unplannedDowntimeDurationPerEvent = input.unplannedDowntimeDurationPerEvent || 0
  const _productionDaysPerYear = input.productionDaysPerYear || 0
  const productionHoursPerDay = input.productionHoursPerDay || 0
  const dailyOutputKg = input.dailyOutputKg || 0
  // Keep for backward compatibility if present (but derived value is used below)
  // Derive product margin per kg from sales price and margin percent
  const derivedMarginPerKg = (() => {
    const sales = input.salesPricePerKg || 0
    const marginPct = input.marginPercent || 0
    return sales * (marginPct / 100)
  })()

  const hourlyProductionRate = productionHoursPerDay > 0 ? dailyOutputKg / productionHoursPerDay : 0
  const annualPlannedDowntimeHours = plannedMaintenanceEvents * plannedDowntimeDurationPerEvent * machinesInOperation
  const annualPlannedProductionLoss = annualPlannedDowntimeHours * hourlyProductionRate
  const annualPlannedRevenueLoss = annualPlannedProductionLoss * derivedMarginPerKg
  const annualUnplannedDowntimeHours = unplannedMaintenanceEvents * unplannedDowntimeDurationPerEvent * machinesInOperation
  const annualUnplannedProductionLoss = annualUnplannedDowntimeHours * hourlyProductionRate
  const annualUnplannedRevenueLoss = annualUnplannedProductionLoss * derivedMarginPerKg
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

// Manual calculations (not computed - only updated when calculate button is clicked)
const calculations = ref<RoiCalculations>({
  // Planned Downtime
  annualPlannedDowntimeHours: 0,
  annualPlannedProductionLoss: 0,
  annualPlannedRevenueLoss: 0,
  
  // Unplanned Downtime
  annualUnplannedDowntimeHours: 0,
  annualUnplannedProductionLoss: 0,
  annualUnplannedRevenueLoss: 0,
  
  // Combined Totals
  annualDowntimeHours: 0,
  annualProductionLoss: 0,
  annualRevenueLoss: 0,
  
  // BRAM Impact
  additionalUptimeHours: 0,
  additionalOutput: 0,
  potentialSavings: 0,
  netSavings: 0,
  roi: 0,
  paybackMonths: 0
})

// Function to perform calculations
const performCalculations = (): RoiCalculations => {
  const input = inputs.value
  
  // Convert null values to 0 for calculations
  const machinesInOperation = input.machinesInOperation || 0
  const plannedMaintenanceEvents = input.plannedMaintenanceEvents || 0
  const unplannedMaintenanceEvents = input.unplannedMaintenanceEvents || 0
  const plannedDowntimeDurationPerEvent = input.plannedDowntimeDurationPerEvent || 0
  const unplannedDowntimeDurationPerEvent = input.unplannedDowntimeDurationPerEvent || 0
  const _productionDaysPerYear = input.productionDaysPerYear || 0
  const productionHoursPerDay = input.productionHoursPerDay || 0
  const dailyOutputKg = input.dailyOutputKg || 0
  const derivedMarginPerKg = (() => {
    const sales = input.salesPricePerKg || 0
    const marginPct = input.marginPercent || 0
    return sales * (marginPct / 100)
  })()
  const estimatedDowntimeReductionPerEvent = input.estimatedDowntimeReductionPerEvent || 0
  const serviceContractCost = input.serviceContractCost || 0
  
  // === CURRENT DOWNTIME IMPACT ===
  
  // Hourly production rate = Daily output / Production hours per day
  const hourlyProductionRate = productionHoursPerDay > 0 ? dailyOutputKg / productionHoursPerDay : 0
  
  // Annual production capacity = Daily output × Production days per year
  const _annualProductionCapacity = dailyOutputKg * _productionDaysPerYear
  
  // Total annual production hours = Production days × Production hours per day
  const _annualProductionHours = _productionDaysPerYear * productionHoursPerDay
  
  // PLANNED DOWNTIME CALCULATIONS
  // Planned downtime hours per year = Planned events × Duration × Machines
  const annualPlannedDowntimeHours = plannedMaintenanceEvents * 
                                     plannedDowntimeDurationPerEvent * 
                                     machinesInOperation
  
  // Planned production loss = Planned downtime hours × Hourly production rate
  const annualPlannedProductionLoss = annualPlannedDowntimeHours * hourlyProductionRate
  
  // Planned revenue loss = Planned production loss × Product margin
  const annualPlannedRevenueLoss = annualPlannedProductionLoss * derivedMarginPerKg
  
  // UNPLANNED DOWNTIME CALCULATIONS
  // Unplanned downtime hours per year = Unplanned events × Duration × Machines
  const annualUnplannedDowntimeHours = unplannedMaintenanceEvents * 
                                       unplannedDowntimeDurationPerEvent * 
                                       machinesInOperation
  
  // Unplanned production loss = Unplanned downtime hours × Hourly production rate
  const annualUnplannedProductionLoss = annualUnplannedDowntimeHours * hourlyProductionRate
  
  // Unplanned revenue loss = Unplanned production loss × Product margin
  const annualUnplannedRevenueLoss = annualUnplannedProductionLoss * derivedMarginPerKg
  
  // COMBINED TOTALS
  const annualDowntimeHours = annualPlannedDowntimeHours + annualUnplannedDowntimeHours
  const annualProductionLoss = annualPlannedProductionLoss + annualUnplannedProductionLoss
  const annualRevenueLoss = annualPlannedRevenueLoss + annualUnplannedRevenueLoss
  
  // === POTENTIAL IMPACT OF BRAM ===
  // C17: Additional Uptime (hours/year) = Total events × Reduction per event × Machines
  // Formula: (Planned + Unplanned events) × Reduction per event × Machines
  const totalMaintenanceEvents = plannedMaintenanceEvents + unplannedMaintenanceEvents
  const additionalUptimeHours = totalMaintenanceEvents * 
                                estimatedDowntimeReductionPerEvent * 
                                machinesInOperation
  
  // C18: Additional Output (kg/year) = Additional Uptime × Hourly production
  const additionalOutput = additionalUptimeHours * hourlyProductionRate
  
  // C19: Additional Margin (USD/year) = Additional Output × Product Margin
  const potentialSavings = additionalOutput * derivedMarginPerKg
  
  // === ROI CALCULATION ===
  // C23: Net savings per year = Additional Margin - Service Contract Cost
  const netSavings = potentialSavings - serviceContractCost
  
  // C22: ROI in Years = Service Contract Cost / Additional Margin
  const roiInYears = potentialSavings > 0 
    ? serviceContractCost / potentialSavings 
    : Infinity
  
  // ROI as percentage (inverse of ROI in years × 100)
  const roi = roiInYears > 0 && roiInYears !== Infinity
    ? (1 / roiInYears) * 100
    : 0
  
  // Payback period in months
  const paybackMonths = roiInYears * 12
  
  return {
    // Planned Downtime
    annualPlannedDowntimeHours,
    annualPlannedProductionLoss,
    annualPlannedRevenueLoss,
    
    // Unplanned Downtime
    annualUnplannedDowntimeHours,
    annualUnplannedProductionLoss,
    annualUnplannedRevenueLoss,
    
    // Combined Totals
    annualDowntimeHours,
    annualProductionLoss,
    annualRevenueLoss,
    
    // BRAM Impact
    additionalUptimeHours,
    additionalOutput,
    potentialSavings,
    netSavings,
    roi,
    paybackMonths
  }
}

// Chart options
const chartOptions = computed(() => {
  const calc = calculations.value
  const input = inputs.value
  const serviceContractCost = input.serviceContractCost || 0
  
  // Generate 60-month projection (5 years)
  const months = Array.from({length: 61}, (_, i) => i) // 0 to 60 months
  const monthlyGrossSavings = calc.potentialSavings / 12 // Monthly savings from reduced downtime
  
  // Calculate cumulative savings accounting for annual service payments
  const cumulativeSavings = months.map(month => {
    // Calculate how many years have passed (service paid at start of each year)
    const yearsPaid = Math.floor(month / 12) + 1 // Always at least 1 year paid
    const totalServicePaid = yearsPaid * serviceContractCost
    const totalGrossSavings = monthlyGrossSavings * month
    
    // Net position = savings - service costs paid
    return totalGrossSavings - totalServicePaid
  })
  
  return {
    tooltip: {
      trigger: 'axis',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: (params: any) => {
        const month = params[0].dataIndex
        const value = params[0].value
        const monthlyPotentialSavings = calc.potentialSavings / 12
        const yearsPaid = Math.floor(month / 12) + 1
        const totalServicePaid = yearsPaid * serviceContractCost
        const totalGrossSavings = monthlyPotentialSavings * month
        
        return `
          <div style="padding: 10px;">
            <strong>Month ${month}</strong><br/>
            Cumulative Net Value: <strong>${formatCurrency(value)}</strong><br/>
            <hr style="margin: 5px 0; border-color: #e2e8f0;">
            Total Savings: ${formatCurrency(totalGrossSavings)}<br/>
            Service Costs Paid: ${formatCurrency(totalServicePaid)}<br/>
            <small>(${yearsPaid} year${yearsPaid !== 1 ? 's' : ''} × ${formatCurrency(serviceContractCost)})</small>
          </div>
        `
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: months.map(m => `Month ${m}`),
      axisLine: {
        lineStyle: { color: '#e2e8f0' }
      },
      axisLabel: {
        color: '#64748b',
        interval: 5, // Show every 6th label (0, 6, 12, 18...)
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: { color: '#e2e8f0' }
      },
      axisLabel: {
        color: '#64748b',
        formatter: (value: number) => '$' + (value / 1000).toFixed(0) + 'k'
      },
      splitLine: {
        lineStyle: { color: '#f1f5f9' }
      }
    },
    series: [{
      name: 'Cumulative Net Savings',
      type: 'line',
      data: cumulativeSavings,
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        width: 3,
        color: 'var(--buhler-primary)'
      },
      itemStyle: {
        color: 'var(--buhler-primary)',
        borderWidth: 2,
        borderColor: '#fff'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(0, 155, 145, 0.3)' },
            { offset: 1, color: 'rgba(0, 155, 145, 0.05)' }
          ]
        }
      },
      markLine: {
        data: [
          {
            yAxis: 0,
            label: {
              formatter: 'Break Even',
              position: 'end',
              color: '#64748b'
            },
            lineStyle: {
              color: '#ef4444',
              type: 'dashed',
              width: 2
            }
          },
          // Annual payment lines
          { xAxis: 0, lineStyle: { color: '#ef4444', type: 'solid', width: 1, opacity: 0.3 } },
          { xAxis: 12, lineStyle: { color: '#ef4444', type: 'solid', width: 1, opacity: 0.3 } },
          { xAxis: 24, lineStyle: { color: '#ef4444', type: 'solid', width: 1, opacity: 0.3 } },
          { xAxis: 36, lineStyle: { color: '#ef4444', type: 'solid', width: 1, opacity: 0.3 } },
          { xAxis: 48, lineStyle: { color: '#ef4444', type: 'solid', width: 1, opacity: 0.3 } }
        ]
      },
      markPoint: {
        data: [
          { name: 'Annual fee', xAxis: 0, yAxis: cumulativeSavings[0], symbol: 'none', 
            label: { formatter: 'Annual fee', position: 'bottom', color: '#ef4444', fontSize: 10 } },
          { name: 'Annual fee', xAxis: 12, yAxis: cumulativeSavings[12], symbol: 'none',
            label: { formatter: 'Annual fee', position: 'bottom', color: '#ef4444', fontSize: 10 } },
          { name: 'Annual fee', xAxis: 24, yAxis: cumulativeSavings[24], symbol: 'none',
            label: { formatter: 'Annual fee', position: 'bottom', color: '#ef4444', fontSize: 10 } },
          { name: 'Annual fee', xAxis: 36, yAxis: cumulativeSavings[36], symbol: 'none',
            label: { formatter: 'Annual fee', position: 'bottom', color: '#ef4444', fontSize: 10 } },
          { name: 'Annual fee', xAxis: 48, yAxis: cumulativeSavings[48], symbol: 'none',
            label: { formatter: 'Annual fee', position: 'bottom', color: '#ef4444', fontSize: 10 } }
        ]
      }
    }]
  }
})

// Initialize chart
const initChart = async () => {
  await nextTick()
  if (chartRef.value && $echarts) {
    // Dispose existing instance if it exists
    if (chartInstance) {
      chartInstance.dispose()
      chartInstance = null
    }
    // Create new instance
    chartInstance = $echarts.init(chartRef.value)
    updateChart()
  }
}

// Update chart
const updateChart = () => {
  if (chartInstance) {
    chartInstance.setOption(chartOptions.value)
  }
}

// Step navigation functions
const getStepLabel = (step: number): string => {
  switch (step) {
    case 1: return 'Customer Info'
    case 2: return 'Sales Input'
    case 3: return 'Results'
    default: return ''
  }
}

const getStepDescription = (step: number): string => {
  switch (step) {
    case 1: return 'Production & operational details'
    case 2: return 'Service solution parameters'
    case 3: return 'ROI analysis & recommendations'
    default: return ''
  }
}



// Validation visibility flags per step
const showValidationErrorsStep1 = ref(false)
const showValidationErrorsStep2 = ref(false)

// Validation state for Step 1 visual errors
const step1ErrorState = computed(() => {
  const v = inputs.value
  return {
    machinesInOperation: !(v.machinesInOperation != null && v.machinesInOperation >= 1),
    productionDaysPerYear: !(v.productionDaysPerYear == null || (v.productionDaysPerYear >= 1 && v.productionDaysPerYear <= 365)),
    productionHoursPerDay: !(v.productionHoursPerDay == null || (v.productionHoursPerDay >= 0 && v.productionHoursPerDay <= 24)),
    dailyOutputKg: !(v.dailyOutputKg != null && v.dailyOutputKg > 0),
    weightUnit: !(weightUnit.value === 'kg' || weightUnit.value === 'lb'),
    plannedMaintenanceEvents: !(v.plannedMaintenanceEvents != null && v.plannedMaintenanceEvents >= 0),
    unplannedMaintenanceEvents: !(v.unplannedMaintenanceEvents != null && v.unplannedMaintenanceEvents >= 0),
    plannedDowntimeDurationPerEvent: !(v.plannedDowntimeDurationPerEvent != null && v.plannedDowntimeDurationPerEvent >= 0.5),
    unplannedDowntimeDurationPerEvent: !(v.unplannedDowntimeDurationPerEvent != null && v.unplannedDowntimeDurationPerEvent >= 0.5),
    salesPricePerKg: !(v.salesPricePerKg != null && v.salesPricePerKg >= 0),
    marginPercent: !(v.marginPercent == null || (v.marginPercent >= 0 && v.marginPercent <= 100))
  }
})

// Validation state for Step 2 visual errors
const step2ErrorState = computed(() => {
  const v = inputs.value
  return {
    estimatedDowntimeReductionPerEvent:
      !(v.estimatedDowntimeReductionPerEvent != null && v.estimatedDowntimeReductionPerEvent >= 0),
    serviceContractCost: !(v.serviceContractCost != null && v.serviceContractCost >= 0)
  }
})

// Check if a specific step is completed
const isStepCompleted = (step: number): boolean => {
  if (step === 1) {
    const e = step1ErrorState.value
    return !(
      e.machinesInOperation ||
      e.productionDaysPerYear ||
      e.productionHoursPerDay ||
      e.dailyOutputKg ||
      e.weightUnit ||
      e.plannedMaintenanceEvents ||
      e.unplannedMaintenanceEvents ||
      e.plannedDowntimeDurationPerEvent ||
      e.unplannedDowntimeDurationPerEvent ||
      e.salesPricePerKg ||
      e.marginPercent
    )
  } else if (step === 2) {
    const e = step2ErrorState.value
    return !(e.estimatedDowntimeReductionPerEvent || e.serviceContractCost)
  } else if (step === 3) {
    // Results step is completed when calculations are done
    return showResults.value
  }
  return false
}

const canProceedToNextStep = computed(() => {
  return isStepCompleted(currentStep.value)
})

const goToStep = (step: number) => {
  if (step <= maxReachedStep.value) {
    currentStep.value = step
    // Always auto-calculate when going to results step (manual click or navigation)
    if (step === 3) {
      calculateResults()
    }
    // Scroll to the top of the step content so users see the inputs immediately
    nextTick(() => scrollToTopOfForm())
  }
}

const nextStep = () => {
  if (currentStep.value < 3 && canProceedToNextStep.value) {
    // Mark current step as completed before moving to next
    if (isStepCompleted(currentStep.value)) {
      completedSteps.value.add(currentStep.value)
    }
    
    currentStep.value++
    if (currentStep.value > maxReachedStep.value) {
      maxReachedStep.value = currentStep.value
    }
    // Auto-calculate when reaching results step
    if (currentStep.value === 3) {
      calculateResults()
    }
    // Scroll up to the top of the newly shown step
    nextTick(() => scrollToTopOfForm())
  } else if (currentStep.value < 3 && !canProceedToNextStep.value) {
    // Trigger visual validation on current step only
    if (currentStep.value === 1) showValidationErrorsStep1.value = true
    if (currentStep.value === 2) showValidationErrorsStep2.value = true
    // Scroll to first error field
    nextTick(() => {
      const firstError = document.querySelector('.input-wrapper.error') as HTMLElement | null
      if (firstError && typeof firstError.scrollIntoView === 'function') {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    // Scroll to top of the step after navigating back
    nextTick(() => scrollToTopOfForm())
  }
}

// Calculate results function
const calculateResults = () => {
  // Perform calculations and update the calculations ref
  calculations.value = performCalculations()
  showResults.value = true
  
  // Mark step 3 as completed when results are calculated
  completedSteps.value.add(3)
  
  // Initialize and update chart after results are shown
  nextTick(async () => {
    await initChart()
    updateChart()
  })
}

// When export is attempted while disabled, surface validation and scroll to first error
const onExportAttempt = () => {
  // If step 1 or 2 not complete, enable their validation flags
  if (!isStepCompleted(1)) showValidationErrorsStep1.value = true
  if (!isStepCompleted(2)) showValidationErrorsStep2.value = true
  nextTick(() => {
    const firstError = document.querySelector('.input-wrapper.error') as HTMLElement | null
    if (firstError && typeof firstError.scrollIntoView === 'function') {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  })
}

// Only watch calculations changes to update chart (not inputs)
watch(calculations, () => {
  if (showResults.value) {
    updateChart()
  }
}, { deep: true })

// Watch showResults to initialize chart when results become visible
watch(showResults, (newValue) => {
  if (newValue) {
    nextTick(async () => {
      await initChart()
      updateChart()
    })
  }
})

// Watch inputs to automatically track completed steps
watch(inputs, () => {
  // Check and update completed steps based on current data
  if (isStepCompleted(1)) {
    completedSteps.value.add(1)
  } else {
    completedSteps.value.delete(1)
  }
  
  if (isStepCompleted(2)) {
    completedSteps.value.add(2)
  } else {
    completedSteps.value.delete(2)
  }
}, { deep: true, immediate: true })

// Lifecycle hooks
onMounted(() => {
  // Don't initialize chart on mount since results are hidden initially
  // Chart will be initialized when calculateResults is called
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (chartInstance) {
      chartInstance.resize()
    }
  })
})

// Formatting helpers – use spaces as thousands separators
const formatWithSpaces = (value: number, fractionDigits = 0): string => {
  if (value == null || !isFinite(value)) return '0'
  const fixed = fractionDigits != null ? value.toFixed(fractionDigits) : String(value)
  const parts = fixed.split('.')
  const intPart = parts[0] || '0'
  const fracPart = parts[1]
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return fracPart ? `${grouped}.${fracPart}` : grouped
}

const formatCurrency = (value: number): string => {
  return `$${formatWithSpaces(Math.round(value), 0)}`
}

const formatNumber = (value: number): string => {
  return formatWithSpaces(Math.round(value), 0)
}

const formatPercentage = (value: number): string => {
  return value.toFixed(0) + '%'
}

const formatMonths = (value: number): string => {
  if (!isFinite(value)) return 'N/A'
  if (value < 12) return value.toFixed(1) + ' months'
  return (value / 12).toFixed(1) + ' years'
}

// Professional PDF Export function with jsPDF - Corporate Quality
const exportToPDF = async () => {
  if (isExporting.value) return
  
  // Only run on client side
  if (typeof window === 'undefined') return
  
  isExporting.value = true
  
  try {
    // Dynamic import to avoid SSR issues
    const jsPDF = (await import('jspdf')).default
    const autoTable = (await import('jspdf-autotable')).default
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    
    // Bühler Corporate Colors
    const buhlerGreen: [number, number, number] = [0, 155, 145]
    const darkGray: [number, number, number] = [30, 41, 59]
    const lightGray: [number, number, number] = [100, 116, 139]
    const backgroundColor: [number, number, number] = [248, 250, 252]
    
    const calc = calculations.value
    const input = inputs.value
    
    // Header with Bühler Branding
    doc.setFillColor(...buhlerGreen)
    doc.rect(0, 0, 210, 25, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('Bühler BRAM Calculator', 20, 17)
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('ROI Analysis Report', 20, 22)
    
    // Report Information
    let yPos = 40
    doc.setTextColor(...darkGray)
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, 20, yPos)
    
    // Executive Summary Box
    yPos += 15
    doc.setFillColor(...backgroundColor)
    doc.rect(20, yPos - 5, 170, 25, 'F')
    doc.setDrawColor(...buhlerGreen)
    doc.setLineWidth(1)
    doc.rect(20, yPos - 5, 170, 25, 'S')
    
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...darkGray)
    doc.text('Executive Summary', 25, yPos + 3)
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(`Estimated Annual Reduction of Downtime Costs: ${formatCurrency(calc.potentialSavings)}`, 25, yPos + 10)
    doc.text(`ROI: ${formatPercentage(calc.roi)} | Payback Period: ${formatMonths(calc.paybackMonths)}`, 25, yPos + 16)
    
    // Input Parameters Table
    yPos += 35
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...buhlerGreen)
    doc.text('Input Parameters', 20, yPos)
    
    yPos += 5
    autoTable(doc, {
      startY: yPos,
      head: [['Parameter', 'Value', 'Unit']],
      body: [
        [machinesLabel.value, (input.machinesInOperation || 0).toString(), 'units'],
        ['Production Days per Year', (input.productionDaysPerYear || 0).toString(), 'days'],
        ['Production Hours per Day', (input.productionHoursPerDay || 0).toString(), 'hours'],
        [dailyOutputLabel.value, weightUnit.value === 'kg' ? formatNumber(input.dailyOutputKg || 0) : weightUnit.value === 'lb' ? formatNumber(kgToLb(input.dailyOutputKg || 0)) : formatNumber(input.dailyOutputKg || 0), weightUnitLabel.value],
        ['Planned Maintenance Events per Machine/Year', (input.plannedMaintenanceEvents || 0).toString(), 'events'],
        ['Unplanned Maintenance Events per Machine/Year', (input.unplannedMaintenanceEvents || 0).toString(), 'events'],
        ['Planned Downtime Duration per Event', (input.plannedDowntimeDurationPerEvent || 0).toString(), 'hours'],
        ['Unplanned Downtime Duration per Event', (input.unplannedDowntimeDurationPerEvent || 0).toString(), 'hours'],
        ['Estimated Downtime Reduction per Event', (input.estimatedDowntimeReductionPerEvent || 0).toString(), 'hours'],
        [`Sales Price per ${weightUnitLabel.value}`, `$${(input.salesPricePerKg || 0).toFixed(2)}`, `per ${weightUnitLabel.value}`],
        ['Margin', `${(input.marginPercent || 0).toFixed(1)}%`, 'percent'],
        ['Service Contract Cost', formatCurrency(input.serviceContractCost || 0), 'per year']
      ],
      theme: 'grid',
      headStyles: {
        fillColor: buhlerGreen,
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 10,
        textColor: darkGray
      },
      alternateRowStyles: {
        fillColor: backgroundColor
      },
      margin: { left: 20, right: 20 }
    })
    

    
    // BRAM Benefits - keep on page 1
    yPos = ((doc as unknown) as {lastAutoTable?: {finalY: number}}).lastAutoTable?.finalY ? ((doc as unknown) as {lastAutoTable?: {finalY: number}}).lastAutoTable!.finalY + 15 : yPos + 15
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...buhlerGreen)
    doc.text('Impact of BRAM Service Solution', 20, yPos)
    
    yPos += 5
    autoTable(doc, {
      startY: yPos,
      head: [['Benefit', 'Annual Value']],
      body: [
        ['Downtime Reduction', formatNumber(calc.additionalUptimeHours) + ' hours'],
        ['Reduction of Production Loss', formatNumber(calc.additionalOutput) + ' ' + weightUnitLabel.value],
        ['Reduction of Downtime Costs', formatCurrency(calc.potentialSavings)]
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [34, 197, 94] as [number, number, number], // Green for positive impact
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 10,
        textColor: darkGray
      },
      alternateRowStyles: {
        fillColor: backgroundColor
      },
      margin: { left: 20, right: 20 }
    })
    
    // Start page 2 with Downtime Impact Analysis, Financial Analysis and Chart
    doc.addPage()
    yPos = 30
    
    // Downtime Impact Analysis - now on page 2
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...buhlerGreen)
    doc.text('Downtime Impact Analysis', 20, yPos)
    
    // Planned vs Unplanned Downtime
    yPos += 8
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...darkGray)
    doc.text('Planned vs Unplanned Downtime', 20, yPos)
    
    yPos += 3
    autoTable(doc, {
      startY: yPos,
      head: [['Downtime Type', 'Annual Hours', 'Production Loss', 'Financial Loss']],
      body: [
        [
          'Planned Downtime', 
          formatNumber(calc.annualPlannedDowntimeHours) + ' hours',
          formatNumber(calc.annualPlannedProductionLoss) + ' ' + weightUnitLabel.value,
          formatCurrency(calc.annualPlannedRevenueLoss)
        ],
        [
          'Unplanned Downtime', 
          formatNumber(calc.annualUnplannedDowntimeHours) + ' hours',
          formatNumber(calc.annualUnplannedProductionLoss) + ' ' + weightUnitLabel.value,
          formatCurrency(calc.annualUnplannedRevenueLoss)
        ]
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [251, 146, 60] as [number, number, number], // Orange for downtime analysis
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 10,
        textColor: darkGray
      },
      alternateRowStyles: {
        fillColor: backgroundColor
      },
      margin: { left: 20, right: 20 }
    })
    
    // Total Combined Impact
    yPos = ((doc as unknown) as {lastAutoTable?: {finalY: number}}).lastAutoTable?.finalY ? ((doc as unknown) as {lastAutoTable?: {finalY: number}}).lastAutoTable!.finalY + 8 : yPos + 8
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...darkGray)
    doc.text('Total Combined Impact', 20, yPos)
    
    yPos += 3
    autoTable(doc, {
      startY: yPos,
      head: [['Total Impact Metric', 'Annual Value']],
      body: [
        ['Total Downtime Hours', formatNumber(calc.annualDowntimeHours) + ' hours'],
        ['Total Production Loss', formatNumber(calc.annualProductionLoss) + ' ' + weightUnitLabel.value],
        ['Total Financial Loss', formatCurrency(calc.annualRevenueLoss)]
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [239, 68, 68] as [number, number, number], // Red for total negative impact
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 10,
        textColor: darkGray
      },
      alternateRowStyles: {
        fillColor: backgroundColor
      },
      margin: { left: 20, right: 20 }
    })
    
    // Financial Analysis - now on page 2
    yPos = ((doc as unknown) as {lastAutoTable?: {finalY: number}}).lastAutoTable?.finalY ? ((doc as unknown) as {lastAutoTable?: {finalY: number}}).lastAutoTable!.finalY + 12 : yPos + 12
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...buhlerGreen)
    doc.text('Financial Analysis', 20, yPos)
    
    yPos += 3
    autoTable(doc, {
      startY: yPos,
      head: [['Financial Metric', 'Value']],
      body: [
        ['Estimated Reduction of Downtime Costs', formatCurrency(calc.potentialSavings)],
        ['Annual Service Contract Cost', formatCurrency(input.serviceContractCost || 0)],
        ['Net Annual Benefit', formatCurrency(calc.netSavings)],
        ['Return on Investment (ROI)', formatPercentage(calc.roi)],
        ['Payback Period', formatMonths(calc.paybackMonths)]
      ],
      theme: 'grid',
      headStyles: {
        fillColor: buhlerGreen as [number, number, number],
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 10,
        textColor: darkGray
      },
      alternateRowStyles: {
        fillColor: backgroundColor
      },
      margin: { left: 20, right: 20 },
      didParseCell: function (data) {
        // Highlight the net benefit row
        if (data.row.index === 2) {
          if (calc.netSavings > 0) {
            data.cell.styles.textColor = [34, 197, 94] // Green for positive
            data.cell.styles.fontStyle = 'bold'
          } else {
            data.cell.styles.textColor = [239, 68, 68] // Red for negative
            data.cell.styles.fontStyle = 'bold'
          }
        }
      }
    })
    
    // Start page 3 with ROI Chart
    doc.addPage()
    yPos = 30
    
    // Chart title on page 3
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...buhlerGreen)
    doc.text('ROI Projection Over Time', 20, yPos)
    
    // Debug logging
    console.log('PDF Export - Chart Debug:', {
      chartInstance: !!chartInstance,
      chartRef: !!chartRef.value,
      chartRefElement: chartRef.value?.tagName
    })
    
    // Export chart as image - with PDF-optimized dimensions
    if (chartInstance && chartRef.value) {
      try {
        // Temporarily resize chart for PDF export with better A4 proportions
        const pdfChartWidth = 800  // Wider for PDF export
        const pdfChartHeight = 500 // Better height for A4 format
        
        // Store original chart size (fallback to current bounding size if inline style missing)
        const rect = chartRef.value.getBoundingClientRect()
        const originalWidth = chartRef.value.style.width || `${rect.width}px`
        const originalHeight = chartRef.value.style.height || `${rect.height}px`
        
        // Temporarily resize the chart container for PDF export
        chartRef.value.style.width = `${pdfChartWidth}px`
        chartRef.value.style.height = `${pdfChartHeight}px`
        
        // Resize the chart instance to match
        chartInstance.resize({ width: pdfChartWidth, height: pdfChartHeight })
        
        // Wait for the resize to complete
        await new Promise(resolve => setTimeout(resolve, 150))
        
        // Export the resized chart
        const chartDataURL = chartInstance.getDataURL({
          type: 'png',
          pixelRatio: 2,
          backgroundColor: '#ffffff'
        })
        
        // Restore original chart size immediately
        chartRef.value.style.width = originalWidth
        chartRef.value.style.height = originalHeight
        chartInstance.resize()
        
        // PDF chart dimensions - properly proportioned for A4
        const chartWidth = 170  // Full width minus margins
        const chartHeight = 106 // Perfect 16:10 ratio for A4
        
        // Add chart to page 3
        doc.addImage(chartDataURL, 'PNG', 20, yPos + 10, chartWidth, chartHeight)
        
        // Add chart description
        yPos += chartHeight + 15
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(...lightGray)
        doc.text('This chart shows the cumulative net savings over a 5-year period, accounting for annual service fees.', 20, yPos)
        doc.text('Red vertical lines indicate annual service contract payments.', 20, yPos + 5)
        
      } catch (chartError) {
        console.warn('Could not export chart:', chartError)
        // Restore chart size in case of error
        if (chartRef.value && chartInstance) {
          const rect2 = chartRef.value.getBoundingClientRect()
          chartRef.value.style.width = `${rect2.width}px`
          chartRef.value.style.height = `${rect2.height}px`
          chartInstance.resize()
        }
        // Add placeholder text if chart export fails
        doc.setFontSize(12)
        doc.setFont('helvetica', 'italic')
        doc.setTextColor(...lightGray)
        doc.text('Chart export failed. The ROI projection shows cumulative savings over 5 years.', 20, yPos + 10)
      }
    } else {
      console.warn('Chart instance not available for PDF export')
      // Add placeholder text if chart is not available
      doc.setFontSize(12)
      doc.setFont('helvetica', 'italic')
      doc.setTextColor(...lightGray)
      doc.text('Chart not available. The ROI projection shows cumulative savings over 5 years.', 20, yPos + 10)
    }
    
    // Footer
    const pageCount = ((doc as unknown) as {internal: {getNumberOfPages: () => number}}).internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      
      // Footer background
      doc.setFillColor(...buhlerGreen)
      doc.rect(0, 285, 210, 12, 'F')
      
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text('Bühler BRAM Calculator - Confidential Business Analysis', 20, 292)
      doc.text(`Page ${i} of ${pageCount}`, 170, 292)
    }
    
    // Save PDF
    const filename = `Buhler-BRAM-Analysis-${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(filename)
    
  } catch (error) {
    console.error('PDF Export failed:', error)
    alert('PDF Export failed. Please try again.')
  } finally {
    isExporting.value = false
  }
}
</script>

<style scoped>
.roi-calculator {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background: transparent;
  min-height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Header Styles */
.calculator-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.header-main-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
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

.header-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.header-title i {
  color: var(--buhler-primary);
}

.title-text {
  display: flex;
  flex-direction: column;
  gap: 0;
  line-height: 1;
}

.title-brand {
  font-weight: 700;
  color: var(--buhler-primary);
}

.title-product {
  font-weight: 600;
  color: #1e293b;
}

.header-subtitle {
  font-size: 1.125rem;
  color: #64748b;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.pdf-export-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid var(--buhler-primary);
  color: var(--buhler-primary);
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pdf-export-btn:hover:not(:disabled) {
  background: var(--buhler-primary);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 155, 145, 0.2);
}

.pdf-export-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.pdf-export-btn i {
  font-size: 1rem;
}

/* Step Progress Styles */
.step-progress {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.steps-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.steps-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #334155;
  margin: 0;
}

.steps-title i {
  color: var(--buhler-primary);
  font-size: 1rem;
}

.steps-counter {
  background: rgba(0, 155, 145, 0.1);
  color: var(--buhler-primary);
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.progress-container {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  position: relative;
}

.progress-step.clickable:hover .step-circle {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 155, 145, 0.3);
}

.progress-step:not(.clickable) {
  cursor: not-allowed;
  opacity: 0.6;
}

.step-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  transition: all 0.3s ease;
  border: 3px solid #e2e8f0;
  background: white;
  color: #64748b;
}

.progress-step.active .step-circle {
  background: var(--buhler-primary);
  color: white;
  border-color: var(--buhler-primary);
  box-shadow: 0 4px 12px rgba(0, 155, 145, 0.3);
}

.progress-step.completed .step-circle {
  background: #22c55e;
  color: white;
  border-color: #22c55e;
}

.step-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.25rem;
  max-width: 180px;
}

.step-label {
  font-weight: 600;
  color: #1e293b;
  font-size: 1rem;
}

.step-description {
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.3;
}

.progress-step.active .step-label {
  color: var(--buhler-primary);
}

.progress-step.completed .step-label {
  color: #22c55e;
}

/* Step Content Styles */
.step-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* ROI Header Card */
.roi-header-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Sales Header Card */
.sales-header-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 1rem;
}

.step-content.step-1,
.step-content.step-3 {
  background: transparent;
  box-shadow: none;
  padding: 0;
}

/* removed .downtime-impact-wrapper (duplicate outside component) */

.step-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Step 3 Results - einheitliches Spacing wie überall */
.step-3-results {
  gap: 1rem;
}

.step-header {
  text-align: center;
  padding-bottom: 1.5rem;
  border-bottom: none;
}

.step-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.step-title i {
  color: var(--buhler-primary);
}

.step-title-text {
  display: block;
}

.step-subtitle {
  font-size: 1.125rem;
  color: #64748b;
  margin: 0;
}

/* Sales Grid Specific */
.sales-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.customer-preview {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1.5rem;
}

.preview-grid {
  display: grid;
  gap: 1rem;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.preview-item:last-child {
  border-bottom: none;
}

.preview-label {
  font-weight: 500;
  color: #64748b;
  font-size: 0.875rem;
}

.preview-value {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
}

/* Step Navigation Styles */
.step-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.nav-spacer {
  flex: 1;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-btn-primary {
  background: var(--buhler-primary);
  color: white;
}

.nav-btn-primary:hover:not(:disabled) {
  background: var(--buhler-primary-700);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 155, 145, 0.2);
}

.nav-btn-secondary {
  background: white;
  color: #64748b;
  border: 2px solid #e2e8f0;
}

.nav-btn-secondary:hover {
  border-color: #cbd5e1;
  color: #475569;
  transform: translateY(-1px);
}

.calculate-btn-final {
  background: #22c55e;
  font-size: 1rem;
  padding: 0.875rem 2rem;
}

.calculate-btn-final:hover:not(:disabled) {
  background: #16a34a;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.3);
}

/* Input Section Styles */
.calculator-inputs {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Toggle Button Styles */
.input-label-with-toggle {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.terminology-toggle {
  flex-shrink: 0;
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

.toggle-btn i {
  font-size: 0.75rem;
}



.input-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 3rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
}

.section-title i {
  color: var(--buhler-primary);
  font-size: 1.125rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.input-label {
  display: flex;
  flex-direction: column;
  font-weight: 600;
  color: #334155;
  font-size: 0.875rem;
  gap: 0.25rem;
}

.input-hint {
  font-weight: 400;
  color: #64748b;
  font-size: 0.75rem;
}

/* Prevent accidental list styling for labels and hints */
.input-label,
.input-hint {
  list-style: none;
  padding-left: 0;
}

.input-label::marker,
.input-hint::marker {
  content: none;
}

.input-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s ease;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.input-wrapper:hover {
  border-color: #cbd5e1;
}

.input-wrapper:focus-within {
  border-color: var(--buhler-primary);
  box-shadow: 0 0 0 3px rgba(0, 155, 145, 0.1);
}

.input-wrapper.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.validation-hint {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #ef4444;
}

.input-field {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  font-size: 1rem;
  font-weight: 500;
  color: #1e293b;
  outline: none;
}

.input-field::-webkit-inner-spin-button,
.input-field::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input-unit {
  padding: 0 1rem;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

.currency-symbol {
  padding: 0 0 0 1rem;
  color: #64748b;
  font-size: 1rem;
  font-weight: 500;
}

.input-wrapper.currency .input-field {
  padding-left: 0.5rem;
}

/* Calculate Section */
.calculate-section {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.calculate-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: var(--buhler-primary);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 155, 145, 0.3);
}

.calculate-btn:hover {
  background: var(--buhler-primary-700);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 155, 145, 0.4);
}

.calculate-btn:active {
  transform: translateY(0);
}

.calculate-btn i {
  font-size: 1.25rem;
}

/* Results Section */
.calculator-results {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.metrics-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-header {
  font-size: 1.5rem;
  font-weight: 700;
  color: #000000;
  margin: 0;
  padding: 0 0 0.75rem 0;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.metric-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  font-size: 1.5rem;
}

.metric-card.primary .metric-icon {
  background: rgba(0, 155, 145, 0.1);
  color: var(--buhler-primary);
}

.metric-card.success .metric-icon {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.metric-card.warning .metric-icon {
  background: rgba(251, 146, 60, 0.1);
  color: #fb923c;
}

.metric-card.info .metric-icon {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.metric-card.positive .metric-icon {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.metric-card.negative .metric-icon {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.metric-card.positive .metric-value {
  color: #22c55e;
}

.metric-card.negative .metric-value {
  color: #ef4444;
}

.metric-card.danger .metric-icon {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.metric-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.metric-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.metric-sublabel {
  font-size: 0.75rem;
  color: #94a3b8;
}

.metric-sublabel-top {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

/* Total Summary Styles */
.total-summary {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e2e8f0;
}

.summary-subtitle {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
  text-align: center;
}

.metric-card.total-card {
  border: 2px solid var(--buhler-primary);
  background: rgba(0, 155, 145, 0.02);
}

.metric-card.total-card .metric-icon {
  background: rgba(0, 155, 145, 0.1);
  color: var(--buhler-primary);
}

.metric-card.total-card .metric-value {
  color: var(--buhler-primary);
  font-weight: 700;
}

/* Financial Summary */
.financial-summary {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.summary-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1.5rem 0;
}

.summary-title i {
  color: var(--buhler-primary);
}

.summary-section {
  margin-bottom: 1.5rem;
}

.summary-section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
}

.summary-item.total {
  padding-top: 1.5rem;
  border-top: 2px solid #e2e8f0;
  margin-top: 0.5rem;
}

.summary-label {
  font-weight: 500;
  color: #64748b;
}

.summary-item.total .summary-label {
  font-weight: 600;
  color: #1e293b;
  font-size: 1.125rem;
}

.summary-value {
  font-weight: 600;
  font-size: 1.125rem;
  color: #1e293b;
}

.summary-value.positive {
  color: #22c55e;
}

.summary-value.negative {
  color: #ef4444;
}

.summary-item.total .summary-value {
  font-size: 1.5rem;
  font-weight: 700;
}

/* Chart Container */
.chart-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.chart-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1.5rem 0;
}

.roi-chart {
  width: 100%;
  height: 400px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .sales-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .step-info {
    max-width: 140px;
  }
  
  .step-label {
    font-size: 0.875rem;
  }
  
  .step-description {
    font-size: 0.7rem;
  }
  
  .input-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .roi-calculator {
    padding: 1rem;
    gap: 1rem;
  }

  .calculator-header {
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    text-align: center;
  }
  
  .sales-header-card {
    padding: 1.5rem;
    margin-bottom: 1rem;
  }

  .header-actions {
    flex-direction: column;
    align-self: stretch;
  }
  
  .input-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    width: 100%;
    max-width: 100%;
  }
  
  .header-title {
    font-size: 1.75rem;
    line-height: 1.2;
    flex-direction: column;
    gap: 0.5rem;
    justify-content: center;
  }
  
  .title-text {
    align-items: center;
  }
  
  .title-brand {
    font-size: 1.75rem;
    line-height: 1;
  }
  
  .title-product {
    font-size: 1.5rem;
    line-height: 1;
    margin-top: -0.125rem;
  }
  
  .header-subtitle {
    font-size: 1rem;
    line-height: 1.4;
    max-width: 90%;
    margin: 0.75rem auto 0;
  }

  .step-progress {
    padding: 1rem;
  }
  
  .steps-header {
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
  }
  
  .steps-title {
    font-size: 1rem;
  }
  
  .steps-counter {
    padding: 0.25rem 0.5rem;
    font-size: 0.7rem;
  }
  
  .progress-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    position: relative;
  }
  
  /* No connection lines on mobile for cleaner look */
  
  .progress-step {
    flex: 1;
    max-width: 120px;
    z-index: 2;
  }
  
  .step-circle {
    width: 56px;
    height: 56px;
    font-size: 1.125rem;
    border-width: 3px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .step-info {
    max-width: 120px;
    margin-top: 0.5rem;
  }
  
  .step-label {
    font-size: 0.8rem;
    font-weight: 700;
  }
  
  .step-description {
    font-size: 0.65rem;
    line-height: 1.2;
  }

  .step-content {
    padding: 1.5rem;
  }
  
  .step-header {
    text-align: left;
    padding-bottom: 1rem;
  }
  
  .step-title {
    justify-content: flex-start;
    font-size: 1.5rem;
    flex-direction: row;
    gap: 0.75rem;
    align-items: center;
  }
  
  .step-title-text {
    line-height: 1.2;
  }
  
  .step-subtitle {
    font-size: 1rem;
    line-height: 1.3;
    text-align: left;
  }

  .input-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .sales-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .results-grid {
    grid-template-columns: 1fr;
  }
  
  .step-navigation {
    padding: 1rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .nav-spacer {
    display: none;
  }
  
  .nav-btn {
    flex: 1;
    justify-content: center;
    min-width: 120px;
  }

  .roi-chart {
    height: 300px;
  }
}

/* Ultra-small devices (320px - 480px) */
@media (max-width: 480px) {
  .roi-calculator {
    padding: 0.5rem;
    gap: 0.75rem;
  }
  
  .calculator-header,
  .step-progress,
  .step-content,
  .step-navigation,
  .sales-header-card {
    padding: 0.75rem;
    border-radius: 8px;
  }
  
  .calculator-header {
    text-align: center;
    gap: 0.75rem;
  }
  
  .header-title {
    font-size: 1.25rem;
    line-height: 1.1;
    flex-direction: column;
    gap: 0.125rem;
    text-align: center;
    justify-content: center;
  }
  
  .title-brand {
    font-size: 1.25rem;
    line-height: 0.95;
  }
  
  .title-product {
    font-size: 1.125rem;
    line-height: 0.95;
    margin-top: -0.05rem;
  }
  
  .header-subtitle {
    font-size: 0.75rem;
    line-height: 1.2;
    max-width: 100%;
    margin: 0.375rem auto 0;
    padding: 0 0.125rem;
    text-align: center;
  }
  
  .step-header {
    text-align: left;
    padding-bottom: 0.75rem;
  }
  
  .step-title {
    font-size: 1.25rem;
    flex-direction: row;
    gap: 0.5rem;
    justify-content: flex-start;
    align-items: center;
  }
  
  .step-title-text {
    line-height: 1.1;
  }
  
  .step-subtitle {
    font-size: 0.85rem;
    line-height: 1.25;
    text-align: left;
    margin: 0;
  }
  
  .step-progress {
    padding: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .steps-header {
    margin-bottom: 0.5rem;
    padding-bottom: 0.375rem;
    flex-direction: column;
    gap: 0.375rem;
    text-align: center;
  }
  
  .steps-title {
    font-size: 0.85rem;
    justify-content: center;
  }
  
  .steps-counter {
    padding: 0.125rem 0.375rem;
    font-size: 0.6rem;
    align-self: center;
  }
  
  .progress-container {
    gap: 0.125rem;
    padding: 0.5rem 0;
    justify-content: space-between;
    align-items: center;
  }
  
  .progress-step {
    flex: 1;
    max-width: 80px;
    padding: 0.125rem;
    border-radius: 6px;
    transition: all 0.2s ease;
    /* Touch feedback */
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  
  /* Enhanced active step highlighting for mobile */
  .progress-step.active {
    background: rgba(0, 155, 145, 0.1);
    border: 1px solid rgba(0, 155, 145, 0.4);
    box-shadow: 0 1px 4px rgba(0, 155, 145, 0.2);
  }
  
  /* Touch feedback for clickable steps */
  .progress-step.clickable:active {
    transform: scale(0.95);
    transition: transform 0.1s ease;
  }
  
  .step-circle {
    width: 36px;
    height: 36px;
    font-size: 0.8rem;
    border-width: 2px;
    /* Adequate touch target */
    min-height: 36px;
    min-width: 36px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .step-info {
    max-width: 80px;
    margin-top: 0.375rem;
    gap: 0.125rem;
  }
  
  .step-label {
    font-size: 0.65rem;
    font-weight: 700;
    line-height: 1;
  }
  
  .step-description {
    font-size: 0.5rem;
    line-height: 1.1;
    opacity: 0.8;
  }
  
  .input-section {
    gap: 0.75rem;
  }
  
  .section-title {
    font-size: 1rem;
    flex-wrap: wrap;
    gap: 0.375rem;
  }
  
  .input-group {
    gap: 0.375rem;
  }
  
  .input-label {
    font-size: 0.8rem;
    gap: 0.125rem;
  }
  
  .input-hint {
    font-size: 0.65rem;
    line-height: 1.2;
  }
  
  .input-label-with-toggle {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .toggle-btn {
    align-self: flex-start;
    font-size: 0.65rem;
    padding: 0.375rem 0.5rem;
    min-height: 40px; /* Better touch target */
    border-radius: 4px;
  }
  
  .input-wrapper {
    min-height: 38px; /* Smaller for mobile */
    flex-wrap: nowrap;
    border-radius: 6px;
  }
  
  .input-field {
    padding: 0.3rem 0.5rem; /* Normales Padding für 480px */
    font-size: 0.8rem;
    min-width: 0; /* Prevent overflow */
    flex-shrink: 1;
  }
  
  .input-unit,
  .currency-symbol {
    padding: 0 0.375rem; /* Normales Padding für Units */
    font-size: 0.75rem;
    flex-shrink: 0;
    white-space: nowrap;
  }
  
  .validation-hint {
    font-size: 0.65rem;
    line-height: 1.2;
    margin-top: 0.25rem;
  }
  
  .preview-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .nav-btn {
    padding: 0.75rem 1.25rem;
    font-size: 0.85rem;
    min-height: 48px; /* Better touch target */
    border-radius: 12px;
  }
  
  .metric-card {
    padding: 1rem;
  }
  
  .metric-icon {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
  }
  
  .metric-value {
    font-size: 1.5rem;
  }
}

/* Extra small devices (less than 360px) */
@media (max-width: 360px) {
  .roi-calculator {
    padding: 0.375rem;
    gap: 0.5rem;
  }
  
  .calculator-header,
  .step-progress,
  .step-content,
  .step-navigation {
    padding: 0.5rem;
  }
  
  .calculator-inputs {
    padding: 1rem; /* Reduziertes Container-Padding für 360px */
  }
  
  .header-title {
    font-size: 1.125rem;
  }
  
  .title-brand {
    font-size: 1.125rem;
  }
  
  .title-product {
    font-size: 1rem;
  }
  
  .header-subtitle {
    font-size: 0.7rem;
  }
  
  .input-grid {
    gap: 1rem;
  }
  
  .input-section {
    gap: 0.5rem;
  }
  
  .section-title {
    font-size: 0.9rem;
    padding-bottom: 0.5rem;
  }
  
  .input-group {
    gap: 0.25rem;
  }
  
  .input-label {
    font-size: 0.75rem;
  }
  
  .input-hint {
    font-size: 0.6rem;
  }
  
  .input-wrapper {
    min-height: 42px;
    border-radius: 6px;
  }
  
  .input-field {
    padding: 0.5rem 0.625rem; /* Normales Padding für 360px */
    font-size: 0.85rem;
  }
  
  .input-unit,
  .currency-symbol {
    padding: 0 0.375rem; /* Normales Padding für Units */
    font-size: 0.75rem;
  }
  
  .toggle-btn {
    font-size: 0.6rem;
    padding: 0.25rem 0.375rem;
    min-height: 36px;
  }
  
  .step-circle {
    width: 32px;
    height: 32px;
    font-size: 0.75rem;
    min-height: 32px;
    min-width: 32px;
  }
  
  .step-info {
    max-width: 70px;
    margin-top: 0.25rem;
  }
  
  .step-label {
    font-size: 0.6rem;
  }
  
  .step-description {
    font-size: 0.45rem;
  }
  
  .steps-title {
    font-size: 0.8rem;
  }
  
  .steps-counter {
    font-size: 0.55rem;
    padding: 0.1rem 0.25rem;
  }
  
  .nav-btn {
    padding: 0.625rem 1rem;
    font-size: 0.8rem;
    min-height: 44px;
  }
  
  .metric-card {
    padding: 0.75rem;
    gap: 1rem;
  }
  
  .metric-icon {
    width: 40px;
    height: 40px;
    font-size: 1.125rem;
  }
  
  .metric-value {
    font-size: 1.25rem;
  }
  
  .metric-label {
    font-size: 0.8rem;
  }
  
  .metric-sublabel,
  .metric-sublabel-top {
    font-size: 0.65rem;
  }
}

/* Ultra-tiny devices (less than 300px) */
@media (max-width: 300px) {
  .roi-calculator {
    padding: 0.25rem;
    gap: 0.375rem;
  }
  
  .calculator-header,
  .step-progress,
  .step-content,
  .step-navigation {
    padding: 0.375rem;
    border-radius: 6px;
  }
  
  .calculator-inputs {
    padding: 0.75rem; /* Reduziertes Container-Padding */
  }
  
  .header-title {
    font-size: 1rem;
  }
  
  .title-brand {
    font-size: 1rem;
  }
  
  .title-product {
    font-size: 0.9rem;
  }
  
  .header-subtitle {
    font-size: 0.65rem;
  }
  
  .input-grid {
    gap: 0.75rem;
  }
  
  .input-section {
    gap: 0.375rem;
  }
  
  .section-title {
    font-size: 0.8rem;
    padding-bottom: 0.375rem;
  }
  
  .input-group {
    gap: 0.25rem;
  }
  
  .input-label {
    font-size: 0.7rem;
  }
  
  .input-hint {
    font-size: 0.55rem;
  }
  
  .input-wrapper {
    min-height: 36px; /* Very compact for tiny screens */
    border-radius: 4px;
    border-width: 1px;
  }
  
  .input-field {
    padding: 0.25rem 0.25rem; /* Stark reduziertes Padding für 300px */
    font-size: 0.75rem;
  }
  
  .input-unit,
  .currency-symbol {
    padding: 0 0.125rem; /* Minimales Padding für Units bei 300px */
    font-size: 0.7rem;
  }
  
  .toggle-btn {
    font-size: 0.55rem;
    padding: 0.25rem 0.375rem;
    min-height: 32px;
  }
  
  .step-circle {
    width: 28px;
    height: 28px;
    font-size: 0.7rem;
    min-height: 28px;
    min-width: 28px;
    border-width: 1px;
  }
  
  .step-info {
    max-width: 60px;
    margin-top: 0.25rem;
  }
  
  .step-label {
    font-size: 0.55rem;
  }
  
  .step-description {
    font-size: 0.4rem;
  }
  
  .steps-title {
    font-size: 0.75rem;
  }
  
  .steps-counter {
    font-size: 0.5rem;
    padding: 0.1rem 0.2rem;
  }
  
  .nav-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    min-height: 40px;
    border-radius: 6px;
  }
  
  .metric-card {
    padding: 0.5rem;
    gap: 0.75rem;
    flex-direction: column;
    text-align: center;
  }
  
  .metric-icon {
    width: 32px;
    height: 32px;
    font-size: 1rem;
    align-self: center;
  }
  
  .metric-value {
    font-size: 1.125rem;
  }
  
  .metric-label {
    font-size: 0.75rem;
  }
  
  .metric-sublabel,
  .metric-sublabel-top {
    font-size: 0.6rem;
  }
  
  .validation-hint {
    font-size: 0.6rem;
    margin-top: 0.125rem;
  }
}

/* PDF Export Styles */
.roi-calculator.pdf-export {
  background: white !important;
  padding: 1rem !important;
  max-width: none !important;
  gap: 1.5rem !important;
}

.roi-calculator.pdf-export * {
  box-shadow: none !important;
}

.roi-calculator.pdf-export .calculator-header {
  background: white !important;
  padding: 1.5rem !important;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.roi-calculator.pdf-export .header-actions {
  display: none !important; /* Hide export button in PDF */
}

.roi-calculator.pdf-export .calculator-inputs {
  background: white !important;
  padding: 1.5rem !important;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.roi-calculator.pdf-export .input-grid {
  display: flex !important;
  flex-direction: column !important;
  gap: 1.5rem !important;
}

.roi-calculator.pdf-export .input-section {
  margin-bottom: 0 !important;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.roi-calculator.pdf-export .metrics-section {
  background: white !important;
  padding: 1.5rem !important;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.roi-calculator.pdf-export .results-grid {
  display: flex !important;
  flex-direction: column !important;
  gap: 1rem !important;
}

.roi-calculator.pdf-export .metric-card {
  margin-bottom: 0 !important;
  padding: 1rem !important;
  border: 1px solid #f1f5f9 !important;
  border-radius: 6px !important;
  break-inside: avoid;
}

.roi-calculator.pdf-export .chart-container {
  background: white !important;
  padding: 1.5rem !important;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-top: 1rem;
}

.roi-calculator.pdf-export .financial-summary {
  background: white !important;
  padding: 1.5rem !important;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.roi-calculator.pdf-export .roi-chart {
  height: 250px !important;
}

/* Simplified print styles */
@media print {
  body {
    background: white !important;
  }
  
  .roi-calculator {
    background: white !important;
    box-shadow: none !important;
    padding: 0 !important;
  }
  
  .header-actions {
    display: none !important;
  }
  
  .calculator-header,
  .calculator-inputs,
  .metrics-section,
  .chart-container,
  .financial-summary {
    background: white !important;
    box-shadow: none !important;
    border: 1px solid #ddd !important;
    margin-bottom: 1rem !important;
  }
  
  .input-grid,
  .results-grid {
    display: block !important;
  }
  
  .metric-card {
    margin-bottom: 0.5rem !important;
    border: 1px solid #eee !important;
    break-inside: avoid;
  }
}
</style>