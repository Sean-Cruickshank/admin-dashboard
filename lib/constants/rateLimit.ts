export const RATE_LIMIT_ACTIONS = {
  CREATE_SUBMISSION: 'create_submission',
  MODERATE_CONTENT: 'moderate_content',
} as const

export const RATE_LIMIT_WINDOWS = {
  CREATE_SUBMISSION_SECONDS: 30,
  MODERATE_CONTENT_SECONDS: 5,
} as const