// Profile: plan + balance, subscription management, account info, and the
// 30-day usage block (daily bar chart + the most recent tasks underneath).
import { useEffect, useState } from 'react';
import BalanceGauge from '@/components/BalanceGauge';
import Button from '@/components/Button';
import Card from '@/components/Card';
import ExternalLinkButton from '@/components/ExternalLinkButton';
import UpgradeCard from '@/components/UpgradeCard';
import UsageChart from '@/components/UsageChart';
import { cancelSubscription, friendlyError, getUsage } from '@/lib/api';

function formatDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

export default function ProfileScreen({ me, config, skills, onRefresh }) {
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getUsage()
      .then((data) => {
        if (!cancelled) setUsage(data);
      })
      .catch(() => {
        // The usage list is decorative — a failure just hides the block.
        if (!cancelled) setUsage(null);
      });
    return () => {
      cancelled = true;
    };
  }, [me.tier]);

  async function handleCancel() {
    setCancelling(true);
    setCancelError('');
    try {
      await cancelSubscription();
      setConfirming(false);
      await onRefresh();
    } catch (err) {
      setCancelError(friendlyError(err));
    } finally {
      setCancelling(false);
    }
  }

  const expiresAt = me.isFreeTrial ? null : formatDate(me.subscriptionExpiresAt);
  const skillLabel = (id) => skills.find((s) => s.id === id)?.label ?? id ?? 'Другое';
  const history = (usage?.history ?? []).slice(0, 8);

  return (
    <div className="space-y-4">
      <header className="px-1 pt-1">
        <h1 className="text-xl font-bold tracking-tight text-[var(--text)]">Профиль</h1>
      </header>

      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-[var(--text-secondary)]">Тариф</div>
            <div className="mt-0.5 text-base font-bold text-[var(--text)]">{me.tierLabel}</div>
          </div>
          {expiresAt && (
            <div className="text-right">
              <div className="text-xs text-[var(--text-secondary)]">Действует до</div>
              <div className="mt-0.5 text-sm font-semibold text-[var(--text)]">{expiresAt}</div>
            </div>
          )}
        </div>
        <div className="mt-4">
          <BalanceGauge percent={me.balance?.percentOfAllowance} />
        </div>
      </Card>

      {me.isFreeTrial ? (
        <UpgradeCard
          message={me.upgradeMessage}
          percent={me.balance?.percentOfAllowance}
          paymentUrl={config.paymentUrl}
        />
      ) : (
        <Card>
          <h2 className="text-base font-bold text-[var(--text)]">Подписка</h2>
          {!confirming ? (
            <>
              <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                Отмена переводит аккаунт на бесплатный тариф. Действия с отметкой «Только с
                подпиской» станут недоступны.
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  setCancelError('');
                  setConfirming(true);
                }}
                className="mt-4 w-full px-5 py-3 text-sm"
              >
                Отменить подписку
              </Button>
            </>
          ) : (
            <>
              <p className="mt-1 text-sm leading-relaxed text-[var(--text)]">
                Точно отменить подписку? Вернуться на платный тариф можно будет только оформив её
                заново.
              </p>
              <div className="mt-4 flex gap-3">
                <Button
                  variant="secondary"
                  disabled={cancelling}
                  onClick={() => setConfirming(false)}
                  className="flex-1 px-5 py-3 text-sm"
                >
                  Оставить
                </Button>
                <Button
                  disabled={cancelling}
                  onClick={handleCancel}
                  className="flex-1 px-5 py-3 text-sm"
                >
                  {cancelling ? 'Отменяем…' : 'Да, отменить'}
                </Button>
              </div>
            </>
          )}
          {cancelError && (
            <div className="mt-3 text-sm text-[var(--text-secondary)]">{cancelError}</div>
          )}
        </Card>
      )}

      <Card>
        <h2 className="text-base font-bold text-[var(--text)]">Аккаунт</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[var(--text-secondary)]">Имя</dt>
            <dd className="truncate font-semibold text-[var(--text)]">{me.firstName || '—'}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[var(--text-secondary)]">Университет</dt>
            <dd className="truncate font-semibold text-[var(--text)]">{me.university || '—'}</dd>
          </div>
        </dl>
        <ExternalLinkButton
          variant="secondary"
          href={config.appUrl}
          className="mt-4 w-full px-5 py-3 text-sm"
        >
          Управлять в личном кабинете
        </ExternalLinkButton>
      </Card>

      {usage && (
        <Card>
          <h2 className="text-base font-bold text-[var(--text)]">Использование</h2>
          <p className="mt-1 mb-4 text-sm text-[var(--text-secondary)]">За последние 14 дней</p>
          <UsageChart dailyHistory={usage?.dailyHistory} />

          {history.length > 0 && (
            <>
              <h3 className="mt-5 text-sm font-bold text-[var(--text)]">Последние задачи</h3>
              <ul className="mt-1 divide-y divide-[var(--border)]">
                {history.map((row, i) => (
                  <li
                    key={`${row.date}-${row.skill}-${i}`}
                    className="flex items-center justify-between gap-3 py-2.5 text-sm"
                  >
                    <span className="truncate text-[var(--text)]">{skillLabel(row.skill)}</span>
                    <span className="shrink-0 text-xs text-[var(--text-secondary)]">
                      {formatDate(row.date) ?? ''}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
