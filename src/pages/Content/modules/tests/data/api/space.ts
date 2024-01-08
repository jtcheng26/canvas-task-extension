import { AssignmentType, Course, PlannerAssignment } from '../../../types';
import { TestSpace } from '../../utils/generate';

export const courses_tests: Partial<Course>[][] = (() => {
  const random_courses: Partial<Course>[][] = [];
  for (let i = 0; i < 100; i++) {
    const n = Math.floor(Math.random() * 15);
    const courses: Partial<Course>[] = [];
    for (let j = 1; j <= n; j++) {
      const c: Partial<Course> = {
        id: j + '',
        name: 'Course ' + j,
      };
      if (Math.random() < 0.5) c.course_code = 'course-' + j;
      if (Math.random() < 0.1) c.access_restricted_by_date = true;
      if (Math.random() < 0.2) c.original_name = 'Course_' + j;
      courses.push(c);
    }
    random_courses.push(courses);
  }
  return random_courses;
})();

export const custom_colors_tests = [
  {
    custom_colors: {
      1: '#4989F4',
      2: '#DC4B3F',
      3: '#7E57C2',
      4: '#1AA260',
    },
  },
  { custom_colors: {} },
  {
    custom_colors: {
      1: '#4989F4',
      2: '#DC4B3F',
      3: '#7E57C2',
      4: '#1AA260',
      5: '#8F3E97',
      6: '#1770AB',
      7: '#FF2717',
      8: '#009606',
      9: '#4989F4',
      10: '#DC4B3F',
      11: '#7E57C2',
      12: '#1AA260',
      13: '#8F3E97',
      14: '#1770AB',
    },
  },
];

export const custom_pos_tests = [
  {
    dashboard_positions: {
      '1': 3,
      '2': 2,
      '3': 1,
      '4': 0,
    },
  },
  {
    dashboard_positions: {},
  },
  {
    dashboard_positions: {
      '1': 14,
      '2': 13,
      '3': 12,
      '4': 11,
      '5': 10,
      '6': 9,
      '7': 8,
      '8': 7,
      '9': 6,
      '10': 5,
      '11': 4,
      '12': 3,
      '13': 2,
      '14': 1,
      '15': 0,
    },
  },
];

export const all_planner_tests: TestSpace<PlannerAssignment> = {
  id: ['gen_random_number', undefined],
  course_id: [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    undefined,
  ],
  plannable_id: ['gen_random_number', undefined],
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
      assignment_id: ['gen_random_number', undefined],
      id: ['gen_random_number'],
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
