// One quick action.
//
// A locked card (free trial + paidOnly skill) still taps through: the real
// paywall lives server-side in before_agent_run when the message is actually
// sent. The lock treatment is an advance warning, not a block — but it is
// visibly different from an unlocked card (muted surface, dashed border,
// secondary text, "🔒 Только с подпиской" badge).
export default function SkillCard({ skill, locked = false, onTap }) {
  return (
    <button
      type="button"
      onClick={() => onTap(skill)}
      className={`flex w-full flex-col items-start rounded-2xl border p-4 text-left transition-colors ${
        locked
          ? 'border-dashed border-[var(--border)] bg-[var(--surface-2)] hover:bg-[var(--hover)]'
          : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)]'
      }`}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <span
          className={`text-sm font-semibold ${
            locked ? 'text-[var(--text-secondary)]' : 'text-[var(--text)]'
          }`}
        >
          {skill.label}
        </span>
        {locked && (
          <span className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[10px] font-semibold text-[var(--text-secondary)]">
            🔒 Только с подпиской
          </span>
        )}
      </div>
      <span className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
        {skill.description}
      </span>
    </button>
  );
}
