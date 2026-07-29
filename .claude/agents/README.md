# Project agents

Project-scoped subagents for this Astro blog. They live here (not in `~/.claude/agents/`)
so they travel with the repo and stay scoped to Astro conventions.

| Agent | Use it for |
| --- | --- |
| `astro-expert` | Framework work: setup, content collections, islands, integrations, adapters, routing, config debugging |
| `astro-content-author` | Writing and editing posts; frontmatter that validates against the live Zod schema |
| `astro-seo-engineer` | Sitemap, RSS, canonical, OG tags, JSON-LD, robots.txt — implements and audits |
| `astro-build-auditor` | Read-only audit of `dist/`: shipped JS, image weight, CWV, WCAG |
| `astro-deploy-engineer` | Adapters, host config, CI, redirects, headers, custom domains |
| `blog-ux-designer` | Typography and reading experience, color and dark mode, design tokens, component inventory |
| `es-en-translator` | Spanish ↔ English translation of posts, frontmatter, and UI strings; Astro i18n layouts |

## Installed skills

- `.claude/skills/astro` — Astro quick reference (CLI commands, project structure, adapters)
  from [`astrolicious/agent-skills`](https://github.com/astrolicious/agent-skills). Update with
  `npx -y skills add astrolicious/agent-skills --skill astro --agent claude-code`.

## Already available globally (VoltAgent plugins) — don't duplicate these

Reach for these instead of writing new agents:

- `voltagent-lang:typescript-pro` — type-level work in `src/`
- `voltagent-lang:javascript-pro` — vanilla JS in `<script>` islands
- `voltagent-core-dev:ui-designer` — generic design systems at app scale (`blog-ux-designer` covers this blog)
- `voltagent-biz:ux-researcher` — user research, personas, usability testing (read-only)
- `voltagent-qa-sec:ui-ux-tester` — driving the UI in a browser to find defects
- `voltagent-biz:content-quality-editor` — strips AI writing patterns before publishing
- `voltagent-domains:seo-specialist` — strategy and keyword research (read-only; `astro-seo-engineer` does the implementation)
- `voltagent-qa-sec:accessibility-tester` — deep WCAG work beyond the build audit
- `voltagent-qa-sec:code-reviewer` — pre-merge review
- `voltagent-dev-exp:git-workflow-manager` — branching and release flow

Also useful, as skills rather than agents: `frontend-design` (visual direction),
`dataviz` (charts in posts), `claude-in-chrome` (driving the dev server in a browser).
