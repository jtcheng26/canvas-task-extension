import { Assignment } from '../types';

/* Return either null or a number for the points possible */
export default function pointsPossible(assignment: Assignment): number | null {
  return !isNaN(assignment.points_possible) &&
    assignment.points_possible !== undefined &&
    assignment.points_possible !== null
    ? assignment.points_possible
    : null;
}
