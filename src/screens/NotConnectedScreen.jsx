// Shown when GET /api/miniapp/me answers { connected: false }.
// No navigation, no tabs, nothing else — the only thing to do here is link the
// Telegram account to an ИзиЧат account in the web dashboard.
import Button from '@/components/Button';
import Card from '@/components/Card';
import { openExternalLink } from '@/telegram/sdk';

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
          <Button
            as="a"
            href={loginUrl || '#'}
            onClick={(e) => {
              e.preventDefault();
              openExternalLink(loginUrl);
            }}
            className="w-full px-5 py-3 text-sm"
          >
            Войти
          </Button>
          <Button
            as="a"
            variant="secondary"
            href={signupUrl || '#'}
            onClick={(e) => {
              e.preventDefault();
              openExternalLink(signupUrl);
            }}
            className="w-full px-5 py-3 text-sm"
          >
            Создать аккаунт
          </Button>
        </div>
      </Card>
    </div>
  );
}
