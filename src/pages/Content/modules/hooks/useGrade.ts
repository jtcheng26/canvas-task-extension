import { Assignment } from '../types';

/* Use grade for assignment */
export default function useGrade(assignment: Assignment): number {
  let grade = 0;

  if (assignment.submission) {
    grade = assignment.submission.score ? assignment.submission.score : 0;
    if (assignment.submission.grade === 'complete') grade = 1;
    if (
      typeof assignment.submission.grade === 'string' &&
      assignment.submission.grade.length === 1 &&
      assignment.submission.grade.match(/[A-E]/i)
    )
      grade = 1;
  }

  return grade;
}
