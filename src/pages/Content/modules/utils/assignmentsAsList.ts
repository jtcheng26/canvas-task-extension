import AssignmentMap from '../types/assignmentMap';
import { Assignment } from '../types';

export default function assignmentsAsList(
  assignments: AssignmentMap
): Assignment[] {
  return Object.values(assignments).reduce((a, b) => {
    return a.concat(b);
  }, []);
}
