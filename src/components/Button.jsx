// Same contract as the dashboard's Button (rounded-full, font-semibold,
// identical disabled/transition handling) and the same colors: `primary` is the
// violet fill via `--primary-bg` / `--primary-text`, darkening to `--accent-dark`
// on hover (the dashboard's white-on-violet primary button, `hover:bg-violet-dark`).
// `secondary` is a violet outline on a transparent surface (`border-violet
// text-violet hover:bg-violet/5`). `ghost` stays neutral — it is the quiet,
// non-action variant and takes no accent.
const base =
  'inline-flex items-center justify-center rounded-full font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none';

const variants = {
  primary: 'bg-[var(--primary-bg)] text-[var(--primary-text)] hover:bg-[var(--accent-dark)]',
  secondary:
    'border border-[var(--accent)] bg-transparent text-[var(--accent)] hover:bg-[var(--accent)]/5',
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
