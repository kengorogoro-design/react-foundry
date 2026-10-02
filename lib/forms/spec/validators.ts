import { after, before, date, fullDate, future, past } from '../src/validators';

describe('validators', () => {
  describe('date', () => {
    const validate = date()({ name: 'date of birth' });
    const error = 'Enter a real date of birth';

    it('accepts a day, month and year', async () => expect(validate('2007-11-12')).toBeUndefined());
    it('accepts a month and year', async () => expect(validate('2007-11')).toBeUndefined());
    it('accepts a day and month', async () => expect(validate('--11-12')).toBeUndefined());
    it('accepts the 29th of February with no year to judge it by', async () => expect(validate('--02-29')).toBeUndefined());
    it('accepts an empty value', async () => expect(validate('')).toBeUndefined());
    it('rejects a day that the month does not have', async () => expect(validate('2007-11-31')).toEqual(error));
    it('rejects a day that the month does not have when there is no year', async () => expect(validate('--02-30')).toEqual(error));
    it('rejects a month that does not exist', async () => expect(validate('--13-01')).toEqual(error));
    it('rejects something that is not a date', async () => expect(validate('tomorrow')).toEqual(error));
    it('uses the message it is given', async () => expect(date('Enter a valid date of birth')({ name: 'x' })('nope')).toEqual('Enter a valid date of birth'));
  });

  describe('fullDate', () => {
    const validate = fullDate()({ name: 'date of birth' });
    const error = 'Enter a real date of birth';

    it('accepts a day, month and year', async () => expect(validate('2007-11-12')).toBeUndefined());
    it('accepts an empty value', async () => expect(validate('')).toBeUndefined());
    it('rejects a month and year', async () => expect(validate('2007-11')).toEqual(error));
    it('rejects a day and month', async () => expect(validate('--11-12')).toEqual(error));
    it('rejects a year on its own', async () => expect(validate('2007')).toEqual(error));
    it('rejects a day that the month does not have', async () => expect(validate('2007-11-31')).toEqual(error));
  });

  describe.each([
    ['past', past()],
    ['future', future()],
    ['before', before('2010-01-01')()],
    ['after', after('2010-01-01')()]
  ])('%s', (_name, ready) => {
    const validate = ready({ name: 'date of birth' });
    const fullDateError = 'Enter a full date of birth';

    it('accepts an empty value', async () => expect(validate('')).toBeUndefined());
    it('does not interpret a month and year as a full date', async () => expect(validate('2007-11')).toEqual(fullDateError));
    it('does not interpret a day and month as a full date', async () => expect(validate('--11-12')).toEqual(fullDateError));
    it('does not let JavaScript roll a yearless leap day into March', async () => expect(validate('--02-29')).toEqual(fullDateError));
  });

  describe('comparison validator custom messages', () => {
    it('uses the custom message when a partial date cannot be compared', async () =>
      expect(past('Enter a complete date')({ name: 'date of birth' })('--11-12')).toEqual('Enter a complete date'));
  });

});
