// The dashboard's card shape: rounded-2xl, 1px border in --border, --surface
// background. Padding is p-5 rather than the dashboard's p-6 because this runs
// in a phone-width WebView.
//
// `accent` opts a single card into the dashboard's `border-l-4 border-l-violet`
// treatment: the neutral border stays on the other three edges and only the
// left edge is violet, so the card reads as "called out" without turning into a
// second primary action. Reserved for deliberately highlighted blocks (e.g. the
// upgrade prompt) — the default, prop-less card is unchanged.
export default function Card({
  as: Comp = 'section',
  accent = false,
  className = '',
  ...props
}) {
  const accentBorder = accent ? 'border-l-4 border-l-[var(--accent)]' : '';
  return (
    <Comp
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 ${accentBorder} ${className}`}
      {...props}
    />
  );
}
