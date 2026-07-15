export interface IncidentRecord {
  id: string;
  userId?: string;
  description: string;
  location: string;
  image?: string;
  status: string;
  priority: string;
  decisionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const incidentStore: IncidentRecord[] = [];
