// Quick Actions: the full catalog from GET /api/miniapp/skills.
//
// Every card taps through, including locked ones — the paywall is enforced
// server-side when the student actually sends the message, so blocking the tap
// here would only hide what the product can do.
import SkillCard from '@/components/SkillCard';
import { isSkillLocked, launchSkill } from '@/lib/skillLink';

export default function QuickActionsScreen({ me, config, skills }) {
  return (
    <div className="space-y-4">
      <header className="px-1 pt-1">
        <h1 className="text-xl font-bold tracking-tight text-[var(--text)]">Быстрые действия</h1>
        <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
          Нажмите на действие — откроется чат с ботом с готовым текстом. Ничего не отправляется
          само: допишите детали и нажмите «Отправить».
        </p>
      </header>

      <div className="space-y-3">
        {skills.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            locked={isSkillLocked(me, skill)}
            onTap={() => launchSkill(config.botUsername, skill)}
          />
        ))}
      </div>

      {me.isFreeTrial && (
        <p className="px-1 pb-1 text-xs leading-relaxed text-[var(--text-secondary)]">
          Действия с отметкой «Только с подпиской» доступны после оформления подписки.
        </p>
      )}
    </div>
  );
}
