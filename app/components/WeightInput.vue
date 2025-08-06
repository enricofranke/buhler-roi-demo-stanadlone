<template>
  <div class="weight-input-component">
    <label v-if="label" :for="inputId" class="input-label">
      {{ label }}
      <span v-if="hint" class="input-hint">{{ hint }}</span>
    </label>
    <div class="input-wrapper weight-input">
      <input 
        :id="inputId"
        v-model="displayValue"
        type="text" 
        class="input-field"
        :placeholder="placeholder"
      />
      <select 
        v-model="selectedUnit" 
        class="unit-selector"
      >
        <option value="">-</option>
        <option value="kg">kg</option>
        <option value="lb">lb</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

interface Props {
  modelValue?: number | null
  label?: string
  hint?: string
  placeholder?: string
  inputId?: string
}

interface Emits {
  (e: 'update:modelValue', value: number | null): void
  (e: 'update:unit', unit: 'kg' | 'lb' | ''): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  label: '',
  hint: '',
  placeholder: 'e.g. 1000kg, 2200lb, or just 1000',
  inputId: 'weight-input'
})

const emit = defineEmits<Emits>()

// Internal unit state
const selectedUnit = ref<'kg' | 'lb' | ''>('')

// Conversion functions with proper rounding
const kgToLb = (kg: number): number => Math.round(kg * 2.20462 * 10) / 10
const lbToKg = (lb: number): number => Math.round(lb / 2.20462 * 10) / 10

// Parse input with unit detection
const parseWeightInput = (input: string): { value: number; unit: 'kg' | 'lb' | '' } | null => {
  if (!input || typeof input !== 'string') return null
  
  const cleanInput = input.toString().toLowerCase().trim()
  
  // Match patterns for kg (including just 'g' for kg)
  const kgMatch = cleanInput.match(/^(\d+(?:\.\d+)?)\s*k?g$/i)
  // Match patterns for lb/lbs/pound/pounds
  const lbMatch = cleanInput.match(/^(\d+(?:\.\d+)?)\s*(?:lb|lbs|pound|pounds)$/i)
  
  if (kgMatch) {
    return { value: parseFloat(kgMatch[1]), unit: 'kg' }
  } else if (lbMatch) {
    return { value: parseFloat(lbMatch[1]), unit: 'lb' }
  } else if (!isNaN(parseFloat(cleanInput))) {
    // Pure number, use current unit from dropdown (if selected)
    return { value: parseFloat(cleanInput), unit: selectedUnit.value }
  }
  
  return null
}

// Display value computed property
const displayValue = computed({
  get: () => {
    const value = props.modelValue
    if (!value) return ''
    
    // Show value based on current unit selection
    if (selectedUnit.value === 'kg') return value.toString()
    if (selectedUnit.value === 'lb') return kgToLb(value).toString()
    return value.toString() // fallback if no unit selected
  },
  set: (newValue: string) => {
    if (!newValue || newValue.trim() === '') {
      emit('update:modelValue', null)
      return
    }
    
    const parsed = parseWeightInput(newValue)
    if (parsed) {
      // Update unit if detected from input
      if (parsed.unit === 'kg' || parsed.unit === 'lb') {
        selectedUnit.value = parsed.unit
        emit('update:unit', parsed.unit)
        // Always store in kg internally
        const kgValue = parsed.unit === 'kg' ? parsed.value : lbToKg(parsed.value)
        emit('update:modelValue', kgValue)
      } else if (selectedUnit.value && (selectedUnit.value === 'kg' || selectedUnit.value === 'lb')) {
        // Pure number with unit selected in dropdown
        const kgValue = selectedUnit.value === 'kg' ? parsed.value : lbToKg(parsed.value)
        emit('update:modelValue', kgValue)
      } else {
        // Pure number, no unit selected - store as kg for consistency
        emit('update:modelValue', parsed.value)
      }
    }
  }
})

// Watch for unit changes to update display and emit unit changes
watch(selectedUnit, (newUnit) => {
  emit('update:unit', newUnit)
  
  // Trigger reactivity update when unit changes
  if (props.modelValue) {
    nextTick(() => {
      // Force update of computed display value
      displayValue.value = displayValue.value
    })
  }
})

// Expose the current unit for parent components
defineExpose({
  unit: selectedUnit,
  setUnit: (unit: 'kg' | 'lb' | '') => {
    selectedUnit.value = unit
  }
})
</script>

<style scoped>
.weight-input-component {
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

/* Weight Input Styles */
.input-wrapper.weight-input {
  display: flex;
  align-items: stretch;
}

.input-wrapper.weight-input .input-field {
  flex: 1;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none;
}

.unit-selector {
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-left: none;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  min-width: 60px;
}

.unit-selector:focus {
  border-color: var(--buhler-primary);
  box-shadow: 0 0 0 3px rgba(0, 155, 145, 0.1);
}

.input-wrapper.weight-input:focus-within {
  border-color: var(--buhler-primary);
  box-shadow: 0 0 0 3px rgba(0, 155, 145, 0.1);
}

.input-wrapper.weight-input:focus-within .unit-selector {
  border-color: var(--buhler-primary);
}

/* Responsive Design */
@media (max-width: 480px) {
  .input-wrapper.weight-input {
    flex-direction: column;
  }
  
  .input-wrapper.weight-input .input-field {
    border-radius: 8px 8px 0 0;
    border-right: 2px solid #e2e8f0;
    border-bottom: none;
  }
  
  .unit-selector {
    border-radius: 0 0 8px 8px;
    border-left: 2px solid #e2e8f0;
    border-top: none;
  }
}
</style>