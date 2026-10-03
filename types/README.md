# @nurama/types

This package provides shared TypeScript types for use across the entire Nurama ecosystem, including backend services, frontend applications, and the SDK. These types are AI generated from the components.xml file in the backend repo. Please report or submit a pull request for any inconsistencies.

## Purpose

Centralizing type definitions ensures consistency and reduces duplication across different parts of the Nurama platform. Any application interacting with Nurama data structures should utilize these types.

## Installation

This package is primarily intended for use within the Nurama monorepo or organization. Depending on the setup (e.g., Lerna, Yarn Workspaces, pnpm workspaces), installation is likely handled automatically via workspace commands.

**Installing directly from Git (for use outside the monorepo or if not published):**

If you need to use this package in a project outside the main monorepo and it hasn't been published to a package registry, you can install it directly from its Git repository. Ensure you have the necessary access permissions (e.g., SSH keys configured for private repositories).

Replace `<commit-ish>` with a branch name (like `main`), a tag, or a specific commit hash.

```bash
# Using npm
npm install git+ssh://git@<your-git-host.com>:<your-org-or-user>/nurama-types.git#<commit-ish>

# Using yarn
yarn add git+ssh://git@<your-git-host.com>:<your-org-or-user>/nurama-types.git#<commit-ish>

# Using pnpm
pnpm add git+ssh://git@<your-git-host.com>:<your-org-or-user>/nurama-types.git#<commit-ish>
```

**If published privately to npm:**

```bash
npm install @nurama/types
# or
yarn add @nurama/types
# or
pnpm add @nurama/types
```

## Usage

Import the required types directly from the package:

```typescript
import type { User, Project, Asset } from '@nurama/types';

function processProject(project: Project): void {
  console.log(`Processing project: ${project.name}`);
}

async function fetchUser(userId: string): Promise<User | null> {
  // ... implementation to fetch user data
  const userData: User = /* fetched data */;
  return userData;
}
```

All available types are exported from the root of the package. They are organized into logical modules within the `src` directory (e.g., `user.ts`, `project.ts`, `asset.ts`).

## Building

To compile the TypeScript types into JavaScript and generate declaration files (`.d.ts`), run the build script from within this package's directory:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

This will output the compiled files to the `dist` directory as configured in `tsconfig.json`. 