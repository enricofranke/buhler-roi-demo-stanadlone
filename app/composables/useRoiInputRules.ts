export type RoiInputsKeys =
  | 'machinesInOperation'
  | 'plannedMaintenanceEvents'
  | 'unplannedMaintenanceEvents'
  | 'plannedDowntimeDurationPerEvent'
  | 'unplannedDowntimeDurationPerEvent'
  | 'productionDaysPerYear'
  | 'productionHoursPerDay'
  | 'dailyOutputKg'
  | 'salesPricePerKg'
  | 'marginPercent'

/** Clamp helpers returning a normalized number or null (for empty input). */
export const useRoiInputRules = () => {
  const parseNullable = (raw: string): number | null => {
    if (raw == null) return null
    const trimmed = String(raw).trim()
    if (trimmed === '') return null
    const n = Number(trimmed)
    if (Number.isNaN(n)) return null
    return n
  }

  const clampProductionHours = (raw: string): number | null => {
    const n = parseNullable(raw)
    if (n == null) return null
    if (n < 0) return 0
    if (n > 24) return 24
    return n
  }

  const clampProductionDays = (raw: string): number | null => {
    const n = parseNullable(raw)
    if (n == null) return null
    if (n < 1) return 1
    if (n > 365) return 365
    return n
  }

  const clampMarginPercent = (raw: string): number | null => {
    const n = parseNullable(raw)
    if (n == null) return null
    if (n < 0) return 0
    if (n > 100) return 100
    return n
  }

  const clampMachinesInOperation = (raw: string): number | null => {
    const n = parseNullable(raw)
    if (n == null) return null
    if (n < 1) return 1
    return Math.trunc(n)
  }

  const clampIntegerMinZero = (raw: string): number | null => {
    const n = parseNullable(raw)
    if (n == null) return null
    return Math.max(0, Math.trunc(n))
  }

  return {
    clampProductionHours,
    clampProductionDays,
    clampMarginPercent,
    clampMachinesInOperation,
    clampIntegerMinZero,
  }
}



