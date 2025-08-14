<template>
  <div class="step1-container">
    <!-- Step Header Card -->
    <div class="step-header-card">
      <div class="step-header">
        <h3 class="step-title">
          <i class="pi pi-user" aria-hidden="true"></i>
          <span class="step-title-text">{{ title }}</span>
        </h3>
        <p class="step-subtitle">{{ subtitle }}</p>
      </div>
    </div>

    <!-- Optional Company Information (only for customer-data page) -->
    <div v-if="showCompanyInfo" class="company-section">
      <h4 class="section-title">
        <i class="pi pi-building" aria-hidden="true"></i>
        Company Information
      </h4>
      <div class="company-input-group">
        <label class="company-label">
          Company Name
          <span class="company-hint">Your company name for the report</span>
        </label>
        <div class="input-wrapper" :class="{ error: showErrors && companyNameInvalid }">
          <input 
            v-model="internalCompanyName"
            type="text" 
            class="company-input"
            placeholder="Enter your company name"
            inputmode="text"
            spellcheck="false"
            autocapitalize="words"
            autocorrect="off"
          >
        </div>
        <div v-if="showErrors && companyNameInvalid" class="validation-hint">
          Please enter your company name.
        </div>
      </div>
    </div>

    <!-- Input Parameters Grid -->
    <RoiInputForm
      :inputs="inputs"
      :machines-terminology="machinesTerminology"
      :weight-unit="weightUnit"
      v-model:show-errors="showErrors"
      @update:inputs="$emit('update:inputs', $event)"
      @update:machines-terminology="$emit('update:machines-terminology', $event)"
      @update:weight-unit="$emit('update:weight-unit', $event)"
    />

    <!-- Downtime Impact Analysis - below both parameter sections -->
    <div class="downtime-impact-section">
      <slot name="downtime"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import RoiInputForm from './RoiInputForm.vue'

const props = withDefaults(defineProps<{
  inputs: any
  machinesTerminology: 'operation' | 'scope'
  weightUnit: 'kg' | 'lb' | ''
  title?: string
  subtitle?: string
  showCompanyInfo?: boolean
  companyName?: string
}>(), {
  title: 'Your Company Information',
  subtitle: 'Please enter your production and operational data to calculate your potential ROI',
  showCompanyInfo: false,
  companyName: ''
})

const { title, subtitle, showCompanyInfo } = props

const emit = defineEmits<{
  (e: 'update:inputs', v: any): void
  (e: 'update:machines-terminology', v: 'operation' | 'scope'): void
  (e: 'update:weight-unit', v: 'kg' | 'lb' | ''): void
  (e: 'update:company-name', v: string): void
}>()

const internalCompanyName = computed({
  get: () => props.companyName ?? '',
  set: (v: string) => emit('update:company-name', v)
})

// Allow parent to trigger visual error state for the inner form
const showErrors = defineModel<boolean>('showErrors', { default: false })

const companyNameInvalid = computed(() => !internalCompanyName.value || internalCompanyName.value.trim().length === 0)
</script>

<style scoped>
.step1-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Step Header Card */
.step-header-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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

.downtime-impact-section {
  margin-top: 0;
}

/* Company info styles (scoped here) */
.company-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.75rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
}

.section-title i {
  color: var(--buhler-primary);
  font-size: 1.125rem;
}

.company-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.input-wrapper:hover { border-color: #cbd5e1; }
.input-wrapper:focus-within { border-color: var(--buhler-primary); box-shadow: 0 0 0 3px rgba(0, 155, 145, 0.1); }
.input-wrapper.error { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1); }

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
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  font-size: 1rem;
  font-weight: 500;
  color: #1e293b;
  outline: none;
}

.validation-hint {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #ef4444;
}

/* Responsive Design */
@media (max-width: 768px) {
  .step1-container {
    gap: 1rem;
  }
  
  .step-header-card {
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
}

@media (max-width: 480px) {
  .step-header-card {
    padding: 1rem;
    border-radius: 12px;
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
}
</style>



