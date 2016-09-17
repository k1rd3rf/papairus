import { validateUserId } from '../member';


describe('member', () => {
  describe('validateUserId', () => {
    describe('should return true', () => {
      it('should return true for input that start with AC/CC and contain 5 digits', () => {
        expect(validateUserId('AC32145')).toBe(true);
        expect(validateUserId('CC32145')).toBe(true);
      });
      it('should return true for input that start with ac/cc and contain 5 digits', () => {
        expect(validateUserId('ac32145')).toBe(true);
        expect(validateUserId('cc32145')).toBe(true);
      });
      describe('should return false', () => {
        it('for input with wrong first letters', () => {
          expect(validateUserId('AA32421')).toBe(false);
        });
        it('for incorrect number if digits', () => {
          expect(validateUserId('CC3242')).toBe(false);
        });
      });
    });
  });
});
