<template>
  <div class="weight-input-component">
    <div class="input-label-with-toggle">
      <label v-if="label" :for="inputId" class="input-label">
        {{ label }}
        <span v-if="hint" class="input-hint">{{ hint }}</span>
      </label>
      <div class="toggle-group">
        <button
          type="button"
          class="toggle-btn"
          :class="{ active: selectedUnit === 'kg' }"
          @click="setUnit('kg')"
        >kg</button>
        <button
          type="button"
          class="toggle-btn"
          :class="{ active: selectedUnit === 'lb' }"
          @click="setUnit('lb')"
        >lb</button>
      </div>
    </div>
    <div class="input-wrapper weight-input" :class="{ error }">
              <input 
        :id="inputId"
        v-model="displayValue"
        type="text" 
        class="input-field"
        :placeholder="placeholder"
        inputmode="decimal"
        spellcheck="false"
        autocorrect="off"
      >
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
  error?: boolean
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
  inputId: 'weight-input',
  unit: '',
  error: false
})

const emit = defineEmits<Emits>()

// Internal unit state, initialized from prop if provided
const selectedUnit = ref<'kg' | 'lb' | ''>(props.unit)

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
    return { value: parseFloat(kgMatch[1] as string), unit: 'kg' }
  } else if (lbMatch) {
    return { value: parseFloat(lbMatch[1] as string), unit: 'lb' }
  } else if (!isNaN(parseFloat(cleanInput))) {
    // Pure number, use current unit from dropdown (if selected)
    return { value: parseFloat(cleanInput), unit: selectedUnit.value }
  }
  
  return null
}

// Public helper to set unit from template toggle
const setUnit = (unit: 'kg' | 'lb') => {
  selectedUnit.value = unit
  emit('update:unit', unit)
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
})

// Keep internal unit in sync with external prop updates
watch(
  () => props.unit,
  (newUnit) => {
    if (newUnit !== selectedUnit.value) {
      selectedUnit.value = newUnit
    }
  }
)

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

.input-label-with-toggle {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
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

.toggle-group {
  display: flex;
  gap: 0.5rem;
}

.toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
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
  min-width: 2.5rem;
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

/* Error state (matches calculator styles) */
.input-wrapper.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
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

/* Weight Input Styles */
.input-wrapper.weight-input {
  display: flex;
  align-items: stretch;
}

.input-wrapper.weight-input .input-field {
  flex: 1;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.input-wrapper.weight-input:focus-within {
  border-color: var(--buhler-primary);
  box-shadow: 0 0 0 3px rgba(0, 155, 145, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .input-label-with-toggle {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .toggle-group {
    align-self: flex-start;
  }
  
  .toggle-btn {
    min-height: 44px; /* Standard touch target */
    min-width: 44px;
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .weight-input-component {
    gap: 0.375rem;
  }
  
  .input-label-with-toggle {
    gap: 0.375rem;
  }
  
  .toggle-btn {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
    min-height: 44px;
    min-width: 44px;
  }
}

/* Prevent zoom on input focus for iOS */
@supports (-webkit-touch-callout: none) {
  .input-field {
    font-size: max(16px, 1rem); /* Prevents zoom on iOS */
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