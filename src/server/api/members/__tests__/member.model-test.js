import Member from '../member.model';

describe('member.model', () => {
  describe('userId', () => {
    it('should be required', () => {
      expect(Member().validateSync().errors.userId.kind).toEqual('required');
    });
    it('should be valid when given a valid member', () => {
      expect(Member({ userId: 'cc12345' }).validateSync()).toBeUndefined();
    });
    describe('should be valid when', () => {
      it('start with AC/CC and contain 5 digits', () => {
        expect(Member({ userId: 'AC12345' }).validateSync()).toBeUndefined();
        expect(Member({ userId: 'CC12345' }).validateSync()).toBeUndefined();
      });
      it('start with ac/cc and contain 5 digits', () => {
        expect(Member({ userId: 'ac12345' }).validateSync()).toBeUndefined();
        expect(Member({ userId: 'cc12345' }).validateSync()).toBeUndefined();
      });
    });
    describe('should be invalid when', () => {
      it('start with other than AC/CC', () => {
        expect(Member({ userId: 'aa12345' }).validateSync().errors.userId).toBeDefined();
      });
      it('for incorrect number if digits', () => {
        expect(Member({ userId: 'ac1234' }).validateSync().errors.userId).toBeDefined();
        expect(Member({ userId: 'ac123456' }).validateSync().errors.userId).toBeDefined();
      });
    });
  });
});
