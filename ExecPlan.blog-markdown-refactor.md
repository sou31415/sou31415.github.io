# Blog Markdown Static Pipeline Refactor

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This plan must be maintained in accordance with `.agent/PLANS.md` from the repository root.

## Purpose / Big Picture

After this change, blog posts load faster because Markdown files are converted to HTML once at build time rather than on every request. Authors will place Markdown files in a single content directory, run a generator script, and the blog pages will render instantly from prebuilt JSON. You can see it working by starting the dev server and visiting `/blog/<slug>`; the content should render without runtime Markdown processing and the blog index should list posts from the generated metadata.

## Progress

- [x] (2025-09-27 10:50Z) Capture current repository context, dependencies, and existing blog implementation.
- [x] (2025-09-27 11:40Z) Implement the build-time Markdown pipeline and generated data outputs.
- [x] (2025-09-27 11:42Z) Rewire blog pages to use generated data and remove the old in-memory post model.
- [x] (2025-09-27 11:44Z) Validate with lint/build commands and document how to verify behavior.

## Surprises & Discoveries

- Observation: The generator script needed elevated permissions under the sandbox to create and write `content/blog/generated`.
  Evidence: `EPERM: operation not permitted` on `content/blog/generated/index.json` during `npm run lint`.

## Decision Log

- Decision: Place raw Markdown content under `content/blog` and generated JSON under `content/blog/generated`.
  Rationale: Keeping source content and build artifacts together makes the pipeline explicit and avoids mixing runtime code with large JSON payloads.
  Date/Author: 2025-09-27 / Codex

- Decision: Use `gray-matter` to parse frontmatter and `remark` + `rehype-sanitize` to render safe HTML at build time.
  Rationale: Frontmatter allows metadata for the blog index while the existing Markdown toolchain is already in use and provides a safe, minimal HTML output.
  Date/Author: 2025-09-27 / Codex

- Decision: Always use the first Markdown `#` heading as the post title, even if frontmatter includes a title.
  Rationale: The user requirement specifies the title must come from the first visible heading, so frontmatter is limited to metadata like date and tags.
  Date/Author: 2025-09-27 / Codex

- Decision: Support `content/blog/overrides.json` to override metadata such as date and description at generation time.
  Rationale: Overrides allow manual edits without touching generated JSON, which is regenerated on each dev/build/lint run.
  Date/Author: 2025-09-27 / Codex

- Decision: Allow `readingTime` overrides to align with manual estimates.
  Rationale: Some posts need curated reading time values, so overrides must cover this field too.
  Date/Author: 2025-09-27 / Codex

## Outcomes & Retrospective

The blog now renders from prebuilt JSON generated at build time. Markdown lives in `content/blog`, the generator writes JSON to `content/blog/generated`, and both the blog index and detail pages read from those artifacts. Lint passes after running the generator, and the pipeline is ready for adding Markdown content.

## Context and Orientation

This repository is a Next.js App Router project. Blog pages currently live at `app/blog/page.tsx` (index) and `app/blog/[slug]/page.tsx` (detail). The current blog data is hard-coded in `lib/blog/data/*.ts` and queried via `lib/blog/posts.ts` and `lib/blog/queries.ts`. The blog post view component lives at `app/blog/_components/BlogPostArticle.tsx` and currently renders an array of paragraph strings.

In the new design, raw Markdown files will live in `content/blog/*.md`. A generator script will produce JSON files in `content/blog/generated` so that the app can render blog pages without reading Markdown or running Markdown parsing at request time.

The term “generated JSON” refers to build artifacts created by the generator script, not hand-edited files. The term “frontmatter” refers to a YAML header at the top of a Markdown file between `---` lines used to store metadata such as title, date, description, and tags.

## Plan of Work

First, add a generator script at `scripts/generate-blog.mjs` that reads every `.md` file in `content/blog`, parses frontmatter and the Markdown body, extracts the first `# Heading` as the title (regardless of frontmatter), strips that heading from the body, converts the body to HTML with `remark` and `rehype-sanitize`, computes a simple reading time estimate, and writes two JSON files: `content/blog/generated/index.json` for list metadata, and `content/blog/generated/posts.json` for full post content (including HTML). The script must create the output directory if it does not exist.

Second, define new data access helpers in `lib/blog/index.ts` and adjust `lib/blog/types.ts` so the blog pages consume the generated JSON. `getAllPosts` should return index metadata, `getPostBySlug` should return the full post content, and `getAllSlugs` should be used by `generateStaticParams` in `app/blog/[slug]/page.tsx`.

Third, update `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, and `app/blog/_components/BlogPostArticle.tsx` so they render from the generated data. The detail page should call `notFound()` when a slug does not exist, render `post.html` via `dangerouslySetInnerHTML`, and show the post title from metadata. The index page should render the list using the generated metadata. Remove usage of the old `lib/blog/posts.ts`, `lib/blog/queries.ts`, and `lib/blog/data/*` by deleting those files if they are no longer referenced.

Finally, add npm scripts to run the generator before `dev`, `build`, and `lint` so generated data always exists. Optionally ignore `content/blog/generated` in `.gitignore` so artifacts are not committed.

## Concrete Steps

Run the generator script and lint from the repository root:

    cd /Users/sotarofurukawa/page
    npm run generate:blog
    npm run lint

Expected output includes a generated `content/blog/generated/index.json` and `content/blog/generated/posts.json`, plus successful lint output:

    > sou31415-github-io@1.0.0 lint
    > next lint
    ✔ No ESLint warnings or errors

## Validation and Acceptance

Start the dev server and confirm behavior:

    cd /Users/sotarofurukawa/page
    npm run dev

Then:

1. Create a Markdown file at `content/blog/example.md` with a leading `# Title`.
2. Run `npm run generate:blog`.
3. Visit `http://localhost:3000/blog/example` and confirm the page shows the title and rendered HTML body.
4. Visit `http://localhost:3000/blog/not-exist` and confirm a 404 page is shown.
5. Visit `http://localhost:3000/blog` and confirm the post appears in the list with metadata from frontmatter.

## Idempotence and Recovery

The generator script is safe to run repeatedly and will overwrite the JSON outputs each time. If the generated files are deleted, rerunning `npm run generate:blog` restores them. If the output format changes, delete the `content/blog/generated` directory and rerun the generator to ensure a clean rebuild.

## Artifacts and Notes

Example frontmatter for a Markdown file (note that title is taken from the first `#` heading, not frontmatter):

    ---
    date: 2024-01-01
    description: Short summary for the blog index.
    tags:
      - nextjs
      - markdown
    ---
    # Example Post

    Body content goes here.

## Interfaces and Dependencies

Add the dependency `gray-matter` to parse frontmatter in `scripts/generate-blog.mjs`. Continue using `remark`, `remark-parse`, `remark-rehype`, `rehype-sanitize`, and `rehype-stringify` for Markdown-to-HTML conversion.

Define the following types in `lib/blog/types.ts`:

    export type BlogPost = {
      slug: string;
      title: string;
      description: string;
      date: string;
      readingTime: string;
      tags: string[];
      html: string;
    };

Define the following functions in `lib/blog/index.ts`:

    export function getAllPosts(): BlogPostSummary[];
    export function getPostBySlug(slug: string): BlogPost | undefined;
    export function getAllSlugs(): string[];

Where `BlogPostSummary` matches the metadata fields returned in `content/blog/generated/index.json`.

Change Log: Initial plan created to support a build-time Markdown pipeline and refactor blog pages to use generated data.
Change Log: Updated progress, recorded the sandbox write permission discovery, and noted completion of the generator and blog rewiring.
Change Log: Added overrides.json support to preserve manual metadata edits across regeneration.
Change Log: Added readingTime override support in the generator.
