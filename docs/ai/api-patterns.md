<!-- AI Reference: API Patterns for eVisit UI -->
<!-- Used by: Claude Code, Cursor, Copilot, Codex -->
<!-- Last verified against: src/ev-api/ directory -->

# API Patterns

The API layer uses **RTK Query** with a central `createApi` instance. All endpoints are injected via `api.injectEndpoints()`.

---

## Base URL Enum

Defined in `src/ev-api/api.ts`:

```tsx
export enum Base {
  V2 = 'api/v2', // Legacy endpoints
  V3 = 'api/v3', // Primary API version
  V4 = 'api/v4', // Newer endpoints
  Sch = 'api/sch', // Scheduling API
  None = '', // No prefix
}
```

## Tags Enum (Cache Invalidation)

Tags drive RTK Query cache invalidation. Defined in `src/ev-api/api.ts`:

| Tag                              | Used For                     |
| -------------------------------- | ---------------------------- |
| `Tags.User`                      | Current user data            |
| `Tags.Visits`                    | Visit list and details       |
| `Tags.Schedule`                  | Scheduling data              |
| `Tags.PersonalFilterViews`       | Saved filter views           |
| `Tags.Providers`                 | Provider list                |
| `Tags.VisitTypes`                | Visit type configuration     |
| `Tags.VisitStatuses`             | Visit status configuration   |
| `Tags.CustomForms`               | Custom forms list            |
| `Tags.CustomForm`                | Single custom form           |
| `Tags.CustomFormSubmissions`     | Form submissions             |
| `Tags.CustomColumns`             | Custom data grid columns     |
| `Tags.CustomActions`             | Custom actions               |
| `Tags.Segments`                  | Waiting room segments        |
| `Tags.Customer`                  | Customer (organization) data |
| `Tags.AdminPractices`            | Admin practice list          |
| `Tags.CustomerUsers`             | Customer user management     |
| `Tags.CustomerRoles`             | Customer roles               |
| `Tags.EvaultDocument`            | Encrypted vault document     |
| `Tags.FrontDoors`                | Front door configurations    |
| `Tags.Journeys`                  | Journey flows                |
| `Tags.JourneyTriggers`           | Journey trigger configs      |
| `Tags.CustomDocuments`           | Custom documents             |
| `Tags.Availability`              | Provider availability        |
| `Tags.CurrentPractice`           | Current practice data        |
| `Tags.EData`                     | Electronic data              |
| `Tags.Qtc`                       | QTC data                     |
| `Tags.FavoriteMedications`       | Favorite medications         |
| `Tags.VisitPrescriptions`        | Visit prescriptions          |
| `Tags.AdminVideoBackgrounds`     | Video backgrounds            |
| `Tags.AdminLanguageQuickSelects` | Language quick selects       |
| `Tags.PracticeDevices`           | Practice devices             |

Full list: ~40 tags. See `src/ev-api/api.ts` for the complete enum.

## Authentication

The base query automatically attaches the auth token:

```tsx
prepareHeaders: (headers, { getState }) => {
  const token = (getState() as RootState).auth.token;
  if (token) {
    headers.set('Secure-Authentication-Token', token);
  }
  if (BACKEND_PROXY) {
    headers.set('x-target-host', BACKEND_PROXY);
  }
  return headers;
};
```

## Multiple API Instances

| Instance        | File                       | Purpose                       |
| --------------- | -------------------------- | ----------------------------- |
| `api`           | `ev-api/api.ts`            | Main API (all core endpoints) |
| `oldEvaultApi`  | `ev-api/evault/`           | Old eVault encrypted storage  |
| `newEvaultApi`  | `ev-api/evault/new-evault` | New eVault API                |
| `cloudfrontApi` | `ev-api/cloudfront/`       | CloudFront alerts             |
| `stripeApi`     | `ev-api/stripe/`           | Stripe payments               |
| `googleMapsApi` | `ev-api/google-maps/`      | Google Maps geocoding         |

---

## 5-File Endpoint Pattern

Each domain module in `src/ev-api/core/<domain>/` follows this structure:

```
src/ev-api/core/visits/
  index.ts          # Re-exports types and hooks
  visits.ts         # Endpoint definitions (the main file)
  params.ts         # Request parameter types
  responses.ts      # API response types
  transformers.ts   # Response transformation functions
```

### File Responsibilities

**`params.ts`** -- Request parameter types:

```tsx
export type GetVisitByIdParams = {
  id: string;
  include?: string[];
};

export type CancelVisitParams = {
  visitId: string;
  reason?: string;
};
```

**`responses.ts`** -- API response types (raw shape from server):

```tsx
export type VisitResponse = {
  data: VisitResponseData;
  included?: IncludedResource[];
};

export type VisitResponseData = {
  id: string;
  type: string;
  attributes: VisitAttributes;
};
```

**`transformers.ts`** -- Transform raw API responses into app types:

```tsx
export const transformVisitResponse = (
  response: VisitResponse,
): VisitWithPatient => {
  return sanitizeAndTransformResponse(response);
};
```

**`visits.ts`** (or `<domain>.ts`) -- Endpoint definitions:

```tsx
import api, { Base, Tags } from 'ev-api/api';

const withEndpoints = api.injectEndpoints({
  endpoints: builder => ({
    getVisitById: builder.query<VisitWithPatient, GetVisitByIdParams>({
      query: ({ id, include }) => ({
        url: `${Base.V3}/visits/${id}`,
        method: 'GET',
        params: { include },
      }),
      transformResponse: transformVisitResponse,
      providesTags: [Tags.Visits],
    }),

    cancelVisit: builder.mutation<CancelVisit, CancelVisitParams>({
      query: ({ visitId, reason }) => ({
        url: `${Base.V2}/visits/${visitId}/cancel`,
        method: 'PUT',
        body: { reason },
      }),
      invalidatesTags: [Tags.Visits],
    }),
  }),
});

export const { useGetVisitByIdQuery, useCancelVisitMutation } = withEndpoints;
```

**`index.ts`** -- Barrel export:

```tsx
export * from './visits';
export * from './params';
export * from './responses';
export * from './transformers';
```

---

## How to Add a New Endpoint

### Step 1: Define params in `params.ts`

```tsx
export type CreateWidgetParams = {
  name: string;
  practiceId: string;
};
```

### Step 2: Define response types in `responses.ts`

```tsx
export type WidgetResponse = {
  data: { id: string; type: string; attributes: { name: string } };
};
```

### Step 3: Add transformer in `transformers.ts`

```tsx
import { sanitizeAndTransformResponseData } from 'ev-api/common/transformers';

export const transformWidgetResponse = (response: WidgetResponse) =>
  sanitizeAndTransformResponseData(response);
```

### Step 4: Add endpoint in the domain file

```tsx
const withEndpoints = api.injectEndpoints({
  endpoints: builder => ({
    // ... existing endpoints
    createWidget: builder.mutation<Widget, CreateWidgetParams>({
      query: ({ name, practiceId }) => ({
        url: `${Base.V3}/practices/${practiceId}/widgets`,
        method: 'POST',
        body: { name },
      }),
      transformResponse: transformWidgetResponse,
      invalidatesTags: [Tags.Widgets], // Add new tag if needed
    }),
  }),
});

export const { useCreateWidgetMutation } = withEndpoints;
```

### Step 5: Add tag if needed in `ev-api/api.ts`

```tsx
export enum Tags {
  // ... existing tags
  Widgets = 'Widgets',
}
```

### Step 6: Re-export from `index.ts`

---

## How to Add an MSW Handler

MSW handlers live in `src/ev-test/request-handlers/`. Format is **MSW v1** (NOT v2).

### Handler file pattern

```tsx
// src/ev-test/request-handlers/widgets.ts
import { rest } from 'msw';

import { widgetResponseFactory } from 'ev-test/test-mocks/api-response';

export const mockGetWidgets = (data?: WidgetResponse[]) => {
  const response = data || [widgetResponseFactory.build()];

  return rest.get('*/api/v3/practices/:practiceId/widgets', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ data: response }));
  });
};

export const mockCreateWidget = () => {
  return rest.post(
    '*/api/v3/practices/:practiceId/widgets',
    (req, res, ctx) => {
      return res(
        ctx.status(201),
        ctx.json({ data: widgetResponseFactory.build() }),
      );
    },
  );
};
```

### Register in `request-handlers/index.ts`

```tsx
import { mockCreateWidget, mockGetWidgets } from './widgets';

export const allRequestHandlers = [
  // ... existing handlers
  mockGetWidgets(),
  mockCreateWidget(),
];

export { mockGetWidgets, mockCreateWidget };
```

### Override in a specific test

```tsx
import { mockGetWidgets, server } from 'ev-test/test-utils';

test('handles empty widget list', () => {
  server.use(mockGetWidgets([])); // Override default handler
  // ... test
});
```

### Important MSW v1 Notes

- Use `rest.get`, `rest.post`, `rest.put`, `rest.delete` from `'msw'`
- Handler signature: `(req, res, ctx) => res(ctx.status(200), ctx.json(data))`
- URL patterns use `*` prefix to match any origin: `'*/api/v3/...'`
- Path params use `:paramName` syntax: `'*/api/v3/visits/:visitId'`
- Global server setup runs with `onUnhandledRequest: 'error'` -- all API calls need handlers

## API Domain Modules

Located under `src/ev-api/core/`:

| Module                    | Domain                                                      |
| ------------------------- | ----------------------------------------------------------- |
| `current-user/`           | Current user CRUD                                           |
| `visits/`                 | Visit lifecycle (create, join, cancel, complete, prescribe) |
| `patients/`               | Patient management                                          |
| `providers/`              | Provider management                                         |
| `scheduling/`             | Appointment scheduling                                      |
| `users/`                  | User administration                                         |
| `practices/`              | Practice settings                                           |
| `customers/`              | Customer/organization                                       |
| `custom-forms/`           | Custom forms CRUD                                           |
| `custom-documents/`       | Custom documents                                            |
| `visit-types/`            | Visit type configuration                                    |
| `visit-type-memberships/` | Visit type membership                                       |
| `personal-filter-views/`  | Saved filters                                               |
| `journey/`                | Journey flows                                               |
| `journey-triggers/`       | Journey triggers                                            |
| `front-door/`             | Front door config                                           |
| `admin/`                  | Admin-specific endpoints                                    |
| `chat-sessions/`          | Chat sessions                                               |
| `insurance-validations/`  | Insurance verification                                      |
| `pharmacies/`             | Pharmacy search                                             |
| `dosespot/`               | E-prescribing                                               |
| `biometrics/`             | Biometric auth                                              |
| `authentication-methods/` | Auth methods                                                |
| `password-reset/`         | Password reset                                              |
| `preferences/`            | User preferences                                            |
| `reports/`                | Report generation                                           |
| `cdx/`                    | Clinical document exchange                                  |
| `edata/`                  | Electronic data                                             |
| `express/`                | Express room                                                |
| `integrations/`           | Third-party integrations                                    |
| `mimic/`                  | Environment impersonation                                   |
| `notification-channels/`  | Notification channels                                       |
| `qtc/`                    | Quality/training/compliance                                 |
| `trading-partners/`       | Trading partners                                            |
| `chart-codes/`            | Chart codes                                                 |
| `chart-questions/`        | Chart questions                                             |
| `bulk-user-import/`       | Bulk user import                                            |
| `access-code-sets/`       | Access code sets                                            |
| `customFormSubmissions/`  | Form submission data                                        |
