// Free-trial-only subscription prompt: the bot's own upgrade copy, the
// percentage balance gauge, and a checkout link.
//
// `paymentUrl` is an ordinary external https link opened with the SDK's
// openLink() — it deliberately does NOT close the Mini App, so the student can
// come back to it after paying.
//
// Rendered with Card's `accent` (violet left edge) because this is the one
// block on both Home and Profile that should stand out from the neutral cards
// around it.
import Card from '@/components/Card';
import BalanceGauge from '@/components/BalanceGauge';
import ExternalLinkButton from '@/components/ExternalLinkButton';

export default function UpgradeCard({ message, percent, paymentUrl }) {
  return (
    <Card accent>
      <h2 className="text-base font-bold text-[var(--text)]">Подписка</h2>
      {message && (
        <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{message}</p>
      )}

      <div className="mt-4">
        <BalanceGauge percent={percent} />
      </div>

      <ExternalLinkButton href={paymentUrl} className="mt-4 w-full px-5 py-3 text-sm">
        Оформить подписку
      </ExternalLinkButton>
    </Card>
  );
}
