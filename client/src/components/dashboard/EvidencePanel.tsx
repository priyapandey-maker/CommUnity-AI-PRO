
interface EvidencePanelProps {
  reasonSummary: string;
  weightings: { factor: string; weight: number }[];
}

export function EvidencePanel({ reasonSummary, weightings }: EvidencePanelProps) {
  return (
    <div className="bg-surface-2 dark:bg-surface-2/50 rounded-md p-4 border border-line">
      <h4 className="text-sm font-semibold text-text-primary mb-2">Decision Evidence</h4>
      <p className="text-sm text-text-secondary mb-4">{reasonSummary}</p>
      
      <div className="space-y-3">
        {weightings.map((w, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-xs text-text-secondary mb-1">
              <span>{w.factor}</span>
              <span className="font-medium">Wt. {w.weight}</span>
            </div>
            <div className="w-full bg-surface-3 rounded-full h-1.5">
              <div 
                className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full" 
                style={{ width: `${Math.min(w.weight, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
