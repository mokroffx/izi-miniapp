// Same shape contract as the dashboard's Button (rounded-full, font-semibold,
// identical disabled/transition handling) — only the fill is recolored: the
// dashboard's violet becomes the monochrome `--primary-bg` / `--primary-text`
// pair, and the secondary variant borders in `--border` instead of violet.
const base =
  'inline-flex items-center justify-center rounded-full font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none';

const variants = {
  primary: 'bg-[var(--primary-bg)] text-[var(--primary-text)] hover:opacity-90',
  secondary:
    'border border-[var(--border)] bg-transparent text-[var(--text)] hover:bg-[var(--hover)]',
  ghost: 'bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--hover)]',
};

export default function Button({
  as: Comp = 'button',
  variant = 'primary',
  className = '',
  ...props
}) {
  return <Comp className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
