export interface BugPrediction {
  file: string;
  line: number;
  risk: 'critical' | 'high' | 'medium' | 'low';
  probability: number;
  predictedError: string;
  similarErrors: string[];
  suggestion: string;
  confidence: number;
}

export interface RiskAssessment {
  file: string;
  overallRisk: 'critical' | 'high' | 'medium' | 'low';
  riskScore: number;
  predictions: BugPrediction[];
  recommendations: string[];
}

export interface CodeHealthMetrics {
  overallScore: number;
  errorRisk: number;
  complexityScore: number;
  testCoverage: number;
  documentationScore: number;
  performanceScore: number;
  maintainabilityScore: number;
}
