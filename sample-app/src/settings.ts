/**
 * Connection settings for the sample app.
 *
 * Defaults come from the repo-root `.env` (same STORYBOOK_* variables Storybook uses) and
 * whatever the user last saved is persisted to localStorage so a page reload keeps you logged in.
 */

export type RegionKey = 'staging' | 'sg' | 'eu' | 'us';
export type Product = 'social' | 'chat';
export type Theme = 'default' | 'light' | 'dark';

export type Settings = {
  product: Product;
  userId: string;
  displayName: string;
  region: RegionKey;
  apiKey: string;
  uploadUrl: string;
  theme: Theme;
  hideExplore: boolean;
  socialCommunityCreationButtonVisible: boolean;
  syncNetworkConfig: boolean;
};

type RegionPreset = {
  label: string;
  sdkRegion: string;
  apiKey: string;
  uploadUrl: string;
  /** Custom cluster: needs a full apiEndpoint rather than an SDK region name. */
  custom?: boolean;
};

const env = import.meta.env;

export const REGION_PRESETS: Record<RegionKey, RegionPreset> = {
  staging: {
    label: 'Staging',
    sdkRegion: env.STORYBOOK_SDK_REGION_STAGING || '',
    apiKey: env.STORYBOOK_API_KEY_STAGING || '',
    uploadUrl: env.STORYBOOK_UPLOAD_URL_STAGING || '',
    custom: true,
  },
  sg: {
    label: 'SG',
    sdkRegion: env.STORYBOOK_SDK_REGION_SG || 'sg',
    apiKey: env.STORYBOOK_API_KEY_SG || '',
    uploadUrl: env.STORYBOOK_UPLOAD_URL_SG || '',
  },
  eu: {
    label: 'EU',
    sdkRegion: env.STORYBOOK_SDK_REGION_EU || 'eu',
    apiKey: env.STORYBOOK_API_KEY_EU || '',
    uploadUrl: env.STORYBOOK_UPLOAD_URL_EU || '',
  },
  us: {
    label: 'US',
    sdkRegion: env.STORYBOOK_SDK_REGION_US || 'us',
    apiKey: env.STORYBOOK_API_KEY_US || '',
    uploadUrl: env.STORYBOOK_UPLOAD_URL_US || '',
  },
};

const isRegionKey = (value: string | undefined): value is RegionKey =>
  !!value && value in REGION_PRESETS;

const defaultRegion = ((): RegionKey => {
  const fromEnv = (env.STORYBOOK_DEFAULT_REGION || env.STORYBOOK_API_REGION || '').toLowerCase();
  return isRegionKey(fromEnv) ? fromEnv : 'sg';
})();

// STORYBOOK_USERS is the comma-separated list documented in .env.example; the first entry wins.
const defaultUserId =
  (env.STORYBOOK_USERS || '').split(',')[0].trim() ||
  (env.STORYBOOK_USER_1 || '').trim() ||
  'Web-Test';

export const DEFAULT_SETTINGS: Settings = {
  product: 'social',
  userId: defaultUserId,
  displayName: '',
  region: defaultRegion,
  apiKey: REGION_PRESETS[defaultRegion].apiKey || env.STORYBOOK_API_KEY || '',
  uploadUrl: REGION_PRESETS[defaultRegion].uploadUrl,
  theme: 'default',
  hideExplore: false,
  socialCommunityCreationButtonVisible: true,
  syncNetworkConfig: false,
};

const STORAGE_KEY = 'amity-uikit-sample-app/settings';

export const loadSettings = (): Settings | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    return null;
  }
};

export const saveSettings = (settings: Settings) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // localStorage unavailable (private mode etc.) — settings just won't persist.
  }
};

export const clearSettings = () => {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};

/** Resolve the provider props (region + endpoint) from the saved settings. */
export const resolveConnection = (settings: Settings) => {
  const preset = REGION_PRESETS[settings.region];
  const sdkRegion = preset.sdkRegion || 'sg';
  const uploadUrl = settings.uploadUrl || preset.uploadUrl || undefined;

  const apiEndpoint = preset.custom
    ? {
        http: `https://apix.${sdkRegion}.amity.co`,
        mqtt: `wss://sse.${sdkRegion}.amity.co:443/mqtt`,
        upload: uploadUrl || `https://upload.${sdkRegion}.amity.co`,
      }
    : uploadUrl
      ? { upload: uploadUrl }
      : undefined;

  return {
    apiKey: settings.apiKey || preset.apiKey || env.STORYBOOK_API_KEY || '',
    apiRegion: sdkRegion,
    apiEndpoint,
  };
};
