# TByteNews

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://example.com)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](./package.json)
[![License](https://img.shields.io/badge/license-ISC-lightgrey)](./LICENSE)
[![Supabase](https://img.shields.io/badge/backend-Supabase-3ddc84)](https://supabase.com)
[![Tech Stack](https://img.shields.io/badge/stack-Next.js%20|%20TypeScript%20|%20Tailwind-1674FF)](#)

Short description
-----------------
TByteNews is a modern news publishing and admin panel web application built with Next.js, TypeScript and Supabase. It focuses on a simple editorial flow (create / edit / publish), file uploads (server-side), and multi-language support (EN/VI).

Table of Contents
-----------------
- [Quick badges & status](#short-description)
- [Requirements](#requirements)
- [Getting started](#getting-started)
  - [Clone & install](#clone--install)
  - [Local dev](#local-dev)
- [Configuration](#configuration)
- [Project structure](#project-structure)
- [Usage examples](#usage-examples)
  - [Fetch posts (client)](#fetch-posts-client)
  - [Upload image (server endpoint)](#upload-image-server-endpoint)
- [Testing](#testing)
- [Deployment](#deployment)
- [Architecture overview](#architecture-overview)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Authors & contact](#authors--contact)
- [FAQ / Troubleshooting / Security notes](#faq--troubleshooting--security-notes)

Requirements
------------
- Node.js (LTS recommended, >= 18)
- npm or yarn (npm >= 8 recommended)
- A Supabase project (for Auth, Storage, Postgres)
- Git

Getting started
---------------
Clone & install
1. Clone
   ```bash
   git clone <repository-url>
   cd TByteNews
   ```
2. Install
   ```bash
   npm install
   ```

Local dev
- Development server runs on port 4000 (see package.json).
  ```bash
  npm run dev
  # Open http://localhost:4000
  ```
- Build / production:
  ```bash
  npm run build
  npm run start
  ```

Configuration
-------------
This project uses environment variables. Create a `.env` file in the repo root (do NOT commit secrets).

Required env variables
- NEXT_PUBLIC_SUPABASE_URL — Supabase project URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY — Supabase anon/public key (browser)
- SUPABASE_SERVICE_ROLE_KEY — Supabase service role key (server-only, keep secret)

Example .env (replace values)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
SUPABASE_SERVICE_ROLE_KEY=service-role-key
```

Important: SUPABASE_SERVICE_ROLE_KEY must be set in the hosting environment for serverless functions only (never commit to Git).

Project structure
-----------------
Top-level (relevant files & folders)
- .env, package.json, tsconfig.json, tailwind.config.js, postcss.config.js
- src/
  - components/ — UI, Admin modals, Editor, Layout, Main, icons, ui primitives
  - pages/ — Next.js pages and API routes
    - api/upload.ts — server upload endpoint
    - admin/* — admin UI (login, dashboard)
    - posts/[id].tsx — post detail
  - styles/ — CSS modules + global.css (Tailwind)
  - utils/
    - supabaseClient.ts — browser Supabase client
    - fetchAdminProfile.ts — admin profile helpers + local cache
  - locales/ — i18n loader & JSON files (en / vi)
  - constants/, hooks/, types/
- public/ — static assets (e.g., profile-image.jpg)
- .next/ — build output (ignored in git)

Usage examples
--------------
Fetch posts (client)
```ts
// src/pages/index.tsx (example)
const { data } = await supabase
  .from('posts')
  .select('*')
  .order('created_at', { ascending: false });
```

Upload image (server endpoint)
- Frontend should POST multipart/form-data to `/api/upload` (see `src/pages/api/upload.ts`).
- Server handler uses SUPABASE_SERVICE_ROLE_KEY to save files to Supabase Storage (bucket: e.g., `post-images`).

Sample curl (illustrative — adapt to your frontend)
```bash
curl -X POST http://localhost:4000/api/upload \
  -F "file=@./image.jpg"
```

Authentication and admin flows
- Admin login: `src/pages/admin/login.tsx` uses Supabase Auth (email/password).
- Password reset: `src/pages/reset-password.tsx` uses `supabase.auth.updateUser`.
- Admin profile: read/write to `admin_profile` table with helper functions in `src/utils/fetchAdminProfile.ts`.

Testing
-------
- There are no unit/integration tests configured by default.
- Suggested setup:
  - Jest + React Testing Library for components
  - Playwright / Cypress for E2E
- Example (add to project):
  ```bash
  npm install --save-dev jest @testing-library/react @testing-library/jest-dom
  ```
- Add a coverage step in CI (nyc or jest coverage).

Deployment
----------
- Vercel: recommended for Next.js. Set environment variables in the Vercel dashboard (include SUPABASE_SERVICE_ROLE_KEY for serverless functions if your upload endpoint runs server-side).
- Docker (example)
  - Create a Dockerfile that runs `npm run build` and `npm run start`.
  - Use a multi-stage build for smaller images.
- CI/CD:
  - Run lint, tests and build in CI.
  - Ensure secrets (service role key) are stored securely in CI/host.

Architecture overview
---------------------
High level modules:
- pages/ — Next.js page-level routing + API (serverless) endpoints
- components/ — Presentational & container components (Admin modals, Editor, UI primitives)
- utils/ — Shared logic (Supabase client, profile fetch/update)
- styles/ — Tailwind + CSS modules for scoped styles
- locales/ — Simple translation loader with TranslationProvider

Mermaid flow (simple)
```mermaid
flowchart LR
  Browser -->|GET /| NextJS[Next.js App]
  NextJS -->|RPC/SQL| SupabaseDB[(Supabase Postgres)]
  NextJS -->|Storage API| SupabaseStorage[(Supabase Storage)]
  AdminUI --> NextJS
  UploadAPI[/api/upload] --> SupabaseStorage
```

Security notes
- Never commit `.env` or service-role keys. Use host/CI secret stores.
- Sanitize rich content before saving/rendering. Rich text is sanitized in editor modals via DOMPurify (isomorphic-dompurify).
- Keep Supabase RLS and policies configured appropriately.

Roadmap
-------
Current features
- Public listing of posts
- Post detail with sanitized rich content
- Admin panel: create/edit/delete posts, upload thumbnails, admin profile
- i18n (English & Vietnamese)
- Server upload endpoint for files (Supabase Storage)

Planned
- Add tests (unit + e2e)
- CI integration (GitHub Actions)
- Image optimization + CDN support
- Role-based admin access & audit logs
- Drafts, scheduled publishing, tags & categories
- SSO providers (GitHub, Google)

Contributing
------------
Guidelines for contributors:
- Follow TypeScript + React patterns used in repo.
- Keep components small and accessible (a11y).
- Coding style: use Prettier + ESLint (add configs if you introduce them).
- Commit messages: use Conventional Commits (feat:, fix:, docs:, chore:, refactor:, style:, test:, perf:)
- PRs:
  - One feature per PR.
  - Include description, screenshots and steps to test.
  - Link related issue(s).
  - Ensure CI passes and include tests for new functionality.

Suggested PR checklist
- [ ] Builds successfully (npm run build)
- [ ] Lint (if configured)
- [ ] Tests added / updated
- [ ] Documentation updated (README or inline)

License
-------
This repository uses the ISC license (see package.json). Replace with your preferred license file if needed.

Authors & contact
-----------------
- Maintainers: repository owner (update links below)
- GitHub: https://github.com/yourusername
- Email: replace-with-maintainer@example.com

FAQ / Troubleshooting
---------------------
Q: I see blank pages or build errors?
A: Ensure Node.js version matches LTS, run `npm install` and check `.env` values. Run `npm run build` locally to reproduce build-time errors.

Q: Uploads fail with permission errors?
A: Confirm SUPABASE_SERVICE_ROLE_KEY is present in server environment and the Storage bucket policy allows service role writes.

Changelog & Security
--------------------
- Keep a CHANGES.md or use GitHub releases for notable changes.
- Report security issues to repository owner privately; do not disclose secrets or exploit details publicly.

Notes
-----
- This README is intentionally concise and focused for contributors and operators. Extend with diagrams, example screenshots and a CONTRIBUTING.md when the project matures.