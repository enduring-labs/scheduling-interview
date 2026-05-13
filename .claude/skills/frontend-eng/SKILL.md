---
name: frontend-eng
description: "INVOKE THIS SKILL when writing ANY frontend code."
---

For deeper guidance, reference the `next-best-practices` and `vercel-react-best-practices` skills as needed.

## Component Model

- **Server Components by default.** Every component is a React Server Component unless it absolutely needs client-side interactivity (event handlers, hooks, browser APIs).
- **Push `"use client"` as far down the tree as possible.** Only the smallest interactive leaf should be a client component. If a large component seems to need `"use client"`, break it into sub-components so the interactive parts are isolated and everything else stays server-rendered.
- **Why this matters:** Server Components can directly fetch data (via queries/Drizzle), send zero JS to the browser, and stream HTML progressively. Every unnecessary `"use client"` moves work to the client, increases bundle size, and loses access to server-only features like direct DB reads.

### When to use `"use client"`
- `useState`, `useEffect`, `useRef`, or any React hook that requires client execution
- Event handlers (`onClick`, `onChange`, `onSubmit`, etc.)
- Browser-only APIs (`window`, `localStorage`, `IntersectionObserver`)
- TanStack Query hooks (`useQuery`, `useMutation`)

### When NOT to use `"use client"`
- Fetching data — use a Server Component that calls a query function directly
- Layout and static content — stays server-rendered
- Components that only receive and display props from a server parent

## UI & Styling

- Use the shadcn MCP whenever opportune to find UI components instead of reinventing the wheel
- Use shadcn/ui + Radix primitives + Tailwind CSS for all UI — no custom component libraries

## File Organization

- Put page sub-components into its own `components/` folder next to the page to maintain modularity
- Shared components go in `src/components/shared/`; shadcn primitives live in `src/components/ui/`

## Wireframes

- Use the low-fidelity wireframes in `docs/wireframes` as reference (but don't take them too literally)
