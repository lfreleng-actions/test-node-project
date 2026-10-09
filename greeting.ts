/*
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: 2026 The Linux Foundation
*/

// Gives 'npm run typecheck' a TypeScript source to check. The fixture
// ships no compiled output, so nothing loads this at run time.
export function greeting(name: string): string {
  return `Hello ${name}!`;
}
