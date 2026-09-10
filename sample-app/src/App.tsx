import React, { useCallback, useMemo, useState } from 'react';
// Resolves to ../src/index.ts via the Vite alias, so this is the exact public API an
// integrator uses, but served from source with hot module replacement.
import {
  AmityUiKitProvider,
  AmityUiKitSocial,
  AmityUiKitChatV4,
} from '@amityco/ui-kit-open-source';
import type { AmityUIKitConfig } from '~/v4/core/providers/AmityUIKitProvider';
import amityConfig from '../../amity-uikit.config.json';

import { SetupForm } from './SetupForm';
import {
  DEFAULT_SETTINGS,
  clearSettings,
  loadSettings,
  resolveConnection,
  saveSettings,
  type Settings,
} from './settings';

const App = () => {
  const [settings, setSettings] = useState<Settings | null>(() => loadSettings());
  const [editing, setEditing] = useState(false);
  // Bump to force a full remount of the provider (fresh SDK session) without reloading the tab.
  const [session, setSession] = useState(0);

  const handleSubmit = useCallback((next: Settings) => {
    saveSettings(next);
    setSettings(next);
    setEditing(false);
    setSession((s) => s + 1);
  }, []);

  const handleLogout = useCallback(() => {
    clearSettings();
    setSettings(null);
    setEditing(false);
  }, []);

  const configs = useMemo<AmityUIKitConfig | undefined>(() => {
    if (!settings) return undefined;
    const base = amityConfig as unknown as AmityUIKitConfig;
    return settings.theme === 'default' ? base : { ...base, preferred_theme: settings.theme };
  }, [settings]);

  if (!settings || editing) {
    return (
      <SetupForm
        initial={settings ?? DEFAULT_SETTINGS}
        onSubmit={handleSubmit}
        onCancel={settings ? () => setEditing(false) : undefined}
      />
    );
  }

  const { apiKey, apiRegion, apiEndpoint } = resolveConnection(settings);

  return (
    <div className="app">
      <div className="app__uikit">
        <AmityUiKitProvider
          key={`${session}-${apiRegion}-${settings.userId}-${settings.product}`}
          apiKey={apiKey}
          apiRegion={apiRegion}
          apiEndpoint={apiEndpoint}
          userId={settings.userId}
          displayName={settings.displayName || settings.userId}
          configs={configs}
          hideExplore={settings.hideExplore}
          socialCommunityCreationButtonVisible={settings.socialCommunityCreationButtonVisible}
          syncNetworkConfig={settings.syncNetworkConfig}
          onConnectionStatusChange={(state) => console.log('[sample-app] session state', state)}
          onConnected={() => console.log('[sample-app] connected')}
          onDisconnected={() => console.log('[sample-app] disconnected')}
        >
          {settings.product === 'chat' ? <AmityUiKitChatV4 /> : <AmityUiKitSocial />}
        </AmityUiKitProvider>
      </div>

      <div className="devbar" role="toolbar" aria-label="Sample app controls">
        <span className="devbar__label">
          {settings.product === 'chat' ? 'Chat' : 'Social'} · {settings.userId} ·{' '}
          {apiRegion.toUpperCase()}
        </span>
        <button type="button" className="btn btn--small" onClick={() => setSession((s) => s + 1)}>
          Remount
        </button>
        <button type="button" className="btn btn--small" onClick={() => setEditing(true)}>
          Settings
        </button>
        <button type="button" className="btn btn--small btn--ghost" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
};

export default App;
