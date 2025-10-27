# AGENTS instructions for sou31415.github.io

## Scope
These instructions apply to every file in this repository unless a subdirectory provides its own `AGENTS.md` with more specific guidance.

## Project overview
- This is a Next.js 14 App Router project written in TypeScript and styled with Tailwind CSS.
- The site is deployed on Vercel; prefer solutions that keep pages statically generated whenever possible so that they remain fast and cache-friendly on Vercel's CDN.
- The `app/` directory uses server components by default. Add the `"use client"` directive only when required by React state, effects, or browser-only APIs.

## Development workflow
- Install dependencies with `npm install` and use the bundled npm scripts (`npm run dev`, `npm run lint`, `npm run build`).
- Before opening a pull request, run:
  - `npm run lint`
  - `CI=1 npm run build`
- Keep the codebase free of failing TypeScript checks; prefer explicit types for exported APIs and component props.
- When adding dependencies, ensure they are compatible with Vercel's serverless environment (ESM-friendly, no native binaries unless already supported by Vercel).

## Coding conventions
- Favor named `type` aliases over `interface` unless interface merging is required.
- Keep imports sorted by module specifier (external packages first, then absolute/aliased modules, followed by relative paths). Use newline separation between groups.
- Avoid `console.log` in committed code; use dedicated logging utilities when debugging server code.
- Reuse shared helpers in `lib/` where possible instead of duplicating logic inside components.
- For styles, continue using Tailwind utility classes; avoid adding new global CSS unless a component truly requires it.
- When creating client components, keep them focused and pass serialized props from server components rather than accessing global singletons.

## Next.js & Vercel specifics
- Prefer static rendering: use `generateStaticParams` and `generateMetadata` where appropriate, and avoid dynamic routes without caching unless the feature genuinely requires runtime rendering.
- Use `next/link` and `next/image` for navigation and images to take advantage of Vercel optimizations.
- Store any reusable metadata helpers inside `lib/` (e.g., `lib/blog/metadata.ts`) and import them into pages instead of inlining duplicate objects.
- When touching `next.config.mjs`, confirm that changes are compatible with Vercel's build pipeline (ESM syntax, no unsupported rewrites/headers without documentation).

## Blog content guidelines
- Blog post source files live under `lib/blog/data/`. Each module should export a typed `BlogPost` object.
- Register new posts in `lib/blog/posts.ts` to make them discoverable; keep the list sorted by published date as enforced by the helper.
- Use helpers from `lib/blog/metadata.ts` to build per-post `<head>` metadata instead of duplicating configuration.

## Documentation & assets
- Place user-facing documentation in the `docs/` directory. Keep the README focused on project-wide setup and deployment instructions.
- Optimize images and static assets before committing; prefer modern formats (WebP/AVIF) when practical.

Following these conventions keeps the project healthy and production-ready on Vercel.
