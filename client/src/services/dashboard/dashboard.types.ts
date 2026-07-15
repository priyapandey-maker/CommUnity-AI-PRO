export interface CommunityHealth {
  activeIncidents: number;
  resolvedToday: number;
  averageResponseTimeMinutes: number;
  healthScore: number; // 0-100
}

export interface DashboardMetrics {
  totalIncidents: number;
  criticalIncidents: number;
  escalations: number;
  departmentsActive: number;
  pendingDecisions: number;
}

export interface PriorityIncident {
  id: string;
  title: string;
  category: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  department: string;
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
  timestamp: string;
  confidence: number;
}

export interface DepartmentSummary {
  id: string;
  name: string;
  openCases: number;
  criticalCases: number;
  workload: 'LOW' | 'OPTIMAL' | 'HIGH' | 'CRITICAL';
  availabilityPercentage: number;
}

export interface TimelineEvent {
  id: string;
  incidentId: string;
  type: 'REPORTED' | 'AI_ANALYSIS' | 'DECISION' | 'ESCALATION' | 'ASSIGNMENT' | 'RESOLUTION' | 'STATUS_UPDATE';
  title: string;
  description: string;
  timestamp: string;
}

export interface DecisionSummary {
  id: string;
  incidentId: string;
  incidentTitle: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedAction: string;
  responsibleDepartment: string;
  confidence: number;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  timestamp: string;
  reasonSummary: string;
  evidenceWeightings: { factor: string; weight: number }[];
}

export interface DashboardState {
  metrics: DashboardMetrics;
  health: CommunityHealth;
  priorityQueue: PriorityIncident[];
  liveIncidents: PriorityIncident[];
  decisions: DecisionSummary[];
  timeline: TimelineEvent[];
  departments: DepartmentSummary[];
  trends: { date: string; count: number }[];
  categoryDistribution: { category: string; percentage: number }[];
  primaryRecommendation: string;
}
