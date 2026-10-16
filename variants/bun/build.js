/*
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: 2026 The Linux Foundation
*/

'use strict';

// Copies the app into dist/, giving callers a build output to collect.
const fs = require('node:fs');
const path = require('node:path');

const out = path.join(__dirname, 'dist');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out);
fs.copyFileSync(path.join(__dirname, 'index.js'), path.join(out, 'index.js'));
