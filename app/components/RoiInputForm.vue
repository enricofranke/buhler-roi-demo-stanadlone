<template>
  <div class="input-form">
    <div class="input-grid">
      <!-- Production Parameters -->
      <div class="input-section">
        <h4 class="section-title">
          <i class="pi pi-cog" aria-hidden="true"></i>
          Production Parameters
        </h4>
        
        <div class="input-group">
          <div class="input-label-with-toggle">
            <label for="machines-in-operation" class="input-label">
              {{ machinesLabel }}
              <span class="input-hint">{{ machinesHint }}</span>
            </label>
            <div class="terminology-toggle">
              <button 
                type="button"
                @click="toggleMachinesTerminology"
                class="toggle-btn"
                :class="{ active: machinesTerminology === 'operation' }"
              >
                <i class="pi pi-sync" aria-hidden="true"></i>
                {{ machinesTerminology === 'operation' ? 'Switch to Scope' : 'Switch to Operation' }}
              </button>
            </div>
          </div>
          <div class="input-wrapper">
            <input 
              id="machines-in-operation"
              :value="inputs.machinesInOperation"
              @input="onNumberInput('machinesInOperation', $event)"
              type="number" 
              class="input-field"
              min="1"
              max="100"
              step="1"
              inputmode="numeric"
            />
            <span class="input-unit">units</span>
          </div>
        </div>

        <div class="input-group">
          <label for="production-days" class="input-label">
            Production Days per Year
            <span class="input-hint">Number of production days annually</span>
          </label>
          <div class="input-wrapper">
            <input 
              id="production-days"
              :value="inputs.productionDaysPerYear"
              @input="onNumberInput('productionDaysPerYear', $event)"
              type="number" 
              class="input-field"
              min="1"
              max="365"
              step="1"
              inputmode="numeric"
            />
            <span class="input-unit">days</span>
          </div>
        </div>

        <div class="input-group">
          <label for="production-hours" class="input-label">
            Production Hours per Day
            <span class="input-hint">Average daily operating hours</span>
          </label>
          <div class="input-wrapper">
            <input 
              id="production-hours"
              :value="inputs.productionHoursPerDay"
              @input="onNumberInput('productionHoursPerDay', $event)"
              type="number" 
              class="input-field"
              min="1"
              max="24"
              step="0.5"
              inputmode="decimal"
            />
            <span class="input-unit">hours</span>
          </div>
        </div>

        <WeightInput
          :model-value="inputs.dailyOutputKg"
          :label="dailyOutputLabel"
          :hint="dailyOutputHint + ' (e.g. 1000kg or 2200lb)'"
          input-id="daily-output"
          :unit="weightUnit"
          @update:model-value="updateInput('dailyOutputKg', $event)"
          @update:unit="updateWeightUnit"
        />
      </div>

      <!-- Downtime Impact -->
      <div class="input-section">
        <h4 class="section-title">
          <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
          Current Downtime Parameters
        </h4>
        
        <div class="input-group">
          <label for="planned-events" class="input-label">
            Planned Maintenance Events per Machine/Year
            <span class="input-hint">Scheduled maintenance stops per machine annually</span>
          </label>
          <div class="input-wrapper">
            <input 
              id="planned-events"
              :value="inputs.plannedMaintenanceEvents"
              @input="onNumberInput('plannedMaintenanceEvents', $event)"
              type="number" 
              class="input-field"
              min="0"
              max="100"
              step="1"
              inputmode="numeric"
            />
            <span class="input-unit">events</span>
          </div>
        </div>

        <div class="input-group">
          <label for="planned-duration" class="input-label">
            Planned Downtime Duration per Event
            <span class="input-hint">Average hours per planned maintenance</span>
          </label>
          <div class="input-wrapper">
            <input 
              id="planned-duration"
              :value="inputs.plannedDowntimeDurationPerEvent"
              @input="onNumberInput('plannedDowntimeDurationPerEvent', $event)"
              type="number" 
              class="input-field"
              min="0.5"
              max="72"
              step="0.5"
              inputmode="decimal"
            />
            <span class="input-unit">hours</span>
          </div>
        </div>

        <div class="input-group">
          <label for="unplanned-events" class="input-label">
            Unplanned Maintenance Events per Machine/Year
            <span class="input-hint">Unexpected breakdowns per machine annually</span>
          </label>
          <div class="input-wrapper">
            <input 
              id="unplanned-events"
              :value="inputs.unplannedMaintenanceEvents"
              @input="onNumberInput('unplannedMaintenanceEvents', $event)"
              type="number" 
              class="input-field"
              min="0"
              max="365"
              step="1"
              inputmode="numeric"
            />
            <span class="input-unit">events</span>
          </div>
        </div>

        <div class="input-group">
          <label for="unplanned-duration" class="input-label">
            Unplanned Downtime Duration per Event
            <span class="input-hint">Average hours per unplanned breakdown</span>
          </label>
          <div class="input-wrapper">
            <input 
              id="unplanned-duration"
              :value="inputs.unplannedDowntimeDurationPerEvent"
              @input="onNumberInput('unplannedDowntimeDurationPerEvent', $event)"
              type="number" 
              class="input-field"
              min="0.5"
              max="48"
              step="0.5"
              inputmode="decimal"
            />
            <span class="input-unit">hours</span>
          </div>
        </div>

        <CurrencyWeightInput
          :model-value="inputs.salesPricePerKg"
          :label="`Sales Price per ${weightUnitLabel}`"
          :hint="`Selling price per ${weightUnitLabel} of product`"
          :unit="weightUnit"
          input-id="sales-price"
          @update:model-value="updateInput('salesPricePerKg', $event)"
        />

        <div class="input-group">
          <label for="margin-percent" class="input-label">
            Margin
            <span class="input-hint">Percentage of sales price</span>
          </label>
          <div class="input-wrapper">
            <input 
              id="margin-percent"
              :value="inputs.marginPercent"
              @input="onMarginInput($event)"
              type="number" 
              class="input-field"
              min="1"
              max="100"
              step="0.1"
              inputmode="decimal"
            />
            <span class="input-unit">%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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
}

// Props
const props = defineProps<{
  inputs: RoiInputs
  machinesTerminology: 'operation' | 'scope'
  weightUnit: 'kg' | 'lb' | ''
}>()

// Emits
const emit = defineEmits<{
  'update:inputs': [inputs: RoiInputs]
  'update:machinesTerminology': [terminology: 'operation' | 'scope']
  'update:weightUnit': [unit: 'kg' | 'lb' | '']
}>()

// Computed labels based on terminology toggle
const machinesLabel = computed(() => 
  props.machinesTerminology === 'operation' ? 'Machines in Operation' : 'Machines in Scope'
)

const machinesHint = computed(() => 
  props.machinesTerminology === 'operation' 
    ? 'Number of machines currently operating in your facility'
    : 'Number of machines within the project scope'
)

const dailyOutputLabel = computed(() => 
  props.machinesTerminology === 'operation' 
    ? 'Daily Output of machines in operation'
    : 'Daily Output of machines in scope'
)

const dailyOutputHint = computed(() => 
  props.machinesTerminology === 'operation' 
    ? 'Average production output per day from operating machines'
    : 'Average production output per day from machines in scope'
)

// Weight unit labels
const weightUnitLabel = computed(() => props.weightUnit || 'unit')

// Methods
const updateInput = (key: keyof RoiInputs, value: string | number | null) => {
  const newInputs = { ...props.inputs }
  if (typeof value === 'string') {
    newInputs[key] = value === '' ? null : Number(value)
  } else {
    newInputs[key] = value
  }
  emit('update:inputs', newInputs)
}

const onNumberInput = (key: keyof RoiInputs, event: Event) => {
  const target = event.target as HTMLInputElement | null
  const raw = target?.value ?? ''
  updateInput(key, raw === '' ? null : Number(raw))
}

// Clamp margin percent strictly to [1, 100]
const onMarginInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  if (!target) return
  const raw = target.value
  if (raw === '') {
    updateInput('marginPercent', null)
    return
  }
  let value = Number(raw)
  if (Number.isNaN(value)) return
  if (value < 1) value = 1
  if (value > 100) value = 100
  updateInput('marginPercent', value)
}

const toggleMachinesTerminology = () => {
  const newTerminology = props.machinesTerminology === 'operation' ? 'scope' : 'operation'
  emit('update:machinesTerminology', newTerminology)
}

const updateWeightUnit = (unit: 'kg' | 'lb' | '') => {
  emit('update:weightUnit', unit)
}
</script>

<style scoped>
.input-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Responsive grid adjustments */
@media (max-width: 400px) {
  .input-grid {
    grid-template-columns: 1fr;
    width: 100%;
    max-width: 100%;
  }
}

@media (max-width: 320px) {
  .input-grid {
    grid-template-columns: 1fr;
    width: 100%;
    max-width: 100%;
  }
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
  min-height: 2.5rem; /* Minimum 40px touch target */
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
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

.input-field {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  font-size: 1rem;
  font-weight: 500;
  color: #1e293b;
  outline: none;
  min-height: 2.5rem; /* Minimum 40px touch target */
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
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

/* Responsive Design */
@media (max-width: 768px) {
  .input-form {
    gap: 1rem;
  }
  
  .input-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .input-label-with-toggle {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  
  .toggle-btn {
    align-self: flex-start;
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
    min-height: 44px; /* Standard touch target */
  }
  
  .input-section {
    gap: 1rem;
  }
  
  .section-title {
    font-size: 1.125rem;
    margin-bottom: 0.75rem;
  }
}

@media (max-width: 480px) {
  .input-form {
    gap: 0.75rem;
  }
  
  .input-grid {
    gap: 1rem;
  }
  
  .input-section {
    gap: 0.75rem;
  }
  
  .section-title {
    font-size: 1rem;
    flex-direction: column;
    gap: 0.25rem;
    text-align: center;
    margin-bottom: 0.5rem;
  }
  
  .input-label-with-toggle {
    gap: 0.5rem;
  }
  
  .toggle-btn {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
    min-height: 44px;
  }
  
  .input-field {
    padding: 0.625rem 0.75rem;
  }
  
  .input-unit {
    padding: 0 0.75rem;
  }
}

/* Very small devices - optimize spacing further */
@media (max-width: 360px) {
  .input-form {
    gap: 0.5rem;
  }
  
  .input-grid {
    gap: 0.75rem;
  }
  
  .input-section {
    gap: 0.5rem;
  }
  
  .section-title {
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
  }
  
  .input-field {
    padding: 0.5rem 0.625rem;
    font-size: 0.95rem;
  }
  
  .input-unit {
    padding: 0 0.625rem;
    font-size: 0.8rem;
  }
  
  .input-label {
    font-size: 0.8rem;
  }
  
  .input-hint {
    font-size: 0.7rem;
  }
  
  .toggle-btn {
    padding: 0.375rem 0.625rem;
    font-size: 0.7rem;
  }
}

/* Extra small devices - minimal spacing */
@media (max-width: 320px) {
  .input-form {
    gap: 0.5rem;
  }
  
  .input-grid {
    gap: 0.5rem;
  }
  
  .input-section {
    gap: 0.5rem;
  }
  
  .input-field {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
  
  .input-unit {
    padding: 0 0.5rem;
    font-size: 0.75rem;
  }
  
  .section-title {
    font-size: 0.9rem;
    padding-bottom: 0.5rem;
  }
}

/* Ultra small devices - under 300px */
@media (max-width: 300px) {
  .input-form {
    gap: 0.375rem;
  }
  
  .input-grid {
    gap: 0.375rem;
    width: 100%;
    max-width: 100%;
  }
  
  .input-section {
    gap: 0.375rem;
  }
  
  .section-title {
    font-size: 0.85rem;
    padding-bottom: 0.375rem;
    margin-bottom: 0.375rem;
  }
  
  .input-group {
    gap: 0.25rem;
  }
  
  .input-wrapper {
    border-radius: 6px;
    border-width: 1px;
  }
  
  .input-field {
    padding: 0.25rem 0.375rem;
    font-size: 0.8rem;
    min-height: 2.25rem;
  }
  
  .input-unit {
    padding: 0 0.375rem;
    font-size: 0.7rem;
  }
  
  .input-label {
    font-size: 0.75rem;
  }
  
  .input-hint {
    font-size: 0.65rem;
  }
  
  .input-label-with-toggle {
    flex-direction: column;
    gap: 0.375rem;
  }
  
  .toggle-btn {
    padding: 0.25rem 0.375rem;
    font-size: 0.65rem;
    min-height: 36px;
    border-radius: 4px;
  }
}

/* Prevent zoom on input focus for iOS */
@supports (-webkit-touch-callout: none) {
  .input-field {
    font-size: max(16px, 1rem); /* Prevents zoom on iOS */
  }
  
  /* Ensure minimum font size on very small screens */
  @media (max-width: 360px) {
    .input-field {
      font-size: max(16px, 0.95rem);
    }
  }
  
  @media (max-width: 320px) {
    .input-field {
      font-size: max(16px, 0.9rem);
    }
  }
}

/* Mobile-specific touch optimizations */
@media (max-width: 768px) {
  /* Disable hover effects on touch devices */
  .input-wrapper:hover {
    border-color: #e2e8f0;
  }
  
  .toggle-btn:hover {
    border-color: #e2e8f0;
    color: #64748b;
    background: #f8fafc;
  }
  
  /* Better active states for touch */
  .toggle-btn:active {
    transform: scale(0.95);
    transition: transform 0.1s ease;
  }
}
</style>