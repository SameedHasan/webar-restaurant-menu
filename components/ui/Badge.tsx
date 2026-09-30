interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'ar';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const styles =
    variant === 'ar'
      ? 'bg-amber-100 text-amber-800 border-amber-200'
      : 'bg-stone-100 text-stone-600 border-stone-200';

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${styles}`}>
      {children}
    </span>
  );
}
