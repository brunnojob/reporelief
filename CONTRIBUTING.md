# Contributing

Use Node.js 22 or later. No dependency installation is required.

1. Fork and clone the project.
2. Run `npm test` and `npm run check`.
3. Add a small fixture demonstrating the behavior you change.
4. Keep `src/analyze.js` and `docs/analyze.js` identical.
5. Open a pull request explaining the behavior and validation.

Useful first contributions: improve Python test-name matching, add language-specific fixtures, or improve keyboard accessibility. Discuss new rules in an issue before implementation. Avoid claims of measured coverage or automatic correctness.

## Markdown link checks

When changing Markdown link validation:

- Keep `src/markdown-links.js` and `docs/markdown-links.js` identical.
- Add tests for relative paths and source line numbers.
- Check existing image files without treating binary content as source text.
- Do not claim that external URLs, anchors or setup instructions are valid.

Run the example fixture:

    node bin/reporelief.js examples/neglected-repo

Compare its output with `examples/maintenance-plan.md` and update the report when expected behavior changes.
