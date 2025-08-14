<template>
  <div class="export-action-bar">
    <div class="export-container">
      <div class="export-info">
        <h3 class="export-title">Export PDF</h3>
        <p class="export-description">Download your calculation results</p>
      </div>
      <button
        class="export-btn-enhanced"
        :class="{ disabled: !canExport || isExporting }"
        @click="onClick"
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
</template>

<script setup lang="ts">
const props = defineProps<{ canExport: boolean; isExporting: boolean; disableReason?: string }>()
const emit = defineEmits<{ (e: 'export'): void; (e: 'attempt'): void }>()

const onClick = () => {
  if (!props.canExport || props.isExporting) {
    emit('attempt')
    return
  }
  emit('export')
}
</script>

<style scoped>
.export-action-bar { margin-top: 1rem; }
.export-container {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  backdrop-filter: saturate(180%) blur(12px);
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}
.export-title { font-size: 1.25rem; font-weight: 700; color: #1e293b; margin: 0 0 0.25rem 0; }
.export-description { font-size: 0.875rem; color: #64748b; margin: 0; }
.export-btn-enhanced {
  background: linear-gradient(135deg, var(--buhler-primary) 0%, var(--buhler-primary-400) 100%);
  color: white; border: none; border-radius: 16px; padding: 0; cursor: pointer;
  display: flex; align-items: center; gap: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 15px -3px rgba(0, 155, 145, 0.3), 0 4px 6px -2px rgba(0, 155, 145, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  min-width: 280px; min-height: 4rem; overflow: hidden; position: relative;
}
.export-btn-enhanced.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.btn-content { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.5rem; flex: 1; }
.btn-icon { background: rgba(255, 255, 255, 0.2); border-radius: 12px; padding: 0.75rem; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; min-width: 3rem; min-height: 3rem; }
.btn-text { display: flex; flex-direction: column; align-items: flex-start; gap: 0.125rem; }
.btn-label { font-size: 1rem; font-weight: 600; line-height: 1.2; text-shadow: 0 1px 2px rgba(0,0,0,.1); }
.btn-subtitle { font-size: 0.75rem; opacity: .9; font-weight: 400; text-shadow: 0 1px 2px rgba(0,0,0,.1); }
.btn-arrow { padding: 1rem; display: flex; align-items: center; justify-content: center; font-size: 1rem; transition: transform .3s ease; }
.spinner { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.export-hint { margin: 0.5rem 0 0 0; font-size: 0.875rem; color: #64748b; display: flex; align-items: center; gap: 0.5rem; }
@media (max-width: 768px) {
  .export-container { flex-direction: column; gap: 1.5rem; text-align: center; padding: 1.5rem; }
  .export-btn-enhanced { min-width: 100%; justify-content: center; }
  .btn-content { padding: 1.5rem; }
}
</style>



