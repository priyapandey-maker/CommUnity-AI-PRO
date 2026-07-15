export interface TimelineEntry {
  action: string;
  performedBy: string;
  timestamp: Date;
  details?: string;
}

export interface IncidentRecord {
  id: string;
  userId?: string;
  description: string;
  location: string;
  image?: string;
  status: string;
  priority: string;
  decisionId?: string;
  timeline: TimelineEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export const incidentStore: IncidentRecord[] = [];
