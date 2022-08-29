import { Course, AssignmentType, PlannerAssignment } from '../types';

/*
  Pretty demo assignments
*/

const days = [];
for (let i = 1; i < 7; i++) {
  const day = new Date();
  day.setDate(day.getDate() + 1 + Math.floor(4 * Math.random()));
  day.setHours(8, 30, 0);
  days.push(day.toISOString());
}

const DemoAssignments: PlannerAssignment[] = [
  {
    html_url: '#',
    plannable: {
      title: 'Worksheet 6.4',
      id: 10,
      due_at: days[0],
      points_possible: 10,
    },
    course_id: 1,
    plannable_id: 10,
    submissions: false,
    plannable_type: AssignmentType.ASSIGNMENT,
    planner_override: null,
  },
  {
    html_url: '#',
    plannable: {
      title: 'Done',
      id: 11,
      due_at: days[0],
      points_possible: 10,
    },
    course_id: 1,
    plannable_id: 11,
    submissions: {
      submitted: true,
      excused: false,
      graded: false,
      needs_grading: true,
    },
    plannable_type: AssignmentType.ASSIGNMENT,
    planner_override: null,
  },
  {
    html_url: '#',
    plannable: {
      title: 'Socratic Seminar',
      id: 12,
      due_at: days[1],
      points_possible: 20,
    },
    course_id: 2,
    plannable_id: 12,
    submissions: false,
    plannable_type: AssignmentType.DISCUSSION,
    planner_override: null,
  },
  {
    html_url: '#',
    plannable: {
      title: 'Hamlet Essay',
      id: 13,
      due_at: days[4],
      points_possible: 50,
    },
    course_id: 2,
    plannable_id: 13,
    submissions: false,
    plannable_type: AssignmentType.ASSIGNMENT,
    planner_override: null,
  },
  {
    html_url: '#',
    plannable: {
      title: 'Sonnet #26 Response',
      id: 14,
      due_at: days[5],
      points_possible: 15,
    },
    course_id: 2,
    plannable_id: 14,
    submissions: false,
    plannable_type: AssignmentType.DISCUSSION,
    planner_override: null,
  },
  {
    html_url: '#',
    plannable: {
      title: 'Done',
      id: 15,
      due_at: days[2],
      points_possible: 10,
    },
    course_id: 2,
    plannable_id: 15,
    submissions: {
      submitted: true,
      excused: false,
      graded: false,
      needs_grading: true,
    },
    plannable_type: AssignmentType.DISCUSSION,
    planner_override: null,
  },
  {
    html_url: '#',
    plannable: {
      title: 'Done',
      id: 16,
      due_at: days[2],
      points_possible: 10,
    },
    course_id: 2,
    plannable_id: 16,
    submissions: {
      submitted: true,
      excused: false,
      graded: false,
      needs_grading: true,
    },
    plannable_type: AssignmentType.DISCUSSION,
    planner_override: null,
  },
  {
    html_url: '#',
    plannable: {
      title: 'Done',
      id: 17,
      due_at: days[2],
      points_possible: 15,
    },
    course_id: 3,
    plannable_id: 17,
    submissions: {
      submitted: true,
      excused: false,
      graded: false,
      needs_grading: true,
    },
    plannable_type: AssignmentType.QUIZ,
    planner_override: null,
  },
  {
    html_url: '#',
    plannable: {
      title: 'Done',
      id: 18,
      due_at: days[2],
      points_possible: 15,
    },
    course_id: 3,
    plannable_id: 18,
    submissions: {
      submitted: true,
      excused: false,
      graded: false,
      needs_grading: true,
    },
    plannable_type: AssignmentType.QUIZ,
    planner_override: null,
  },
  {
    html_url: '#',
    plannable: {
      title: 'Done',
      id: 19,
      due_at: days[2],
      points_possible: 15,
    },
    course_id: 3,
    plannable_id: 19,
    submissions: {
      submitted: true,
      excused: false,
      graded: false,
      needs_grading: true,
    },
    plannable_type: AssignmentType.QUIZ,
    planner_override: null,
  },
  {
    html_url: '#',
    plannable: {
      title: 'Civil War Quiz',
      id: 20,
      due_at: days[2],
      points_possible: 15,
    },
    course_id: 3,
    plannable_id: 20,
    submissions: {
      submitted: false,
      excused: false,
      graded: false,
      needs_grading: false,
    },
    plannable_type: AssignmentType.QUIZ,
    planner_override: null,
  },
  {
    html_url: '#',
    plannable: {
      title: 'Nitrogen Cycle Worksheet',
      id: 21,
      due_at: days[3],
      points_possible: 10,
    },
    course_id: 4,
    plannable_id: 21,
    submissions: false,
    plannable_type: AssignmentType.ASSIGNMENT,
    planner_override: null,
  },
  {
    html_url: '#',
    plannable: {
      title: 'Done',
      id: 22,
      due_at: days[2],
      points_possible: 10,
    },
    course_id: 4,
    plannable_id: 22,
    submissions: {
      submitted: true,
      graded: false,
      needs_grading: true,
    },
    plannable_type: AssignmentType.ASSIGNMENT,
    planner_override: null,
  },
  {
    html_url: '#',
    plannable: {
      title: 'Done',
      id: 23,
      due_at: days[2],
      points_possible: 10,
    },
    course_id: 4,
    plannable_id: 23,
    submissions: {
      submitted: true,
      graded: false,
      needs_grading: true,
    },
    plannable_type: AssignmentType.ASSIGNMENT,
    planner_override: null,
  },
  {
    html_url: '#',
    plannable: {
      title: 'Done',
      id: 24,
      due_at: days[2],
      points_possible: 10,
    },
    course_id: 4,
    plannable_id: 24,
    submissions: {
      submitted: true,
      graded: false,
      needs_grading: true,
    },
    plannable_type: AssignmentType.ASSIGNMENT,
    planner_override: null,
  },
  {
    html_url: '#',
    plannable: {
      title: 'Done',
      id: 25,
      due_at: days[2],
      points_possible: 10,
    },
    course_id: 4,
    plannable_id: 25,
    submissions: {
      submitted: true,
      graded: false,
      needs_grading: true,
    },
    plannable_type: AssignmentType.ASSIGNMENT,
    planner_override: null,
  },
  {
    html_url: '#',
    plannable: {
      title: 'Done',
      id: 26,
      due_at: days[2],
      points_possible: 10,
    },
    course_id: 4,
    plannable_id: 26,
    submissions: {
      submitted: true,
      graded: false,
      needs_grading: true,
    },
    plannable_type: AssignmentType.ASSIGNMENT,
    planner_override: null,
  },
];

const DemoCourses: Course[] = [
  {
    id: 1,
    color: '#8F3E97',
    name: 'Calculus 2 - Parisi',
    position: 0,
  },
  {
    id: 2,
    color: '#1770AB',
    name: 'English Literature - Russell',
    position: 1,
  },
  {
    id: 3,
    color: '#FF2717',
    name: 'US History - Jones',
    position: 2,
  },
  {
    id: 4,
    color: '#009606',
    name: 'Biology - McCoy',
    position: 3,
  },
];

const DemoPositions: Record<string, number> = {
  1: 3,
  2: 2,
  3: 1,
  4: 0,
};

const DemoColors: Record<string, string> = {
  1: '#8F3E97',
  2: '#1770AB',
  3: '#FF2717',
  4: '#009606',
};

const DemoNames: Record<string, string> = {
  1: 'Calculus 2 - Parisi',
  2: 'English Literature - Russell',
  3: 'US History - Jones',
  4: 'Biology - McCoy',
};

export { DemoAssignments, DemoCourses, DemoColors, DemoNames, DemoPositions };
