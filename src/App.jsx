// App shell: one bootstrap fetch (config + me), then either the not-connected
// screen or the single home screen. There is no navigation and no router — the
// Mini App is one page and Telegram owns the back gesture.
import { useEffect, useState } from 'react';
import HomeScreen from '@/screens/HomeScreen';
import NotConnectedScreen from '@/screens/NotConnectedScreen';
import { friendlyError, getConfig, getMe, getReferral } from '@/lib/api';

export default function App() {
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [error, setError] = useState('');
  const [config, setConfig] = useState(null);
  const [me, setMe] = useState(null);
  const [referral, setReferral] = useState({ status: 'loading', data: null, error: '' });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [configData, meData] = await Promise.all([getConfig(), getMe()]);
        if (cancelled) return;
        setConfig(configData);
        setMe(meData);
        setStatus('ready');
      } catch (err) {
        if (cancelled) return;
        setError(friendlyError(err));
        setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // The referral link is only fetched once the account is known to be linked —
  // the route 404s otherwise.
  useEffect(() => {
    if (!me?.connected) return;
    let cancelled = false;
    getReferral()
      .then((data) => {
        if (!cancelled) setReferral({ status: 'loaded', data, error: '' });
      })
      .catch((err) => {
        if (!cancelled) setReferral({ status: 'error', data: null, error: friendlyError(err) });
      });
    return () => {
      cancelled = true;
    };
  }, [me?.connected]);

  if (status === 'loading') {
    return (
      <div className="mx-auto flex min-h-full max-w-md flex-col gap-3 px-4 py-6" aria-hidden="true">
        <div className="h-7 w-40 animate-pulse rounded-full bg-[var(--surface-2)]" />
        <div className="h-40 animate-pulse rounded-2xl bg-[var(--surface-2)]" />
        <div className="h-56 animate-pulse rounded-2xl bg-[var(--surface-2)]" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="mx-auto flex min-h-full max-w-md flex-col justify-center px-4 py-10 text-center">
        <p className="text-sm text-[var(--text-secondary)]">{error}</p>
      </div>
    );
  }

  if (!me?.connected) {
    return <NotConnectedScreen appUrl={config?.appUrl} />;
  }

  return (
    <div className="min-h-full">
      <main className="mx-auto max-w-md px-4 pb-10 pt-4">
        <HomeScreen me={me} config={config} referral={referral} />
      </main>
    </div>
  );
}
