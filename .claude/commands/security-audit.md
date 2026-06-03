# Security Audit

You are a **senior application security engineer** specializing in React Native / Expo mobile apps.
Perform a **thorough, structured security audit** of this codebase. This app handles data from
children aged 6–10 (primary-school students), so child-data privacy risks carry extra weight.

---

## 1 — Dependency vulnerability scan

```bash
cd /Users/edelgado/Projects/kidsaber-play-app && npm audit --json 2>/dev/null | node -e "
const d=require('fs').readFileSync('/dev/stdin','utf8');
const r=JSON.parse(d);
const vulns=r.vulnerabilities||{};
const entries=Object.entries(vulns);
if(!entries.length){console.log('✅ No vulnerabilities found');process.exit(0);}
entries.forEach(([pkg,v])=>{
  console.log(\`[\${v.severity.toUpperCase()}] \${pkg} — \${v.via?.map?.(x=>typeof x==='string'?x:x.title).join(', ')||v.fixAvailable||'see npm audit'}\`);
});
console.log(\`\nTotal: \${r.metadata?.vulnerabilities?.total??entries.length} packages affected\`);
"
```

Report: total count by severity (critical / high / moderate / low), which packages and whether a fix is available.

---

## 2 — Secret & env-var exposure

Analyse these areas manually (read the relevant files):

### 2a. `EXPO_PUBLIC_*` variables embedded in the JS bundle

- Read `src/infrastructure/config/env.ts` and `src/data/api/httpClient.ts`.
- `EXPO_PUBLIC_API_KEY` is bundled into the JS bundle at build time and is **readable by anyone
  who extracts the APK/IPA**. Flag this with severity and propose mitigations
  (e.g. short-lived tokens, backend proxy, server-side auth).

### 2b. `.env` / `.env.local` committed by mistake

```bash
cd /Users/edelgado/Projects/kidsaber-play-app && git log --all --oneline --diff-filter=A -- '.env' '.env.local' '.env.production'
git grep -rn --include="*.ts" --include="*.tsx" --include="*.js" \
  "EXPO_PUBLIC_API_KEY\s*=\s*['\"][^'\"]" 2>/dev/null || true
```

### 2c. Hard-coded secrets / tokens anywhere in source

```bash
cd /Users/edelgado/Projects/kidsaber-play-app && grep -rn \
  --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" \
  -E "(password|secret|apikey|api_key|token|bearer)\s*[:=]\s*['\"][^'\"]{6,}" \
  src/ app/ 2>/dev/null | grep -iv "example\|placeholder\|your_\|<\|TODO" || echo "Nothing found"
```

---

## 3 — Transport security (HTTPS enforcement)

Read `src/infrastructure/config/env.ts` and evaluate:

- The HTTPS guard throws only when `process.env.NODE_ENV === 'production'`. In Expo, `NODE_ENV`
  can be `'development'` even in a release build if the env is not configured correctly.
  Confirm whether this guard is reliable or whether it should use `__DEV__` or `expo-constants`
  `expoConfig.extra` instead.
- Verify `httpClient.ts` never falls back to plain HTTP.

---

## 4 — AsyncStorage data security (child data at rest)

Read `src/data/storage/AsyncStorageAdapter.ts` and `src/data/storage/StorageKeys.ts`.

- **AsyncStorage is unencrypted on both Android and iOS** by default. Stored profile names,
  grade levels, and progress belong to children. Flag this.
- Suggest `expo-secure-store` for sensitive fields (active profile ID, schema version) or a
  library like `react-native-encrypted-storage` if full encryption is needed.
- Check whether `DeleteProfile` use case (`src/domain/usecases/profile/DeleteProfile.ts`) also
  wipes the associated progress data — orphaned records are a data-minimisation violation under
  GDPR/COPPA.

---

## 5 — Input validation & injection

```bash
cd /Users/edelgado/Projects/kidsaber-play-app && grep -rn \
  --include="*.ts" --include="*.tsx" \
  "dangerouslySetInnerHTML\|innerHTML\|eval(\|new Function(" \
  src/ app/ 2>/dev/null || echo "Nothing found"
```

Also read `src/domain/usecases/profile/CreateProfile.ts` and `src/domain/usecases/profile/UpdateProfile.ts`:

- Are profile names (user-supplied) length-limited and sanitised before storage?
- Are numeric fields (grade, age) range-validated?
- Are question answers validated client-side against `correctAnswers` (array) — never a
  server-side bypass?

---

## 6 — API request security

Read `src/data/api/httpClient.ts` and `src/data/api/questionsApi.ts`:

- Is `Authorization: Bearer` header sent only when `API_KEY` is non-empty? Sending an empty
  `Bearer ` header may cause unintended 401s or expose the header unnecessarily.
- Are query parameters for `subject`, `grade`, `type` sanitised / allow-listed before being
  interpolated into the URL? Check for open-redirect or parameter-injection risk.
- Confirm there is no logging of the `Authorization` header value (log scraping risk).

---

## 7 — Deep-link / URL-scheme validation

```bash
cd /Users/edelgado/Projects/kidsaber-play-app && cat app.json 2>/dev/null | \
  python3 -c "import json,sys; d=json.load(sys.stdin); \
  s=d.get('expo',d).get('scheme','not set'); print('Scheme:',s)"
grep -rn "Linking\|useURL\|handleOpenURL\|scheme" \
  --include="*.ts" --include="*.tsx" src/ app/ 2>/dev/null | head -20 || echo "Nothing found"
```

- Expo Router deep links can be crafted to navigate to any route. Are there routes that accept
  parameters from the URL that are used without validation (e.g. profile IDs, question types)?

---

## 8 — Dependency pinning & supply-chain

```bash
cd /Users/edelgado/Projects/kidsaber-play-app && \
  node -e "
const pkg = require('./package.json');
const all = {...pkg.dependencies, ...pkg.devDependencies};
const unpinned = Object.entries(all).filter(([,v]) => v.startsWith('^') || v.startsWith('~') || v === '*');
if (!unpinned.length) { console.log('All dependencies pinned'); process.exit(0); }
unpinned.forEach(([k,v]) => console.log(\`UNPINNED  \${k}: \${v}\`));
console.log(\`\n\${unpinned.length} unpinned dependencies (^/~ ranges allow silent upgrades)\`);
"
```

Flag any unpinned runtime dependencies that are externally reachable (API client, storage) as
medium severity supply-chain risk. Suggest a lock-file-only CI install (`npm ci`).

---

## 9 — CI/CD secrets handling

```bash
cd /Users/edelgado/Projects/kidsaber-play-app && cat .github/workflows/ci.yml 2>/dev/null; \
  cat .github/workflows/deploy.yml 2>/dev/null
```

- Are secrets injected via GitHub Secrets (never hard-coded in YAML)?
- Is `npm ci` used (not `npm install`) to enforce lock-file?
- Are EAS secrets managed via `eas secret:create` (not committed `.env.production`)?

---

## 10 — `app.json` / `eas.json` misconfiguration

```bash
cd /Users/edelgado/Projects/kidsaber-play-app && \
  cat app.json 2>/dev/null && echo "---" && cat eas.json 2>/dev/null
```

Check for:

- `expo.android.package` / `expo.ios.bundleIdentifier` set to production values.
- `expo.updates.enabled` — if OTA updates are on, confirm code-signing is configured to prevent
  malicious OTA injection.
- `expo.android.permissions` — are only the minimum required permissions declared?

---

## Reporting format

After running all checks above, produce a **structured report** using this template:

```
## KidSaber Play — Security Audit Report
Date: <today>

### Summary
| Severity | Count |
|----------|-------|
| Critical |       |
| High     |       |
| Medium   |       |
| Low      |       |
| Info     |       |

---

### Findings

#### [SEV-01] <Title> · Severity: CRITICAL / HIGH / MEDIUM / LOW / INFO
**Category:** Secrets | Transport | Storage | Validation | Supply-chain | Config | Privacy
**File(s):** `path/to/file.ts:line`
**Description:** What the problem is and why it matters.
**Impact:** Concrete harm if exploited (data breach, impersonation, …).
**Recommendation:** Specific, actionable fix with code snippet where helpful.

(repeat for each finding)

---

### Not found / verified OK
- List checks that passed cleanly.

### Out of scope for this audit
- Server-side API security, infrastructure, backend authentication.
```

Be precise. Do not invent findings — only report what the code actually shows.
If a check produces no output, mark it as **✅ OK**.
Prioritise findings that directly affect child data (GDPR / COPPA sensitivity).
