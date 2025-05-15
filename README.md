# bhvr++

A full-stack TypeScript monorepo starter with shared types, using Bun, Hono, Vite, React and Tanstack

## Why bhvr++?

Well why just limit yourself to bhvr when we can have magic of Tanstack Router and Query 

## Features

- **Full-Stack TypeScript**: End-to-end type safety between client and server
- **Shared Types**: Common type definitions shared between client and server
- **Monorepo Structure**: Organized as a workspaces-based monorepo
- **Modern Stack**:
  - [Bun](https://bun.sh) as the JavaScript runtime
  - [Hono](https://hono.dev) as the backend framework
  - [Vite](https://vitejs.dev) for frontend bundling
  - [React](https://react.dev) for the frontend UI
  - [Tanstack](https://tanstack.com) for headless, type-safe & powerful utility

## Project Structure

```
.
├── client/               # React frontend
├── server/               # Hono backend
├── shared/               # Shared TypeScript definitions
│   └── src/types/        # Type definitions used by both client and server
└── package.json          # Root package.json with workspaces
```

### Server

bhvr++ uses Hono as a backend API for its simplicity and massive ecosystem of plugins. If you have ever used Express then it might feel familiar. Declaring routes and returning data is easy.

```
server
├── bun.lock
├── package.json
├── README.md
├── src
│   └── index.ts
└── tsconfig.json
```

```typescript src/index.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { ApiResponse } from 'shared/dist'

const app = new Hono()

app.use(cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/hello', async (c) => {

  const data: ApiResponse = {
    message: "Hello BHVR!",
    success: true
  }

  return c.json(data, { status: 200 })
})

export default app
```

### Client

bhvr uses Vite + React + Tanstack + Typescript template, which means you can build your frontend just as you would with any other React app. This makes it flexible to add UI components like [shadcn/ui](https://ui.shadcn.com)

```
client
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── public
│   └── vite.svg
├── README.md
├── src
│   ├── assets
│   │   └── beaver.svg
│   ├── components
│   │   └── ui
│   │       └── button.tsx
│   ├── index.css
│   ├── lib
│   │   └── utils.ts
│   ├── main.tsx
│   ├── routes
│   │   ├── about.tsx
│   │   ├── index.tsx
│   │   └── __root.tsx
│   ├── routeTree.gen.ts
│   └── vite-env.d.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

```typescript src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "shared";
import beaver from "../assets/beaver.svg";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-separator";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const fetchHelloData = async (): Promise<ApiResponse> => {
  const response = await fetch(`${SERVER_URL}/hello`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["helloData"],
    queryFn: fetchHelloData,
    enabled: false,
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background/60 to-muted/30">
      <div className="flex flex-col flex-1 items-center justify-center py-12 md:py-16">
        <div className="flex flex-col items-center space-y-4 text-center mb-10">
          <a
            href="https://github.com/stevedylandev/bhvr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-105 transition-transform rounded-full overflow-hidden p-1.5 bg-background/80 backdrop-blur-sm ring-1 ring-border shadow-md mb-2"
          >
            <img src={beaver} className="w-20 h-20" alt="beaver logo" />
          </a>
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              bhvr
            </h1>
            <h2 className="text-xl text-muted-foreground font-medium">
              Bun + Hono + Vite + React
            </h2>
            <p className="text-xl">A typesafe fullstack monorepo</p>
          </div>
        </div>

        <Card className="w-full max-w-lg border shadow-lg backdrop-blur-sm bg-card/90">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              API Interaction
              <Badge
                variant={
                  data
                    ? data.success
                      ? "secondary"
                      : "destructive"
                    : "default"
                }
              >
                {data ? (data.success ? "Success" : "Failed") : "Ready"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <div className="flex gap-4 justify-center mb-6">
              <Button onClick={() => refetch()}>Call API</Button>
              <Button variant="outline" asChild>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://bhvr.dev"
                >
                  Docs
                </a>
              </Button>
            </div>

            {isLoading && (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            )}

            {isError && (
              <Alert variant="destructive">
                <AlertDescription>Error: {error.message}</AlertDescription>
              </Alert>
            )}

            {data && (
              <div className="bg-muted rounded-md p-4 font-mono text-sm">
                <div className="grid grid-cols-[1fr_auto] gap-3">
                  <span className="font-semibold text-primary">Message:</span>
                  <span>{data.message}</span>
                  <span className="font-semibold text-primary">Success:</span>
                  <span>{data.success.toString()}</span>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground pt-6">
            API endpoint: {SERVER_URL}/hello
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

```

### Shared

The Shared package is used for anything you want to share between the Server and Client. This could be types or libraries that you use in both environments.

```
shared
├── package.json
├── src
│   ├── index.ts
│   └── types
│       └── index.ts
└── tsconfig.json
```

Inside the `src/index.ts` we export any of our code from the folders so it's usable in other parts of the monorepo

```typescript
export * from "./types"
```

By running `bun run dev` or `bun run build` it will compile and export the packages from `shared` so it can be used in either `client` or `server`

```typescript
import { ApiResponse } from 'shared'
```

## Getting Started

### Quick Start

```bash
git clone https://github.com/meetVaidya/bhvr-plus-plus
```

### Installation

```bash
# Install dependencies for all workspaces
bun install
```

### Development

```bash
# Run shared types in watch mode, server, and client all at once
bun run dev

# Or run individual parts
bun run dev:shared  # Watch and compile shared types
bun run dev:server  # Run the Hono backend
bun run dev:client  # Run the Vite dev server for React
```

### Building

```bash
# Build everything
bun run build

# Or build individual parts
bun run build:shared  # Build the shared types package
bun run build:client  # Build the React frontend
```

## Type Sharing

Types are automatically shared between the client and server thanks to the shared package and TypeScript path aliases. You can import them in your code using:

```typescript
import { ApiResponse } from 'shared/types';
```

## Learn More

- [Bun Documentation](https://bun.sh/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/learn)
- [Hono Documentation](https://hono.dev/docs)
- [Tanstack Router Documentation](https://tanstack.com/router/latest/docs/framework/react/quick-start)
- [Tanstack Query Documentation](https://tanstack.com/query/latest/docs/framework/react/quick-start)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
