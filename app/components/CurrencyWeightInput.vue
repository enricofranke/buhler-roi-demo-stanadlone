<template>
  <div class="currency-weight-input-component">
    <label v-if="label" :for="inputId" class="input-label">
      {{ label }}
      <span v-if="hint" class="input-hint">{{ hint }}</span>
    </label>
    <div class="input-wrapper currency">
      <span class="currency-symbol">$</span>
      <input 
        :id="inputId"
        v-model="displayValue"
        type="text" 
        class="input-field"
        :placeholder="placeholder"
      />
      <span class="input-unit">per {{ unitLabel }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  modelValue?: number | null
  label?: string
  hint?: string
  placeholder?: string
  inputId?: string
  unit?: 'kg' | 'lb' | ''
}

interface Emits {
  (e: 'update:modelValue', value: number | null): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  label: '',
  hint: '',
  placeholder: '0.00',
  inputId: 'currency-weight-input',
  unit: ''
})

const emit = defineEmits<Emits>()

// Conversion factor
const LB_TO_KG_FACTOR = 2.20462

// Unit label
const unitLabel = computed(() => props.unit || 'unit')

// Display value computed property
const displayValue = computed({
  get: () => {
    const value = props.modelValue
    if (!value) return ''
    
    // Show value based on current unit selection
    if (props.unit === 'kg') return value.toString()
    if (props.unit === 'lb') return (value / LB_TO_KG_FACTOR).toFixed(4)
    return value.toString() // fallback if no unit selected
  },
  set: (newValue: string) => {
    if (!newValue || newValue.trim() === '') {
      emit('update:modelValue', null)
      return
    }
    
    const numValue = parseFloat(newValue)
    if (!isNaN(numValue)) {
      // Always store as per kg internally
      if (props.unit === 'kg') {
        emit('update:modelValue', numValue)
      } else if (props.unit === 'lb') {
        emit('update:modelValue', numValue * LB_TO_KG_FACTOR)
      } else {
        // No unit selected, assume kg
        emit('update:modelValue', numValue)
      }
    }
  }
})

// Watch unit changes to update display
watch(() => props.unit, () => {
  // Trigger reactivity when unit changes
  if (props.modelValue) {
    displayValue.value = displayValue.value
  }
})
</script>

<style scoped>
.currency-weight-input-component {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

.input-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s ease;
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
  padding: 0.75rem 0.5rem;
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

.currency-symbol {
  padding: 0 0 0 1rem;
  color: #64748b;
  font-size: 1rem;
  font-weight: 500;
}

.input-unit {
  padding: 0 1rem;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}
</style>