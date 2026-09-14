// Home: subscription prompt (free trial only) → referral block.
import ReferralBlock from '@/components/ReferralBlock';
import UpgradeCard from '@/components/UpgradeCard';

export default function HomeScreen({ me, config, referral }) {
  return (
    <div className="space-y-4">
      <header className="px-1 pt-1">
        <h1 className="text-xl font-bold tracking-tight text-[var(--text)]">
          {me.firstName ? `Привет, ${me.firstName}` : 'Привет'}
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Тариф: {me.tierLabel}
        </p>
      </header>

      {me.isFreeTrial && (
        <UpgradeCard
          message={me.upgradeMessage}
          percent={me.balance?.percentOfAllowance}
          paymentUrl={config.paymentUrl}
        />
      )}

      <ReferralBlock
        status={referral.status}
        referral={referral.data}
        error={referral.error}
      />
    </div>
  );
}
