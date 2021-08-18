import { Assignment } from '../types';
import { getWeekStart } from '../utils/getWeek';

/*
  Pretty demo assignments
*/

const days = [];
for (let i = 1; i < 7; i++) {
  const day = getWeekStart(1);
  day.setDate(day.getDate() + i);
  day.setHours(8, 30, 0);
  days.push(day.toISOString());
}

const demoUnfinishedAssignments: Assignment[] = [
  {
    color: '#8F3E97',
    html_url: '#',
    name: 'Worksheet 6.4',
    points_possible: 10,
    due_at: days[0],
    course_id: 1,
    id: 10,
    user_submitted: false,
    is_quiz_assignment: false,
    course_name: 'Algebra 2 - Smith',
    grade: 0,
  },
  {
    color: '#1770AB',
    html_url: '#',
    name: 'Socratic Seminar',
    points_possible: 20,
    due_at: days[1],
    course_id: 2,
    id: 11,
    user_submitted: false,
    is_quiz_assignment: false,
    course_name: 'English 11 - Brown',
    grade: 0,
    discussion_topic: 0,
  },
  {
    color: '#FF2717',
    html_url: '#',
    name: 'Monroe Doctrine Quiz',
    points_possible: 15,
    due_at: days[2],
    course_id: 3,
    id: 12,
    user_submitted: false,
    is_quiz_assignment: true,
    course_name: 'US History - Jones',
    grade: 0,
  },
  {
    color: '#009606',
    html_url: '#',
    name: 'Nitrogen Cycle Worksheet',
    points_possible: 10,
    due_at: days[3],
    course_id: 4,
    id: 13,
    user_submitted: false,
    is_quiz_assignment: false,
    course_name: 'Biology - McCoy',
    grade: 0,
  },
  {
    color: '#1770AB',
    html_url: '#',
    name: 'Macbeth Essay',
    points_possible: 50,
    due_at: days[4],
    course_id: 2,
    id: 14,
    user_submitted: false,
    is_quiz_assignment: false,
    course_name: 'English 11 - Brown',
    grade: 0,
    discussion_topic: 0,
  },
  {
    color: '#1770AB',
    html_url: '#',
    name: 'Sonnet #26 Response',
    points_possible: 15,
    due_at: days[5],
    course_id: 2,
    id: 15,
    user_submitted: false,
    is_quiz_assignment: false,
    course_name: 'English 11 - Brown',
    grade: 0,
    discussion_topic: 0,
  },
];

const demoFinishedAssignments: Assignment[] = [];

for (let i = 0; i < 2; i++) {
  demoFinishedAssignments.push({
    color: '#1770AB',
    html_url: '#',
    name: 'Done',
    points_possible: 15,
    due_at: days[2],
    course_id: 2,
    id: 20 + i,
    user_submitted: true,
    is_quiz_assignment: false,
    course_name: 'English 11 - Brown',
    grade: 0,
    discussion_topic: 0,
  });
}

for (let i = 0; i < 5; i++) {
  demoFinishedAssignments.push({
    color: '#009606',
    html_url: '#',
    name: 'Done',
    points_possible: 10,
    due_at: days[2],
    course_id: 4,
    id: 40 + i,
    user_submitted: true,
    is_quiz_assignment: false,
    course_name: 'Biology - McCoy',
    grade: 0,
  });
}

for (let i = 0; i < 3; i++) {
  demoFinishedAssignments.push({
    color: '#FF2717',
    html_url: '#',
    name: 'Done',
    points_possible: 15,
    due_at: days[2],
    course_id: 3,
    id: 40 + i,
    user_submitted: true,
    is_quiz_assignment: true,
    course_name: 'US History - Jones',
    grade: 0,
  });
}

demoFinishedAssignments.push({
  color: '#8F3E97',
  html_url: '#',
  name: 'Done',
  points_possible: 10,
  due_at: days[0],
  course_id: 1,
  id: 10,
  user_submitted: true,
  is_quiz_assignment: false,
  course_name: 'Algebra 2 - Smith',
  grade: 0,
});

const demoAssignments = demoUnfinishedAssignments.concat(
  demoFinishedAssignments
);

const demoCourses = [
  {
    id: 1,
    color: '#8F3E97',
    name: 'Algebra 2 - Smith',
    position: 0,
  },
  {
    id: 2,
    color: '#1770AB',
    name: 'English 11 - Brown',
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

export { demoAssignments, demoCourses };
