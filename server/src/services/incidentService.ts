import { randomUUID } from 'crypto';

export interface CreateIncidentDTO {
  description: string;
  location: string;
  image?: string;
}

export interface IncidentResponse {
  id: string;
  status: string;
}

export class IncidentService {
  /**
   * Processes the received incident data and returns a confirmation response.
   * Note: No database storage or AI logic is performed as per scaffold requirements.
   */
  public async processIncident(data: CreateIncidentDTO): Promise<IncidentResponse> {
    const id = randomUUID();
    return {
      id,
      status: 'received',
    };
  }
}
