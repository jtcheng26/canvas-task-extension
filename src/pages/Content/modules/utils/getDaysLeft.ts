import { Assignment } from '../types';

export default function getDaysLeft(assignment: Assignment): number {
  const due = new Date(assignment.due_at);
  due.setHours(0, 0, 0);
  const now = new Date(Date.now());
  now.setHours(0, 0, 0);
  return Math.round((due.getTime() - now.getTime()) / (1000 * 3600 * 24));
}
