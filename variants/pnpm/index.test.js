/*
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: 2026 The Linux Foundation
*/

'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const isNumber = require('is-number');
const { sum, greeting } = require('./index.js');

test('adds 1 + 2 to equal 3', () => {
  assert.equal(sum(1, 2), 3);
  assert.ok(isNumber(sum(1, 2)));
});

test('greets by name', () => {
  assert.match(greeting('world'), /Hello world!/);
});
