/*
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: 2026 The Linux Foundation
*/

'use strict';

const pc = require('picocolors');

function sum(a, b) {
  return a + b;
}

function greeting(name) {
  return pc.bold(`Hello ${name}!`);
}

module.exports = { sum, greeting };
