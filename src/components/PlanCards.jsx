// Three-plan comparison strip, rendered only for students still on the free
// trial. Purely a marketing surface: it names plans, shows their price and the
// monthly credit allowance, and links out to checkout.
//
// The card titles below ("Бесплатный" / "Pro" / "Max") are DISPLAY-ONLY copy
// for this component. They are not tier identifiers and must never be used for
// any decision — `tier`, `tierLabel` and the balance bar above keep coming from
// the backend (PLANS / TIER_LABELS in src/constants/tasks.js). The `tiers`
// comment on each entry only records which backend plan key the card is
// advertising, using the same free/pro/max grouping the admin routes use.
//
// Credit figures are the real PLANS allowances, not marketing rounding.
//
// Layout: a vertical stack of full-width cards, one under another. A real
// Telegram WebView is ~360-420px wide, so side-by-side columns would squeeze
// each card under ~110px; stacking keeps every card readable at full width and
// needs no horizontal scrolling.
import Card from '@/components/Card';
import Button from '@/components/Button';
import ExternalLinkButton from '@/components/ExternalLinkButton';

// Feature lines are intentionally short and generic — final marketing copy is
// not settled yet, so nothing here claims a specific feature.
const PLANS = [
  {
    id: 'free',
    // backend tier: free
    name: 'Бесплатный',
    price: 'Бесплатно',
    credits: '179 кредитов',
    note: '7-дневный пробный период',
    features: ['Базовый доступ к ассистенту'],
    current: true,
  },
  {
    id: 'pro',
    // backend tiers: base_monthly (+ base_annual)
    name: 'Pro',
    price: '1 490 ₽/мес',
    credits: '53 214 кредитов в месяц',
    note: 'или 11 900 ₽ в год',
    features: ['Больше кредитов в месяц', 'Действия без ограничений пробного периода'],
    current: false,
  },
  {
    id: 'max',
    // backend tiers: pro_monthly (+ pro_annual)
    name: 'Max',
    price: '2 990 ₽/мес',
    credits: '106 786 кредитов в месяц',
    note: 'или 23 900 ₽ в год',
    features: ['Максимальный запас кредитов', 'Приоритетная поддержка'],
    current: false,
  },
];

export default function PlanCards({ paymentUrl }) {
  return (
    <section aria-label="Тарифы">
      <h2 className="px-1 text-base font-bold text-[var(--text)]">Тарифы</h2>
      <div className="mt-3 flex flex-col gap-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.id}
            accent={!plan.current && plan.id === 'pro'}
            className="flex flex-col"
          >
            <div className="text-sm font-bold text-[var(--text)]">{plan.name}</div>
            <div className="mt-1 text-lg font-bold text-[var(--text)]">{plan.price}</div>
            <div className="mt-2 text-xs font-semibold text-[var(--text)]">{plan.credits}</div>
            {plan.note && (
              <div className="mt-0.5 text-xs text-[var(--text-secondary)]">{plan.note}</div>
            )}

            <ul className="mt-3 space-y-1 text-xs leading-relaxed text-[var(--text-secondary)]">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>

            <div className="mt-auto pt-4">
              {plan.current ? (
                <Button
                  variant="secondary"
                  disabled
                  className="w-full px-4 py-2.5 text-xs"
                >
                  Текущий тариф
                </Button>
              ) : (
                <ExternalLinkButton href={paymentUrl} className="w-full px-4 py-2.5 text-xs">
                  Выбрать этот тариф
                </ExternalLinkButton>
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
