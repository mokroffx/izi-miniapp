// App shell: one bootstrap fetch (config + me + skills), then either the
// not-connected screen or the two-tab layout. Tabs are local state rather
// than a router — the Mini App has no URLs to speak of and Telegram owns the
// back gesture.
import { useCallback, useEffect, useState } from 'react';
import BottomNav from '@/components/BottomNav';
import HomeScreen from '@/screens/HomeScreen';
import NotConnectedScreen from '@/screens/NotConnectedScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import { friendlyError, getConfig, getMe, getReferral, getSkills } from '@/lib/api';

export default function App() {
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [error, setError] = useState('');
  const [config, setConfig] = useState(null);
  const [me, setMe] = useState(null);
  const [skills, setSkills] = useState([]);
  const [tab, setTab] = useState('home');
  const [referral, setReferral] = useState({ status: 'loading', data: null, error: '' });

  const refreshMe = useCallback(async () => {
    const data = await getMe();
    setMe(data);
    return data;
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Skills is a public static catalog used only to label usage rows on
        // Profile, so a failure there must not block the screen — config and me
        // are the load-bearing calls.
        const [configData, meData, skillsData] = await Promise.all([
          getConfig(),
          getMe(),
          getSkills().catch(() => ({ skills: [] })),
        ]);
        if (cancelled) return;
        setConfig(configData);
        setMe(meData);
        setSkills(skillsData?.skills ?? []);
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
      <main className="mx-auto max-w-md px-4 pb-24 pt-4">
        {tab === 'home' && <HomeScreen me={me} config={config} referral={referral} />}
        {tab === 'profile' && (
          <ProfileScreen me={me} config={config} skills={skills} onRefresh={refreshMe} />
        )}
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
