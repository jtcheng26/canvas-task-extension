import {
  completeGrade,
  letterGrades,
  submittedUngraded,
  unsubmittedGraded,
  unsubmittedUngraded,
} from '../tests/data/assignment';
import useGrade from './useGrade';

test('grade is equal to 1 when submission grade is complete', () => {
  expect(useGrade(completeGrade)).toBe(1);
});

test('grade is equal to 1 when submission grade is letter', () => {
  letterGrades.forEach((data) => {
    expect(useGrade(data)).toBe(1);
  });
});

test('grade is 0 when there is no assignment.submission', () => {
  expect(useGrade(unsubmittedUngraded)).toBe(0);
});

test('unsubmitted but graded sets the grade', () => {
  expect(useGrade(unsubmittedGraded)).toBe(unsubmittedGraded.submission?.score);
});

test('submitted ungraded sets grade to 0', () => {
  expect(useGrade(submittedUngraded)).toBe(0);
});
