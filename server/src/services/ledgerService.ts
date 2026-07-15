import type { LedgerEntry } from '@community-ai/shared';

export class LedgerService {
  private ledger: LedgerEntry[] = [];

  /**
   * Returns all entries stored in the immutable ledger.
   * Order is chronological (oldest first, which is standard insertion order).
   */
  public getEntries(): LedgerEntry[] {
    return this.ledger;
  }

  /**
   * Appends a new decision record to the in-memory ledger database.
   */
  public addEntry(entry: Omit<LedgerEntry, 'timestamp' | 'status'> & { status?: string }): LedgerEntry {
    const newEntry: LedgerEntry = {
      ...entry,
      status: entry.status || 'received',
      timestamp: new Date().toISOString(),
    };
    this.ledger.push(newEntry);
    return newEntry;
  }
}

export const ledgerService = new LedgerService();
