
'use strict';

const validator = require("../validator.js");

test('validateUserId should return true for correct input', () => {
expect(validator.validateUserId("AC32145")).toBe(true);
});


test('validateUserId should return false for input with wrong first letters', () => {
expect(validator.validateUserId("AA32421")).toBe(false);
});


test('validateUserId should return false for incorrect number if digits', () => {
  expect(validator.validateUserId("CC3242")).toBe(false);
});
