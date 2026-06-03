# Lint

Runs ESLint + Prettier check on the entire codebase.

```bash
cd /Users/edelgado/Projects/kidsaber-play-app && npm run lint && npm run format:check
```

After running, report:

- Number of ESLint errors and warnings
- Prettier formatting issues (files that need reformatting)
- Specific violations with file paths and line numbers

To auto-fix formatting issues: `npm run format`
