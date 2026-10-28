/*
SPDX-License-Identifier: Apache-2.0
SPDX-FileCopyrightText: 2025 The Linux Foundation
*/

const assert = require('node:assert/strict');
const { describe, test } = require('node:test');
const sum = require('./sum');

// The JUnit reporter writes a top-level test() straight under
// <testsuites>, where report tools counting <testsuite> elements miss
// it; the describe() gives the test a suite of its own.
describe('sum', () => {
  test('adds 1 + 2 to equal 3', () => {
    assert.equal(sum(1, 2), 3);
  });
});
