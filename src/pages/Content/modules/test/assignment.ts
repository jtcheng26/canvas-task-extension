import { Assignment } from '../types';

const finishedAssignment: Assignment = {
  color: 'rgb(0, 0, 0)',
  html_url: 'https://this.is.a.test/',
  name: `Finished Assignment Test`,
  points_possible: 5,
  due_at: new Date().toISOString(),
  course_id: 123456,
  id: -3,
  user_submitted: true,
  grade: 1,
  is_quiz_assignment: false,
  course_code: 'Code 123456',
};
const finishedAssignments: Assignment[] = [];
const assignmentCount = 1000;

for (let i = 1; i <= assignmentCount; i++) {
  finishedAssignments.push({
    color: 'rgb(0, 0, 0)',
    html_url: 'https://this.is.a.test/',
    name: `Finished Assignment Test ${i}`,
    points_possible: 5,
    due_at: new Date().toISOString(),
    course_id: i <= assignmentCount / 2 ? 1 : 2,
    id: 20 + assignmentCount + i,
    user_submitted: true,
    grade: 1,
    is_quiz_assignment: false,
    course_code: `Code ${20 + assignmentCount + i}`,
  });
}

let due_at: Date | string = new Date();
due_at.setMonth(1);
due_at.setDate(1);
due_at.setFullYear(1990);
due_at.setHours(10, 10, 10, 10);
due_at = due_at.toISOString();

const unfinishedAssignment2: Assignment = {
  color: 'rgb(0, 0, 0)',
  html_url: 'https://this.is.a.test/',
  name: `Dummy Assignment`,
  points_possible: 10,
  due_at: due_at,
  course_id: 123456,
  id: -4,
  user_submitted: false,
  grade: 0,
  is_quiz_assignment: false,
  course_code: 'Code 123456',
};

const unfinishedAssignment: Assignment = {
  color: 'rgb(0, 0, 0)',
  html_url: 'https://this.is.a.test/',
  name: `Unfinished Assignment Test`,
  points_possible: 5,
  due_at: new Date().toISOString(),
  course_id: 123456,
  id: -2,
  user_submitted: false,
  grade: 0,
  is_quiz_assignment: false,
  course_code: 'Code 123456',
};

const unfinishedAssignments: Assignment[] = [];

for (let i = 1; i <= assignmentCount; i++) {
  unfinishedAssignments.push({
    color: 'rgb(0, 0, 0)',
    html_url: 'https://this.is.a.test/',
    name: `Unfinished Assignment Test ${i}`,
    points_possible: 5,
    due_at: new Date().toISOString(),
    course_id: i <= assignmentCount / 2 ? 1 : 2,
    id: 20 + i,
    user_submitted: false,
    grade: 0,
    is_quiz_assignment: false,
    course_code: `Code ${20 + i}`,
  });
}

const unsubmittedButGradedAssignment: Assignment = {
  color: 'rgb(0, 0, 0)',
  html_url: 'https://this.is.a.test/',
  name: `Unfinished Assignment Test`,
  points_possible: 5,
  due_at: new Date().toISOString(),
  course_id: 123456,
  id: -1,
  user_submitted: false,
  grade: 1,
  is_quiz_assignment: false,
  course_code: 'Code 123456',
};

finishedAssignments.push(unsubmittedButGradedAssignment);

export {
  finishedAssignments,
  unfinishedAssignments,
  unsubmittedButGradedAssignment,
  unfinishedAssignment,
  unfinishedAssignment2,
  finishedAssignment,
};
