<!-- AI Reference: Internationalization (i18n) Guide for eVisit UI -->
<!-- Used by: Claude Code, Cursor, Copilot, Codex -->
<!-- Last verified against: src/ev-i18n/ -->

# Internationalization (i18n) Guide

Stack: i18next, react-i18next, i18next-resources-to-backend, Lokalise (external).

---

## Core Rules

1. **All user-visible strings MUST be wrapped with `t()`** -- enforced by ESLint `i18next/no-literal-string`
2. **Import from `ev-i18n`** (NOT from `react-i18next` directly) -- enforced by ESLint `no-restricted-imports`
3. **Flat key format** -- no nesting, keys are the English strings themselves
4. 16 supported locales: en, es, fr, ar, bn, hi, ht_HT, ko, pl, ru, sq, ur, yue, zh_CN, zh_TW, zu

---

## Imports

```tsx
// CORRECT
import { useTranslation, Trans } from 'ev-i18n';
import { nt } from 'ev-i18n';

// WRONG -- ESLint error
import { useTranslation } from 'react-i18next';
```

What `ev-i18n/index.ts` exports:

| Export               | Purpose                                                                      |
| -------------------- | ---------------------------------------------------------------------------- |
| `useTranslation`     | Hook to get `t()` function (re-exported from react-i18next)                  |
| `Trans`              | Component for complex translations with JSX (re-exported from react-i18next) |
| `nt`                 | "No translate" -- identity function for ESLint suppression                   |
| `useLanguageUpdater` | Hook for updating language preference                                        |

---

## Using `t()` in Components

```tsx
import { useTranslation } from 'ev-i18n';

const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('Patient Details')}</h1>
      <p>{t('Welcome back, {{name}}', { name: userName })}</p>
      <Button id="save" label={t('Save Changes')} />
    </div>
  );
};
```

### Interpolation

```tsx
// Simple variable
t('Hello, {{name}}', { name: 'John' });

// Count-based pluralization
t('{{count}} patient', { count: 5 }); // Needs plural key in JSON

// Multiple variables
t('{{provider}} scheduled a visit for {{patient}}', {
  provider: providerName,
  patient: patientName,
});
```

### Trans component (JSX inside translations)

```tsx
import { Trans, useTranslation } from 'ev-i18n';

const Notice = () => {
  const { t } = useTranslation();

  return (
    <Trans i18nKey="Please read our <link>terms</link> before proceeding">
      Please read our <a href="/terms">terms</a> before proceeding
    </Trans>
  );
};
```

---

## The `nt()` Function

`nt()` is `lodash.identity` -- it returns its argument unchanged. It exists solely to satisfy the `i18next/no-literal-string` ESLint rule in contexts where translation is inappropriate.

### When to use `nt()`

| Context                               | Example                                          |
| ------------------------------------- | ------------------------------------------------ |
| Test files                            | `<Input label={nt('Test Label')} />`             |
| Storybook stories                     | `<Button label={nt('Click Me')} />`              |
| Static keys in non-component contexts | `const KEY = nt('some-config-key')`              |
| Data-testid values                    | NOT needed (ESLint allows `data-testid` strings) |
| Enum values                           | NOT needed (ESLint allows string assignments)    |

```tsx
// In a story file
import { nt } from 'ev-i18n';

export const Default = () => <Button id="story-btn" label={nt('Submit')} />;
```

```tsx
// In a test file
import { nt } from 'ev-i18n';

test('renders button', () => {
  render(<Input id="name" label={nt('Name')} />);
});
```

---

## i18next Configuration

From `src/ev-i18n/i18n.ts`:

```tsx
i18n.init({
  returnNull: false,
  lng: 'en', // Default language
  interpolation: { escapeValue: false },
  keySeparator: false, // Flat keys (no dot nesting)
  nsSeparator: false, // No namespace separator
});
```

**Key implications of `keySeparator: false`:**

- Translation keys are the full English string: `"Save Changes"` not `"buttons.save"`
- No dot-based nesting in JSON files
- The English text IS the key

---

## Translation File Structure

```
src/ev-i18n/locales/
  en/translation.json     # English (source of truth)
  es/translation.json     # Spanish
  fr/translation.json     # French
  ar/translation.json     # Arabic
  ... (16 locales total)
```

Translation JSON format (flat):

```json
{
  "Save Changes": "Save Changes",
  "Patient Details": "Patient Details",
  "Welcome back, {{name}}": "Welcome back, {{name}}",
  "{{count}} patient": "{{count}} patient",
  "{{count}} patient_plural": "{{count}} patients"
}
```

Languages load on demand via `i18next-resources-to-backend`.

---

## Extraction and Verification

### Check extraction

```bash
yarn extract:check
```

This verifies all `t()` keys in code have corresponding entries in the translation JSON. Run this before committing -- it is part of the pre-commit hook (`yarn precommit`).

### Extract keys

```bash
yarn extract
```

Extracts all translation keys from source code to the English JSON file.

---

## Lokalise Workflow

Translations are managed externally via Lokalise:

1. Developer adds new `t('New String')` calls in code
2. `yarn extract` updates `en/translation.json` with new keys
3. Lokalise script uploads new keys: `bin/lokalise-upload`
4. Translators provide translations in Lokalise
5. Automated PR updates locale files: `bin/lokalise-download`
6. Branch naming: `lokalise-YYYY-MM-DD_HH-MM-SS`
7. Commit message: `Lokalise: updates`

---

## ESLint Rule: `i18next/no-literal-string`

This rule ensures all user-facing strings are translated. It flags literal strings in JSX and specific prop positions.

**What triggers the rule:**

```tsx
// ERROR: Literal string in JSX
<h1>Patient Details</h1>

// ERROR: Literal string in label prop
<Button label="Save" />
```

**What does NOT trigger the rule:**

```tsx
// OK: Wrapped with t()
<h1>{t('Patient Details')}</h1>

// OK: Wrapped with nt()
<Button label={nt('Save')} />

// OK: Template literals with variables only
<div className={`container-${size}`} />

// OK: data-testid and similar attributes
<div data-testid="patient-card" />

// OK: String assignments to constants
const API_URL = '/api/v3/visits';
```

---

## Test Setup for i18n

In `setupTests.ts`, i18n is initialized with English translations loaded synchronously (no lazy loading):

```tsx
void i18n.use(initReactI18next).init({
  resources: { en: { translation: en } },
  lng: 'en',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});
```

This means in tests, `t('Save Changes')` returns `'Save Changes'` (English). Query by the English text in assertions:

```tsx
expect(screen.getByText('Save Changes')).toBeInTheDocument();
```

---

## Checklist for New Features

1. Wrap ALL user-facing strings with `t()` from `useTranslation()`
2. Use `nt()` in stories and tests to satisfy ESLint
3. Use interpolation `{{variable}}` for dynamic values -- never concatenate
4. Run `yarn extract:check` before committing
5. Never use `i18n.t()` globally -- always use the `useTranslation()` hook
6. Import from `ev-i18n`, never from `react-i18next`
