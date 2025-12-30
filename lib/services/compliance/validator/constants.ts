/**
 * Australian Hospitality Compliance Rules constants.
 */

// Australian Hospitality Compliance Rules
export const COMPLIANCE_RULES = {
  // Minimum break between shifts (10 hours for different days, 4 hours for same-day split shifts)
  MIN_BREAK_BETWEEN_SHIFTS_HOURS: 10,
  MIN_BREAK_BETWEEN_SAME_DAY_SHIFTS_HOURS: 4, // For split shifts on the same day

  // Maximum shift length (12 hours)
  MAX_SHIFT_LENGTH_HOURS: 12,

  // Minimum break duration during shift (30 minutes for shifts > 5 hours)
  MIN_BREAK_DURATION_MINUTES: 30,
  MIN_BREAK_REQUIRED_AFTER_HOURS: 5,

  // Maximum consecutive days (5 days)
  MAX_CONSECUTIVE_DAYS: 5,

  // Maximum hours per week (38 for full-time, varies for casual/part-time)
  MAX_HOURS_PER_WEEK_FULL_TIME: 38,
  MAX_HOURS_PER_WEEK_PART_TIME: 30,
  MAX_HOURS_PER_WEEK_CASUAL: 50, // Higher limit for casual with penalty rates
} as const;



