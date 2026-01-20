export interface DesignPattern {
  name: string;
  type: 'creational' | 'structural' | 'behavioral';
  description: string;
  usage: string[];
  benefits: string[];
  drawbacks: string[];
}

export interface AntiPattern {
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  suggestion: string;
  file: string;
  line?: number;
}

export interface ArchitectureDecision {
  id: string;
  title: string;
  status: 'proposed' | 'accepted' | 'deprecated' | 'superseded';
  context: string;
  decision: string;
  consequences: string[];
  alternatives: string[];
  relatedDecisions?: string[];
  createdAt: string;
  updatedAt: string;
}
