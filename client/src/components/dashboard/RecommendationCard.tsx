
interface RecommendationCardProps {
  primaryRecommendation: string;
}

export function RecommendationCard({ primaryRecommendation }: RecommendationCardProps) {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-5">
      <h3 className="text-xs font-semibold text-blue-800 dark:text-blue-400 uppercase tracking-widest mb-2">
        Primary AI Recommendation
      </h3>
      <p className="text-blue-900 dark:text-blue-100 text-lg font-medium leading-relaxed">
        {primaryRecommendation}
      </p>
    </div>
  );
}
