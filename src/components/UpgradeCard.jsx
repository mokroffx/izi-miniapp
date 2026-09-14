// Free-trial-only subscription prompt: the bot's own upgrade copy, the
// percentage balance gauge, and a checkout link.
//
// `paymentUrl` is an ordinary external https link opened with the SDK's
// openLink() — it deliberately does NOT close the Mini App, so the student can
// come back to it after paying.
import Button from '@/components/Button';
import Card from '@/components/Card';
import BalanceGauge from '@/components/BalanceGauge';
import { openExternalLink } from '@/telegram/sdk';

export default function UpgradeCard({ message, percent, paymentUrl }) {
  return (
    <Card>
      <h2 className="text-base font-bold text-[var(--text)]">Подписка</h2>
      {message && (
        <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{message}</p>
      )}

      <div className="mt-4">
        <BalanceGauge percent={percent} />
      </div>

      <Button
        as="a"
        href={paymentUrl || '#'}
        onClick={(e) => {
          e.preventDefault();
          openExternalLink(paymentUrl);
        }}
        className="mt-4 w-full px-5 py-3 text-sm"
      >
        Оформить подписку
      </Button>
    </Card>
  );
}
