// The dashboard's card shape: rounded-2xl, 1px border in --border, --surface
// background. Padding is p-5 rather than the dashboard's p-6 because this runs
// in a phone-width WebView.
export default function Card({ as: Comp = 'section', className = '', ...props }) {
  return (
    <Comp
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 ${className}`}
      {...props}
    />
  );
}
