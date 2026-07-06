interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export default function PageHeader({ title, subtitle, badge }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {badge && (
        <span className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-primary-700 bg-primary-50 border border-primary-200 rounded-full dark:text-primary-300 dark:bg-primary-950 dark:border-primary-900">
          {badge}
        </span>
      )}
      <h1
        className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug"
        style={{ color: 'var(--text-primary)' }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className="mt-2 text-base max-w-2xl leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
