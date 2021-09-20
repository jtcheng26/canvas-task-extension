import { Assignment } from '../types';
import { ringProgress } from './numDone';

export default function taskComplete(assignment: Assignment): boolean {
  return !(!assignment.user_submitted && ringProgress(assignment) == 0);
}
