import useGrade from '../hooks/useGrade';
import {
  submittedUngraded,
  unsubmittedGraded,
  unsubmittedUngraded,
} from '../tests/data/assignment';
import { Assignment } from '../types';
import taskComplete from './taskComplete';

test('task is incomplete when there is no submission or grade', () => {
  const ff = unsubmittedUngraded as Assignment;
  ff.grade = useGrade(unsubmittedUngraded);
  expect(taskComplete(ff)).toBeFalsy();
});

test('unsubmitted but graded is complete', () => {
  const ft = unsubmittedGraded as Assignment;
  ft.grade = useGrade(unsubmittedGraded);
  expect(taskComplete(ft)).toBeTruthy();
});

test('submitted ungraded is complete', () => {
  const tf = submittedUngraded as Assignment;
  tf.grade = useGrade(submittedUngraded);
  expect(taskComplete(tf)).toBeTruthy();
});
