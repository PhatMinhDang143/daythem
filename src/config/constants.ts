// Central business constants and dynamic date utility helpers

export const PREFIXES = {
  STUDENT: 'HS-',
  CLASS: 'LH-',
  INVOICE: 'HD-',
  EXPENSE: 'PC-',
  USER: 'ND-',
  EVALUATION: 'DG-',
} as const;

export const DEFAULT_THRESHOLDS = {
  OVERDUE_WARNING_DAYS: 7,
  MIN_ATTENDANCE_PERCENT: 80,
  LOW_BALANCE_THRESHOLD: 0,
} as const;

/**
 * Gets the current 4-digit year as number (e.g., 2026)
 */
export const getCurrentYear = (): number => new Date().getFullYear();

/**
 * Gets the current 4-digit year as string (e.g., "2026")
 */
export const getCurrentYearString = (): string => String(getCurrentYear());

/**
 * Gets the current month in YYYY-MM format (e.g., "2026-08")
 */
export const getCurrentMonthString = (date: Date = new Date()): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
};

/**
 * Gets human readable month/year string (e.g. "Tháng 8/2026")
 */
export const getCurrentFormattedMonthYear = (date: Date = new Date()): string => {
  return `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;
};

/**
 * Helper to generate an invoice code using current year dynamically: e.g. HD-2026-1234
 */
export const generateInvoiceCode = (): string => {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${PREFIXES.INVOICE}${getCurrentYear()}-${randomSuffix}`;
};

/**
 * Helper to generate an expense code using current year dynamically: e.g. PC-2026-1234
 */
export const generateExpenseCode = (): string => {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${PREFIXES.EXPENSE}${getCurrentYear()}-${randomSuffix}`;
};

/**
 * Helper to generate student code using current year: e.g. HS-2026-001
 */
export const generateStudentCode = (sequenceNumber: number | string): string => {
  const seq = String(sequenceNumber).padStart(3, '0');
  return `${PREFIXES.STUDENT}${getCurrentYear()}-${seq}`;
};
