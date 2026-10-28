# Test Node.js Project

<!--
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: 2025 The Linux Foundation
-->

<!-- prettier-ignore-start -->
<!-- markdownlint-disable-next-line MD013 -->
[![Linux Foundation](https://img.shields.io/badge/Linux-Foundation-blue)](https://linuxfoundation.org//) [![Source Code](https://img.shields.io/badge/GitHub-100000?logo=github&logoColor=white&color=blue)](https://github.com/lfreleng-actions/test-node-project) [![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) [![pre-commit.ci status badge]][pre-commit.ci results page]
<!-- prettier-ignore-end -->

Example project used for testing Github actions that work with Node.js code.

## test-node-project

<!-- markdownlint-disable MD013 -->
Contains a sample Node.js project implementing an HTTP web/server application
with the express package [express](https://www.npmjs.com/package/express).
<!-- markdownlint-enable MD013 -->

<!--
# The section below renders the badges displayed at the top of the page
-->

## Notes

Steps required to install/run the project:

```console
git clone git@github.com:lfreleng-actions/test-node-project.git
2. cd test-node-project
3. npm install
4. npm start
```

## Linting

The project carries ESLint, Prettier and TypeScript configuration, and
a script for each check. None of them rewrites files:

```console
npm ci
npm run lint          # ESLint, eslint.config.mjs from actions-template
npm run format:check  # Prettier
npm run typecheck     # tsc --noEmit, checking greeting.ts
```

The colons in `format:check` are deliberate: they exercise callers
that pass script names through to `npm run`. The same three checks run
as `eslint`, `prettier` and `tsc` hooks in `.pre-commit-config.yaml`.
Those hooks use the tools installed in `node_modules`, so run `npm ci`
before `prek run --all-files`. pre-commit.ci cannot install them, and
skips them.

## Test reports

`npm test` runs the root test files with the Node.js test runner
(`node --test`), as the variants do, so the project needs no test
framework. `npm run test:ci` runs the same tests for CI callers and
also writes reports to fixed paths:

<!-- markdownlint-disable MD013 -->

| Path                             | Format                                     |
| -------------------------------- | ------------------------------------------ |
| `reports/junit.xml`              | JUnit XML, by the Node.js `junit` reporter |
| `coverage/lcov.info`             | LCOV, by `c8`                              |
| `coverage/coverage-summary.json` | Istanbul JSON summary, by `c8`             |

<!-- markdownlint-enable MD013 -->

The Node.js JUnit reporter writes a top-level `test()` outside any
`<testsuite>`, so tests sit inside a `describe()`. The `test:ci`
script creates `reports/` first, because the reporter does not. The
`c8` key in `package.json` scopes coverage to this project's
JavaScript sources, excluding tests, `variants/`, configuration files
and the report directories. Git, `npm pack`, ESLint, Prettier and tsc
all ignore `coverage/` and `reports/`.

## Pinning this fixture

`action.yaml` is not a working action. It lets a repository that
tests against this fixture pin it with a `uses:` reference, which
Dependabot tracks and bumps on each release:

```yaml
- id: fixture
  uses: lfreleng-actions/test-node-project@<commit-sha>  # vX.Y.Z
```

The step outputs `ref`, the pinned commit, and `repository`, the
repository it came from, ready to pass to a checkout. It fails unless
pinned by full commit SHA.

## Merge-lane release cases

`version.properties` gives `merge.yaml` in
`lfreleng-actions/node-workflows` a version to resolve, `1.0.0`, matching
`package.json`. Its release detection compares a commit with its first
parent and counts the files the commit adds under `releases/`. Five
consecutive commits exercise that logic, and each touches nothing
beyond the files its case needs:

<!-- markdownlint-disable MD013 -->

| Commit subject                                     | Expected result                                    |
| -------------------------------------------------- | -------------------------------------------------- |
| `Feat: Add version.properties at 1.0.0`            | No release: snapshot candidate                     |
| `Test: Add matching release file for 1.0.0`        | Release `1.0.0`, version verified                  |
| `Test: Change a comment in the 1.0.0 release file` | No release: an edit adds no file                   |
| `Test: Add mismatched release file for 1.0.1`      | Fails: `1.0.1` does not match `version.properties` |
| `Test: Remove the release fixture files`           | No release: a deletion adds no file                |

<!-- markdownlint-enable MD013 -->

Callers pin each case by its commit SHA after merge and check it out at
depth 2. Merge the pull request that adds them with a merge commit: a
squash or rebase merge would discard the commits or change their SHAs.
The last commit removes both release files, so the merge commit itself
adds nothing under `releases/` and the tip of `main` stays a snapshot
candidate.

## Package-manager variants

The root project covers npm. Each directory under `variants/` is a
self-contained sub-project for another package manager, which callers
select with `path_prefix`. Every variant carries the same small app,
with one runtime dependency (`picocolors`), a `build` script that
writes `dist/index.js`, a `test` script using `node --test`, and its
own committed lockfile.

<!-- markdownlint-disable MD013 -->

| Path                      | Package manager  | Lockfile                                 | `packageManager` | Exercises                                                                         |
| ------------------------- | ---------------- | ---------------------------------------- | ---------------- | --------------------------------------------------------------------------------- |
| `variants/yarn-classic`   | Yarn 1.22.22     | `yarn.lock` (v1)                         | absent           | Yarn 1 detected from `yarn.lock` alone                                            |
| `variants/yarn-berry`     | Yarn 4.18.1      | `yarn.lock` (v10) + `.yarnrc.yml`        | `yarn@4.18.1`    | Yarn Berry via corepack, with `nodeLinker: node-modules`                          |
| `variants/pnpm`           | pnpm 10.34.6     | `pnpm-lock.yaml` (v9)                    | `pnpm@10.34.6`   | pnpm via corepack; the dev dependency `is-number` probes dev-dependency scoping   |
| `variants/pnpm-workspace` | pnpm 10.34.6     | `pnpm-lock.yaml` + `pnpm-workspace.yaml` | absent           | A two-package workspace where `app` depends on `sum` through `workspace:*`        |
| `variants/bun`            | Bun 1.4.2        | `bun.lock` (text)                        | absent           | Bun's text lockfile, rather than the older binary `bun.lockb`                     |

<!-- markdownlint-enable MD013 -->

The `pnpm` variant's dev dependency gives SBOM and Grype tests a
regression probe: syft has reported pnpm v9 dev dependencies even with
development dependencies excluded. The variants without
`packageManager` exercise detection from the lockfile alone.

To install, build and test a variant with its own tool, put the package
manager on `PATH` first. With corepack:

```console
corepack enable
cd variants/pnpm
pnpm install --frozen-lockfile
pnpm run build
pnpm run test
```

For a variant without `packageManager`, set corepack's default version
first, for example `corepack install --global yarn@1.22.22` or
`corepack install --global pnpm@10.34.6`. The `pnpm-workspace` scripts
run `pnpm -r`, so they need `pnpm` on `PATH`: `corepack pnpm run build`
alone fails there. For Bun, run `bun install --frozen-lockfile`.
Node.js 25 and later no longer bundle corepack;
`npm install --global corepack` provides it. CI runs each variant this
way in `testing.yaml`, and Dependabot keeps their lockfiles current.

The root project's test glob, its coverage configuration and its npm
package exclude `variants/`.

[pre-commit.ci results page]: https://results.pre-commit.ci/latest/github/lfreleng-actions/test-node-project/main
[pre-commit.ci status badge]: https://results.pre-commit.ci/badge/github/lfreleng-actions/test-node-project/main.svg
