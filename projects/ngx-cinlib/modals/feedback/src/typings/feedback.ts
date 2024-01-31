export enum FeedbackType {
  Error = 'error',
  Critical = 'critical',
  Info = 'info',
  Success = 'success',
}

export interface Feedback {
  type: FeedbackType,
  labelMessage?: string,
  labelAction?: string,
  labelVariables?: Map<string, unknown>,
}