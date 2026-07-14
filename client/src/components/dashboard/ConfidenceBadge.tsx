
interface ConfidenceBadgeProps {
  score: number; // 0 to 1
}

export function ConfidenceBadge({ score }: ConfidenceBadgeProps) {
  const percentage = Math.round(score * 100);
  
  const getStyles = () => {
    if (percentage >= 90) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 ring-green-500/20';
    if (percentage >= 75) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 ring-amber-500/20';
    return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 ring-red-500/20';
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ring-1 ring-inset ${getStyles()}`}>
      {percentage}% Confidence
    </span>
  );
}
