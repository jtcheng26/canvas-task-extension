import { FinalAssignment } from '../../../types';

export default function cutAssignmentList(
  cut: boolean,
  length: number,
  assignments: FinalAssignment[]
): FinalAssignment[] {
  return assignments.slice(
    0,
    Math.min(cut ? length : assignments.length, assignments.length)
  );
}
