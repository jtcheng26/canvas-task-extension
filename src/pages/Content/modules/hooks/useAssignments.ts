import axios, { AxiosResponse } from 'axios';
import { AssignmentType, FinalAssignment, Options } from '../types';
import { useQuery, UseQueryResult } from 'react-query';
import dashCourses from '../utils/dashCourses';
import onCoursePage from '../utils/onCoursePage';
import useCourseNames from './useCourseNames';
import useCourseColors from './useCourseColors';
import baseURL from '../utils/baseURL';
import { DemoAssignments } from '../tests/demo';
import { AssignmentDefaults } from '../constants';
import useCoursePositions from './useCoursePositions';

/* Get assignments from api */
function getAllAssignmentsRequest(
  start: string,
  end: string
): Promise<AxiosResponse> {
  return axios.get(
    `${baseURL()}/api/v1/planner/items?start_date=${start}&end_date=${end}&per_page=1000`
  );
}

/* Only assignments between the exact datetimes */
export function filterTimeBounds(
  startDate: Date,
  endDate: Date,
  assignments: FinalAssignment[]
): FinalAssignment[] {
  return assignments.filter((assignment) => {
    const due_date = new Date(assignment.due_at);
    return (
      due_date.valueOf() >= startDate.valueOf() &&
      due_date.valueOf() < endDate.valueOf()
    );
  });
}

/* Only assignments from the specified courses */
export function filterCourses(
  courses: number[],
  assignments: FinalAssignment[]
): FinalAssignment[] {
  const courseSet = new Set(courses);
  return assignments.filter((assignment) =>
    courseSet.has(assignment.course_id)
  );
}

/* Only where type is assignment, discussion, quiz, or planner note */
export function filterAssignmentTypes(
  assignments: FinalAssignment[]
): FinalAssignment[] {
  const validAssignments = [
    AssignmentType.ASSIGNMENT,
    AssignmentType.DISCUSSION,
    AssignmentType.QUIZ,
    AssignmentType.NOTE,
  ];
  return assignments.filter((assignment) =>
    validAssignments.includes(assignment.type)
  );
}

/* Fill out the `color` attribute in the assignment object. */
export function applyCourseColor(
  colors: Record<string, string>,
  assignments: FinalAssignment[]
): FinalAssignment[] {
  return applyCourseValue('color', colors, assignments);
}

/* Fill out the `course_name` attribute in the assignment object. */
export function applyCourseName(
  names: Record<string, string>,
  assignments: FinalAssignment[]
): FinalAssignment[] {
  return applyCourseValue('course_name', names, assignments);
}

/* Fill out the `position` attribute in the assignment object. */
export function applyCoursePositions(
  positions: Record<string, number>,
  assignments: FinalAssignment[]
): FinalAssignment[] {
  return applyCourseValue('position', positions, assignments);
}

/* 
  Fill the `value` property of Assignment using the corresponding value to its course_id in `courseMap`.
  For DRY-ness.
 */
export function applyCourseValue(
  value: keyof FinalAssignment,
  courseMap: Record<string, string> | Record<string, number>,
  assignments: FinalAssignment[]
): FinalAssignment[] {
  return assignments.map((assignment) => {
    if (assignment.course_id in courseMap)
      assignment[value] = courseMap[assignment.course_id] as never;
    return assignment;
  });
}

/* Fetch assignment scores and assign to `score` prop. */
export function applyScore(assignments: FinalAssignment[]): FinalAssignment[] {
  return assignments.map((assignment) => {
    assignment.score = 10; // TODO: actually fetch scores from graphql
    return assignment;
  });
}

/* Fill assignment with default values, override defaults with existing properties. */
export function applyDefaults(
  defaults: FinalAssignment,
  assignments: FinalAssignment[]
): FinalAssignment[] {
  return assignments.map((assignment) => {
    return { ...defaults, ...assignment };
  });
}

export async function getAllAssignments(
  startDate: Date,
  endDate: Date
): Promise<FinalAssignment[]> {
  /* Expand bounds by 1 day to account for possible time zone differences with api. */
  const st = new Date(startDate);
  st.setDate(startDate.getDate() - 1);
  const en = new Date(endDate);
  en.setDate(en.getDate() + 1);

  const startStr = st.toISOString().split('T')[0];
  const endStr = en.toISOString().split('T')[0];
  const requests = process.env.DEMO
    ? {
        data: DemoAssignments.map((d) => {
          return {
            assignment: d,
          };
        }),
      }
    : await getAllAssignmentsRequest(startStr, endStr);

  return applyDefaults(AssignmentDefaults, requests.data as FinalAssignment[]);
}

async function processAssignments(
  startDate: Date,
  endDate: Date,
  options: Options,
  colors?: Record<string, string>,
  names?: Record<string, string>,
  positions?: Record<string, number>
): Promise<FinalAssignment[]> {
  /* modify this filter if announcements are used in the future */
  let assignments = await getAllAssignments(startDate, endDate);
  assignments = filterAssignmentTypes(assignments);
  assignments = filterTimeBounds(startDate, endDate, assignments);
  if (colors) assignments = applyCourseColor(colors, assignments);
  if (names) assignments = applyCourseName(names, assignments);
  if (positions) assignments = applyCoursePositions(positions, assignments);

  const coursePageId = onCoursePage();
  if (coursePageId !== false) {
    assignments = filterCourses([coursePageId], assignments);
  } else {
    const dash = dashCourses();
    if (options.dash_courses && dash)
      assignments = filterCourses(Array.from(dash), assignments);
  }
  return assignments;
}

export default function useAssignments(
  startDate: Date,
  endDate: Date,
  options: Options
): UseQueryResult {
  const { data: colors } = useCourseColors();
  const { data: names } = useCourseNames();
  const { data: positions } = useCoursePositions();
  return useQuery(
    ['names', startDate, endDate],
    () =>
      processAssignments(
        startDate,
        endDate,
        options,
        colors as Record<string, string>,
        names as Record<string, string>,
        positions as Record<string, number>
      ),
    {
      staleTime: Infinity,
      enabled: !!colors && !!names,
    }
  );
}
