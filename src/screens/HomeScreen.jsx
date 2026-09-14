// Home: subscription prompt (free trial only) → referral block → the three
// featured quick actions.
import Card from '@/components/Card';
import ReferralBlock from '@/components/ReferralBlock';
import SkillCard from '@/components/SkillCard';
import UpgradeCard from '@/components/UpgradeCard';
import { launchSkill } from '@/lib/skillLink';

// Featured on Home, in this order. Filtered out of the same catalog the Quick
// Actions tab renders — never a second hardcoded copy of the skills.
const FEATURED_IDS = ['writer', 'exam_prep', 'browser'];

export default function HomeScreen({ me, config, skills, referral }) {
  const featured = FEATURED_IDS.map((id) => skills.find((s) => s.id === id)).filter(Boolean);

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

      <Card>
        <h2 className="text-base font-bold text-[var(--text)]">Быстрые действия</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Откроем чат с ботом и подставим текст — останется дописать детали и отправить.
        </p>
        <div className="mt-4 space-y-3">
          {featured.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              locked={me.isFreeTrial && skill.paidOnly}
              onTap={() => launchSkill(config.botUsername, skill)}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
