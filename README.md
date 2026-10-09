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

`npm test` runs Jest with its defaults. `npm run test:ci` runs the
same tests for CI callers and also writes reports to fixed paths:

| Path                             | Format                     |
| -------------------------------- | -------------------------- |
| `reports/junit.xml`              | JUnit XML, by `jest-junit` |
| `coverage/lcov.info`             | LCOV                       |
| `coverage/coverage-summary.json` | Istanbul JSON summary      |

The `jest-junit` key in `package.json` sets the JUnit path, and the
`jest` key scopes coverage to this project's JavaScript sources,
excluding `variants/`, configuration files and the report directories.
Git, `npm pack`, ESLint, Prettier and tsc all ignore `coverage/` and
`reports/`.

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

[pre-commit.ci results page]: https://results.pre-commit.ci/latest/github/lfreleng-actions/test-node-project/main
[pre-commit.ci status badge]: https://results.pre-commit.ci/badge/github/lfreleng-actions/test-node-project/main.svg
