// Home: subscription prompt (free trial only) → referral block → the three
// featured quick actions.
import Card from '@/components/Card';
import ReferralBlock from '@/components/ReferralBlock';
import SkillCard from '@/components/SkillCard';
import UpgradeCard from '@/components/UpgradeCard';
import { isSkillLocked, launchSkill } from '@/lib/skillLink';

export default function HomeScreen({ me, config, skills, referral }) {
  // `featured` comes from GET /api/miniapp/skills (MINIAPP_FEATURED_SKILL_IDS
  // on the backend) — never a second hardcoded id list here, so a catalog
  // change can't leave Home stale.
  const featured = skills.filter((s) => s.featured);

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
              locked={isSkillLocked(me, skill)}
              onTap={() => launchSkill(config.botUsername, skill)}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
