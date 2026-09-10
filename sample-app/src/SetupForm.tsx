import React, { useState } from 'react';
import {
  DEFAULT_SETTINGS,
  REGION_PRESETS,
  type Product,
  type RegionKey,
  type Settings,
  type Theme,
} from './settings';

type SetupFormProps = {
  initial: Settings;
  onSubmit: (settings: Settings) => void;
  onCancel?: () => void;
};

export const SetupForm = ({ initial, onSubmit, onCancel }: SetupFormProps) => {
  const [form, setForm] = useState<Settings>(initial);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleRegionChange = (region: RegionKey) => {
    const preset = REGION_PRESETS[region];
    setForm((prev) => ({
      ...prev,
      region,
      apiKey: preset.apiKey,
      uploadUrl: preset.uploadUrl,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({
      ...form,
      userId: form.userId.trim() || DEFAULT_SETTINGS.userId,
      displayName: form.displayName.trim(),
      apiKey: form.apiKey.trim(),
      uploadUrl: form.uploadUrl.trim(),
    });
  };

  return (
    <div className="setup">
      <form className="setup__card" onSubmit={handleSubmit}>
        <header className="setup__header">
          <h1>social.plus UIKit sample app</h1>
          <p>
            Renders the UIKit directly from <code>src/</code>. Edit any UIKit file and the change
            shows up here instantly.
          </p>
        </header>

        <fieldset className="setup__group">
          <legend>Product</legend>
          <div className="setup__segmented">
            {(['social', 'chat'] as Product[]).map((product) => (
              <label key={product} data-active={form.product === product}>
                <input
                  type="radio"
                  name="product"
                  value={product}
                  checked={form.product === product}
                  onChange={() => update('product', product)}
                />
                {product === 'social' ? 'Social' : 'Chat'}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="setup__group">
          <legend>User</legend>
          <label className="setup__field">
            <span>User ID</span>
            <input
              value={form.userId}
              onChange={(e) => update('userId', e.target.value)}
              placeholder={DEFAULT_SETTINGS.userId}
              autoComplete="username"
            />
          </label>
          <label className="setup__field">
            <span>Display name (optional)</span>
            <input
              value={form.displayName}
              onChange={(e) => update('displayName', e.target.value)}
              placeholder="Defaults to User ID"
            />
          </label>
        </fieldset>

        <fieldset className="setup__group">
          <legend>Network</legend>
          <label className="setup__field">
            <span>Region</span>
            <select
              value={form.region}
              onChange={(e) => handleRegionChange(e.target.value as RegionKey)}
            >
              {(Object.keys(REGION_PRESETS) as RegionKey[]).map((key) => (
                <option key={key} value={key}>
                  {REGION_PRESETS[key].label}
                </option>
              ))}
            </select>
          </label>
          <label className="setup__field">
            <span>API key</span>
            <input
              value={form.apiKey}
              onChange={(e) => update('apiKey', e.target.value)}
              placeholder="Set STORYBOOK_API_KEY_<REGION> in .env to prefill"
              autoComplete="off"
              spellCheck={false}
            />
          </label>
          <label className="setup__field">
            <span>Upload URL (optional)</span>
            <input
              value={form.uploadUrl}
              onChange={(e) => update('uploadUrl', e.target.value)}
              placeholder="https://upload.sg.amity.co"
              spellCheck={false}
            />
          </label>
        </fieldset>

        <fieldset className="setup__group">
          <legend>Appearance & behaviour</legend>
          <label className="setup__field">
            <span>Theme</span>
            <select value={form.theme} onChange={(e) => update('theme', e.target.value as Theme)}>
              <option value="default">Default (from config)</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <label className="setup__check">
            <input
              type="checkbox"
              checked={form.hideExplore}
              onChange={(e) => update('hideExplore', e.target.checked)}
            />
            Hide Explore tab
          </label>
          <label className="setup__check">
            <input
              type="checkbox"
              checked={form.socialCommunityCreationButtonVisible}
              onChange={(e) => update('socialCommunityCreationButtonVisible', e.target.checked)}
            />
            Show community creation button
          </label>
          <label className="setup__check">
            <input
              type="checkbox"
              checked={form.syncNetworkConfig}
              onChange={(e) => update('syncNetworkConfig', e.target.checked)}
            />
            Sync network config from console
          </label>
        </fieldset>

        <footer className="setup__actions">
          {onCancel && (
            <button type="button" className="btn btn--ghost" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn--primary" disabled={!form.apiKey.trim()}>
            Launch UIKit
          </button>
        </footer>
        {!form.apiKey.trim() && (
          <p className="setup__hint">
            An API key is required. Add it above or set <code>STORYBOOK_API_KEY_SG</code> (or the
            key for your region) in the repo-root <code>.env</code>.
          </p>
        )}
      </form>
    </div>
  );
};
