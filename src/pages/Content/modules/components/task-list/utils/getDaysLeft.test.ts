import { FinalAssignment } from '../../../types';
import getDaysLeft from './getDaysLeft';
import forEachTZ from '../../../tests/utils/forEachTZ';
import { AssignmentDefaults } from '../../../constants';

let dateNowSpy: jest.SpyInstance;

afterAll(() => {
  // Unlock Time
  dateNowSpy.mockRestore();
});

test('Returns 0 on the same day', () => {
  forEachTZ(() => {
    dateNowSpy = jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2021, 1, 26, 0, 0, 0).valueOf());
    const a: FinalAssignment = {
      ...AssignmentDefaults,
      due_at: new Date(2021, 1, 26, 0, 0, 0).toISOString(),
    };
    expect(getDaysLeft(a)).toBe(0);
    a.due_at = new Date(2021, 1, 26, 23, 59, 59).toISOString();
    expect(getDaysLeft(a)).toBe(0);
  });
});

test('Returns 1 for next day', () => {
  forEachTZ(() => {
    dateNowSpy = jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2021, 1, 26, 0, 0, 0).valueOf());
    const a: FinalAssignment = {
      ...AssignmentDefaults,
      due_at: new Date(2021, 1, 27, 0, 0, 0).toISOString(),
    };
    expect(getDaysLeft(a)).toBe(1);
    a.due_at = new Date(2021, 1, 27, 23, 59, 59).toISOString();
    expect(getDaysLeft(a)).toBe(1);
  });
});

test('Returns 2 for day after tomorrow', () => {
  forEachTZ(() => {
    dateNowSpy = jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2021, 1, 26, 0, 0, 0).valueOf());
    const a: FinalAssignment = {
      ...AssignmentDefaults,
      due_at: new Date(2021, 1, 28, 0, 0, 0).toISOString(),
    };
    expect(getDaysLeft(a)).toBe(2);
    a.due_at = new Date(2021, 1, 28, 23, 59, 59).toISOString();
    expect(getDaysLeft(a)).toBe(2);
  });
});

test('Returns correct days in different month', () => {
  forEachTZ(() => {
    dateNowSpy = jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2021, 1, 26, 0, 0, 0).valueOf());
    const a: FinalAssignment = {
      ...AssignmentDefaults,
      due_at: new Date(2021, 2, 1, 0, 0, 0).toISOString(),
    };
    expect(getDaysLeft(a)).toBe(3);
    a.due_at = new Date(2021, 2, 31, 23, 59, 59).toISOString();
    expect(getDaysLeft(a)).toBe(33);
    a.due_at = new Date(2021, 3, 1, 0, 0, 0).toISOString();
    expect(getDaysLeft(a)).toBe(34);
  });
});

test('Returns correct days in different year', () => {
  forEachTZ(() => {
    dateNowSpy = jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2021, 1, 26, 0, 0, 0).valueOf());
    const a: FinalAssignment = {
      ...AssignmentDefaults,
      due_at: new Date(2022, 0, 1, 0, 0, 0).toISOString(),
    };
    expect(getDaysLeft(a)).toBe(309);
    a.due_at = new Date(2022, 11, 31, 23, 59, 59).toISOString();
    expect(getDaysLeft(a)).toBe(673);
    a.due_at = new Date(2023, 11, 31, 23, 59, 59).toISOString();
    expect(getDaysLeft(a)).toBe(1038);
  });
});

test('Returns negative days', () => {
  forEachTZ(() => {
    dateNowSpy = jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2021, 1, 26, 0, 0, 0).valueOf());
    const a: FinalAssignment = {
      ...AssignmentDefaults,
      due_at: new Date(2021, 1, 25, 0, 0, 0).toISOString(),
    };
    expect(getDaysLeft(a)).toBe(-1);
    a.due_at = new Date(2021, 1, 25, 23, 59, 59).toISOString();
    expect(getDaysLeft(a)).toBe(-1);
    a.due_at = new Date(2021, 0, 31, 23, 59, 59).toISOString();
    expect(getDaysLeft(a)).toBe(-26);
    a.due_at = new Date(2020, 11, 31, 23, 59, 59).toISOString();
    expect(getDaysLeft(a)).toBe(-57);
  });
});
