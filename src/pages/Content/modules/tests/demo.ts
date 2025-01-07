import { NeedsGradingCount } from '../plugins/canvas/loaders/loadNeedsGrading';
import { Course, AssignmentType, PlannerAssignment } from '../types';
import { TodoResponse } from '../types/assignment';
import { MissingAssignment } from '../types/assignment';

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
      id: '10',
      due_at: days[0],
      points_possible: 10,
    },
    course_id: '1',
    plannable_id: '10',
    submissions: false,
    plannable_type: AssignmentType.ASSIGNMENT,
    planner_override: null,
  },
  {
    html_url: '#',
    plannable: {
      title: 'Done',
      id: '11',
      due_at: days[0],
      points_possible: 10,
    },
    course_id: '1',
    plannable_id: '11',
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
      id: '12',
      due_at: days[1],
      points_possible: 20,
    },
    course_id: '2',
    plannable_id: '12',
    submissions: false,
    plannable_type: AssignmentType.DISCUSSION,
    planner_override: null,
  },
  {
    html_url: '#',
    plannable: {
      title: 'Hamlet Essay',
      id: '13',
      due_at: days[4],
      points_possible: 50,
    },
    course_id: '2',
    plannable_id: '13',
    submissions: false,
    plannable_type: AssignmentType.ASSIGNMENT,
    planner_override: null,
  },
  {
    html_url: '#',
    plannable: {
      title: 'Sonnet #26 Response',
      id: '14',
      due_at: days[5],
      points_possible: 15,
    },
    course_id: '2',
    plannable_id: '14',
    submissions: false,
    plannable_type: AssignmentType.DISCUSSION,
    planner_override: null,
  },
  {
    html_url: '#',
    plannable: {
      title: 'Done',
      id: '15',
      due_at: days[2],
      points_possible: 10,
    },
    course_id: '2',
    plannable_id: '15',
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
      id: '16',
      due_at: days[2],
      points_possible: 10,
    },
    course_id: '2',
    plannable_id: '16',
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
      id: '17',
      due_at: days[2],
      points_possible: 15,
    },
    course_id: '3',
    plannable_id: '17',
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
      id: '18',
      due_at: days[2],
      points_possible: 15,
    },
    course_id: '3',
    plannable_id: '18',
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
      id: '19',
      due_at: days[2],
      points_possible: 15,
    },
    course_id: '3',
    plannable_id: '19',
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
      id: '20',
      due_at: days[2],
      points_possible: 15,
    },
    course_id: '3',
    plannable_id: '20',
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
      id: '21',
      due_at: days[3],
      points_possible: 10,
    },
    course_id: '4',
    plannable_id: '21',
    submissions: false,
    plannable_type: AssignmentType.ASSIGNMENT,
    planner_override: null,
  },
  {
    html_url: '#',
    plannable: {
      title: 'Done',
      id: '22',
      due_at: days[2],
      points_possible: 10,
    },
    course_id: '4',
    plannable_id: '22',
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
      id: '23',
      due_at: days[2],
      points_possible: 10,
    },
    course_id: '4',
    plannable_id: '23',
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
      id: '24',
      due_at: days[2],
      points_possible: 10,
    },
    course_id: '4',
    plannable_id: '24',
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
      id: '25',
      due_at: days[2],
      points_possible: 10,
    },
    course_id: '4',
    plannable_id: '25',
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
      id: '26',
      due_at: days[2],
      points_possible: 10,
    },
    course_id: '4',
    plannable_id: '26',
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
    id: '1',
    color: '#8F3E97',
    name: 'Calculus 2 - Parisi',
    course_code: 'Calculus 2 - Parisi',
    position: 0,
  },
  {
    id: '2',
    color: '#1770AB',
    name: 'English Literature - Russell',
    course_code: 'English Literature - Russell',
    position: 1,
  },
  {
    id: '3',
    color: '#FF2717',
    name: 'US History - Jones',
    course_code: 'US History - Jones',
    position: 2,
  },
  {
    id: '4',
    color: '#009606',
    name: 'Biology - McCoy',
    course_code: 'Biology - McCoy',
    position: 3,
  },
  {
    id: '5',
    color: '#FFB300',
    name: 'Computer Science — Susan',
    course_code: 'Computer Science — Susan',
    position: 4,
  },
];

const DemoPositions: Record<string, number> = {
  '1': 4,
  '2': 3,
  '3': 2,
  '4': 1,
  '5': 0,
};

const DemoColors: Record<string, string> = {
  1: '#4989F4', //'#8F3E97',
  2: '#DC4B3F', //'#1770AB',
  3: '#7E57C2', //'#FF2717',
  4: '#1AA260', //'#009606',
  5: '#FFB300',
};

const DemoNames: Record<string, string> = {
  1: 'Calculus 2 - Parisi',
  2: 'English Literature - Russell',
  3: 'US History - Jones',
  4: 'Biology - McCoy',
  5: 'Computer Science — Susan',
};

const DemoTeacherAssignments: TodoResponse[] = [
  {
    assignment: {
      html_url: '#',
      name: 'Worksheet 6.4',
      id: '10',
      due_at: days[0],
      points_possible: 10,
      course_id: '1',
      needs_grading_count: 0,
    },
    needs_grading_count: 0,
  },
  {
    assignment: {
      html_url: '#',
      name: 'Civil War Quiz',
      id: '20',
      due_at: days[2],
      points_possible: 15,
      course_id: '3',
      is_quiz_assignment: true,
      needs_grading_count: 3,
    },
    needs_grading_count: 3,
  },
  {
    assignment: {
      html_url: '#',
      name: 'Nitrogen Cycle Worksheet',
      id: '21',
      due_at: days[3],
      points_possible: 10,
      course_id: '4',
      needs_grading_count: 10,
    },
    needs_grading_count: 10,
  },
  {
    assignment: {
      html_url: '#',
      name: 'Hamlet Essay',
      id: '13',
      due_at: days[4],
      points_possible: 50,
      course_id: '2',
      needs_grading_count: 20,
    },
    needs_grading_count: 20,
  },
];

const DemoNeedsGrading: Record<string, NeedsGradingCount> = {
  '13': {
    id: '13',
    needs_grading: 20,
    total: 28,
  },
  '21': {
    id: '21',
    needs_grading: 10,
    total: 12,
  },
  '20': {
    id: '20',
    needs_grading: 3,
    total: 20,
  },
  '10': {
    id: '10',
    needs_grading: 0,
    total: 5,
  },
};

const DemoMissing: MissingAssignment[] = [
  {
    html_url: '',
    planner_override: null,
    id: 2000,
    course_id: 1,
    name: 'Missing Assignment',
    due_at: new Date('2022-01-01').toISOString(),
    points_possible: 20,
  },
  {
    html_url: '',
    planner_override: {
      id: 10,
      plannable_id: 1000,
      plannable_type: AssignmentType.QUIZ,
    },
    id: 1000,
    course_id: 2,
    name: 'Overdue Quiz',
    due_at: new Date('2022-01-01').toISOString(),
    points_possible: 10,
  },
];

export {
  DemoAssignments,
  DemoMissing,
  DemoCourses,
  DemoColors,
  DemoNames,
  DemoPositions,
  DemoNeedsGrading,
  DemoTeacherAssignments,
};
