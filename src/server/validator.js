export function validateUserId(userId) {
  return /^[a|A|c|C][c|C]\d{5}$/.test(userId);
}

export default { validateUserId };
