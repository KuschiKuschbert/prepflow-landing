/**
 * Process a single PrepFlow employee for sync to Square
 */
export interface TeamApi {
  updateTeamMember(
    id: string,
    body: { teamMember: unknown },
  ): Promise<{ result: { teamMember?: unknown } }>;
  createTeamMember(body: {
    idempotencyKey: string;
    teamMember: unknown;
  }): Promise<{ result: { teamMember?: { id: string } } }>;
}
