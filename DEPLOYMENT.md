# Deploying SkyLetter outside Lovable

Your project currently builds for **Cloudflare Workers** (see `wrangler.jsonc`
+ `src/server.ts`). The Lovable preview depends on that config, so do **not**
edit `vite.config.ts` inside Lovable — instead, push to GitHub and modify the
config in your fork.

The Supabase backend is **always** the same database (hosted by Lovable
Cloud). Your Netlify or Cloudflare frontend just talks to it over HTTPS using
the publishable key — share links keep working everywhere because each
`/sky/:shareId` row is fetched by ID from that single Supabase database.

---

## Step 0 — One-time setup (do this once, regardless of host)

1. Click the GitHub button in Lovable → **Connect to GitHub** → push the repo.
2. Clone it locally: `git clone <your-repo-url> && cd <repo>`.
3. Install: `bun install` (or `npm install`).
4. Copy the values from `.env` (already in the repo) — you'll paste these
   into Netlify/Cloudflare env settings.

Required env vars for any host:

| Variable | Value | Where used |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://bibqnvhbwkwqpuyrycko.supabase.co` | Browser bundle |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | (anon key from `.env`) | Browser bundle |
| `VITE_SUPABASE_PROJECT_ID` | `bibqnvhbwkwqpuyrycko` | Browser bundle |
| `SUPABASE_URL` | same as VITE_SUPABASE_URL | Server (SSR) |
| `SUPABASE_PUBLISHABLE_KEY` | same as VITE_SUPABASE_PUBLISHABLE_KEY | Server (SSR) |

> `SUPABASE_SERVICE_ROLE_KEY` is **only needed if you ever add admin server
> functions**. SkyLetter currently only uses the publishable key, so you can
> skip it.

---

# Option A — Deploy to Netlify

### 1. Replace `vite.config.ts`

The Lovable wrapper (`@lovable.dev/vite-tanstack-config`) hard-codes the
Cloudflare adapter. On your local fork, replace the file with:

```ts
// vite.config.ts (Netlify version)
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({
      target: "netlify",
      customViteReactPlugin: true,
      server: { entry: "./src/server.ts" },
    }),
    viteReact(),
  ],
  resolve: {
    alias: { "@": "/src" },
    dedupe: ["react", "react-dom", "@tanstack/react-router"],
  },
});
```

### 2. Remove the Cloudflare bits

Delete (or just leave alone — they're ignored):
- `wrangler.jsonc`

The `src/server.ts` file is fine to keep — TanStack Start's Netlify adapter
imports it as the SSR entry.

### 3. Update dependencies

```bash
bun remove @cloudflare/vite-plugin @lovable.dev/vite-tanstack-config
bun add -d @tanstack/react-start-plugin
```

### 4. Push, then connect on Netlify

1. Commit + push to GitHub.
2. Go to <https://app.netlify.com> → **Add new site → Import from Git**.
3. Pick your repo. Netlify auto-detects:
   - **Build command**: `bun run build` (or `npm run build`)
   - **Publish directory**: leave default — TanStack's Netlify adapter writes
     to `.netlify/`.
4. Click **Show advanced** → **Add environment variables** → paste all 5
   variables from Step 0.
5. **Deploy site**.

### 5. Verify share links work

After deploy, open a sky you created (e.g.
`https://your-site.netlify.app/sky/abc123`) **directly in a fresh tab**.
You should see the cinematic intro → sky reveal → letter.

If you get a 404: in Netlify dashboard → **Site Settings → Build & Deploy →
Functions** — confirm the SSR function deployed. The TanStack adapter handles
`/sky/:shareId` SSR automatically; you do **not** need a `_redirects` file.

### 6. (Optional) Custom domain

Netlify dashboard → **Domain management → Add custom domain**. DNS records
are shown step-by-step.

---

# Option B — Deploy to Cloudflare (Pages or Workers)

Your project is **already configured for Cloudflare Workers** — this is the
shortest path.

### 1. Keep `vite.config.ts` as-is

No changes needed. The current `@lovable.dev/vite-tanstack-config` builds a
Cloudflare Worker bundle.

### 2. Install Wrangler and login

```bash
bun add -d wrangler
bunx wrangler login
```

### 3. Set environment variables (secrets)

```bash
bunx wrangler secret put VITE_SUPABASE_URL
bunx wrangler secret put VITE_SUPABASE_PUBLISHABLE_KEY
bunx wrangler secret put VITE_SUPABASE_PROJECT_ID
bunx wrangler secret put SUPABASE_URL
bunx wrangler secret put SUPABASE_PUBLISHABLE_KEY
```

Paste each value when prompted.

> Note: `VITE_*` vars are normally inlined at build time. To make them
> available during the Cloudflare build, also create a `.dev.vars` file
> locally **(do not commit)** with the same values, OR set them in the
> Cloudflare dashboard under **Workers → your-worker → Settings → Variables
> → Environment Variables** before triggering the production build.

### 4. Build and deploy

```bash
bun run build
bunx wrangler deploy
```

Wrangler reads `wrangler.jsonc` (already in your project) and ships the
Worker. You'll get a URL like `https://tanstack-start-app.<account>.workers.dev`.

### 5. Verify share links

Open `https://your-worker-url/sky/abc123` directly. Worker SSR handles every
route — including dynamic share IDs — without rewrites or redirects.

### 6. Connect to GitHub for auto-deploys (recommended)

Cloudflare dashboard → **Workers & Pages → Create → Connect to Git** →
select your repo. Build command: `bun run build`. Set the same env vars in
the dashboard's **Variables** tab. Every push to `main` redeploys.

### 7. Custom domain

Cloudflare dashboard → your Worker → **Settings → Triggers → Custom
Domains → Add Custom Domain**. If your domain is already on Cloudflare DNS,
it's a single click.

---

## Why share links "just work" on both

`/sky/$shareId` is a TanStack Start route with an SSR loader that queries
Supabase by `share_id`. As long as:

1. The host runs the SSR function (Netlify Functions or Cloudflare Worker), and
2. The two `VITE_SUPABASE_*` vars are present at build time,

…anyone opening `your-domain.com/sky/<id>` will hit the SSR handler, the
loader fetches the row from Supabase, and the page renders. No client-side
session is required because the `skies` table's RLS policy is
`SELECT … USING (true)`.

## Troubleshooting

**Share link shows a 404 page**
The SSR function didn't deploy. On Netlify, check the build log for
`@netlify/functions` output. On Cloudflare, ensure `wrangler deploy`
succeeded.

**Share link shows "Missing Supabase environment variable(s)"**
The `VITE_*` env vars weren't set at build time. Set them in the host's
dashboard and trigger a rebuild — they're inlined into the bundle, so a
runtime change isn't enough.

**CORS errors**
Supabase's publishable key allows requests from any origin by default. If
you see CORS errors, you're probably calling Supabase from a server route
without using `@/integrations/supabase/client` — switch to that import.
