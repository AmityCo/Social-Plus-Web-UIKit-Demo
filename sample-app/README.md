# Sample app (live-linked to the UIKit source)

A small React app that embeds the UIKit the way a customer would, but served straight from
`../src` by Vite. Edit any UIKit component or CSS module and the browser updates in place through
hot module replacement, no build, no Storybook.

## Run

From the repo root:

```sh
pnpm install
pnpm dev
```

The app opens at http://localhost:5173. On first load a setup screen asks for a user ID, region and
API key. Those values are saved in `localStorage`, so you stay logged in across reloads. Use the
floating bar in the bottom-right corner to remount the UIKit, change settings, or log out.

## Configuration

The sample reads the same `.env` file (repo root) that Storybook uses, so nothing extra is needed
if you already have one. Relevant keys:

| Variable                        | Purpose                                                              |
| ------------------------------- | -------------------------------------------------------------------- |
| `STORYBOOK_DEFAULT_REGION`      | Region preselected on the setup screen (`sg`, `eu`, `us`, `staging`) |
| `STORYBOOK_API_KEY_<REGION>`    | API key prefilled when that region is selected                       |
| `STORYBOOK_UPLOAD_URL_<REGION>` | Optional upload URL for that region                                  |
| `STORYBOOK_SDK_REGION_STAGING`  | Cluster name for the custom staging region                           |
| `STORYBOOK_USER_1`              | Default user ID (falls back to `Web-Test`)                           |

Anything typed into the setup form overrides the `.env` defaults.

## How the live link works

- [vite.config.ts](./vite.config.ts) aliases `@amityco/ui-kit-open-source` to `../src/index.ts`
  and enables the `~/*` path alias from the root `tsconfig.json`, so the UIKit is part of the
  app's module graph rather than a prebuilt package.
- `@vitejs/plugin-react` provides React Fast Refresh for every UIKit component. CSS modules
  hot-swap without a reload.
- The app is type-checked by the root `tsconfig.json` (it includes `**/*.tsx`), so `pnpm tsc`
  covers it too.

## Production build (optional)

```sh
pnpm dev:build
pnpm dev:preview
```

Output goes to `sample-app/dist/` (git-ignored).
