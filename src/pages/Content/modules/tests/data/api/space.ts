import { AssignmentType, PlannerAssignment } from '../../../types';
import { TestSpace } from '../../utils/generate';

export const all_planner_tests: TestSpace<PlannerAssignment> = {
  id: ['1', undefined],
  course_id: ['0', '1', undefined],
  plannable_id: ['1', undefined],
  plannable_type: [
    AssignmentType.ANNOUNCEMENT,
    AssignmentType.ASSIGNMENT,
    AssignmentType.DISCUSSION,
    AssignmentType.EVENT,
    AssignmentType.NOTE,
    AssignmentType.QUIZ,
    undefined,
  ],
  planner_override: [
    {
      id: ['2'],
      marked_complete: [true, false],
      dismissed: [true, false],
    },
    null,
    undefined,
  ],
  plannable_date: [new Date().toISOString(), undefined],
  submissions: [
    {
      submitted: [true, false, undefined],
      excused: [true, false, undefined],
      graded: [true, false, undefined],
      missing: [undefined],
      late: [undefined],
      needs_grading: [true, false, undefined],
      redo_request: [undefined],
      posted_at: [undefined],
    },
    false,
    undefined,
  ],
  plannable: [
    {
      assignment_id: ['1', undefined],
      id: ['1', '3'],
      title: ['Plannable title', ''],
      details: [
        undefined,
        '',
        'My new task',
        'Created using Tasks for Canvas',
        'Created using Tasks for Canvas\nInstructor Note',
        'Created using Tasks for Canvas\nInstructor Note\n#',
        'Created using Tasks for Canvas\nInstructor Note\n\n0',
        'Created using Tasks for Canvas\nInstructor Note\n\n1',
        'Created using Tasks for Canvas\nNote\n#\n1',
        'Created using Tasks for Canvas\nNote\n#\n\n',
      ],
      due_at: [new Date().toISOString(), undefined],
      todo_date: [new Date().toISOString(), undefined],
      points_possible: [undefined, 0, 1],
      course_id: [undefined, '0'],
      linked_object_html_url: [undefined, '#'],
      read_state: [undefined, 'unread', 'read'],
    },
  ],
  html_url: ['/', '', undefined],
};
