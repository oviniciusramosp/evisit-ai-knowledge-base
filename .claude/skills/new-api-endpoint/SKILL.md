---
name: new-api-endpoint
description: Use when adding a new RTK Query endpoint in ev-api/core/. Covers the 5-file pattern (index, endpoint, params, responses, transformers), cache tags, and MSW test handlers.
user-invocable: true
---

# New API Endpoint Checklist

## File Structure

```
src/ev-api/core/<domain>/
├── index.ts           # Re-exports hooks and types
├── <endpoint>.ts      # Endpoint definition (injectEndpoints)
├── params.ts          # Request parameter types
├── responses.ts       # Response types (raw API shape)
└── transformers.ts    # Response transformers (API → frontend shape)
```

## 1. Endpoint File

```tsx
import api, { Base, Tags } from 'ev-api/api';

import { MyParams } from './params';
import { MyResponse } from './responses';
import { transformMyResponse } from './transformers';

const withEndpoint = api.injectEndpoints({
  endpoints: builder => ({
    getMyData: builder.query<TransformedType, MyParams>({
      query: params => ({
        url: `${Base.V3}/my-endpoint`,
        method: 'GET',
        params,
      }),
      transformResponse: (response: MyResponse) =>
        transformMyResponse(response),
      providesTags: [Tags.MyTag],
    }),

    updateMyData: builder.mutation<void, UpdateParams>({
      query: body => ({
        url: `${Base.V3}/my-endpoint`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [Tags.MyTag],
    }),
  }),
});

export const { useGetMyDataQuery, useUpdateMyDataMutation } = withEndpoint;
```

### Rules:

- [ ] Use `Base.V2`, `Base.V3`, `Base.V4`, or `Base.Sch` for URL prefix
- [ ] Use `Tags` enum for cache management
- [ ] `providesTags` on queries, `invalidatesTags` on mutations
- [ ] Transform responses in `transformResponse` (don't transform in components)
- [ ] Export hooks from the endpoint file

## 2. Types (params.ts + responses.ts)

```tsx
// params.ts
export type MyParams = {
  id: string;
  page?: number;
  perPage?: number;
};

// responses.ts
export type MyResponse = {
  data: {
    id: string;
    attributes: { ... };
  }[];
  meta: { total: number };
};
```

## 3. Transformer (transformers.ts)

```tsx
import { MyResponse } from './responses';

export const transformMyResponse = (response: MyResponse) => ({
  items: response.data.map(item => ({
    id: item.id,
    ...item.attributes,
  })),
  total: response.meta.total,
});
```

## 4. Cache Tags

If you need a new tag, add it to the `Tags` enum in `ev-api/api.ts`.

## 5. MSW Handler (for testing)

Add to `src/ev-test/request-handlers/<domain>.ts`:

```tsx
import { rest } from 'msw';

import { myFactory } from 'ev-test/test-mocks/api-response';

export const mockGetMyData = (overrides = {}) =>
  rest.get('*/api/v3/my-endpoint', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ data: [myFactory.build(overrides)] }),
    );
  });
```

**IMPORTANT**: Use MSW v1 format (`rest.get`, `(req, res, ctx) =>`)

Add the handler to `request-handlers/index.ts` in the `allRequestHandlers` array.

## 6. Factory (for test data)

Add to `src/ev-test/test-mocks/api-response/<domain>.ts`:

```tsx
import { Factory } from 'fishery';

export const myFactory = Factory.define<MyType>(({ sequence }) => ({
  id: `${sequence}`,
  name: `Item ${sequence}`,
  // ... default values
}));
```
