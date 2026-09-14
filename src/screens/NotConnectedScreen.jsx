// Shown when GET /api/miniapp/me answers { connected: false }.
// No navigation, no tabs, nothing else — the only thing to do here is link the
// Telegram account to an ИзиЧат account in the web dashboard.
import Card from '@/components/Card';
import ExternalLinkButton from '@/components/ExternalLinkButton';

export default function NotConnectedScreen({ appUrl }) {
  const loginUrl = appUrl ? `${appUrl}/login` : null;
  const signupUrl = appUrl ? `${appUrl}/signup` : null;

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col justify-center px-4 py-10">
      <Card className="animate-fade-in">
        <h1 className="text-xl font-bold tracking-tight text-[var(--text)]">ИзиЧат</h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
          Подключите Telegram к своему аккаунту ИзиЧат в настройках личного кабинета — тогда здесь
          появятся ваши быстрые действия.
        </p>

        <div className="mt-6 space-y-3">
          <ExternalLinkButton href={loginUrl} className="w-full px-5 py-3 text-sm">
            Войти
          </ExternalLinkButton>
          <ExternalLinkButton
            variant="secondary"
            href={signupUrl}
            className="w-full px-5 py-3 text-sm"
          >
            Создать аккаунт
          </ExternalLinkButton>
        </div>
      </Card>
    </div>
  );
}
