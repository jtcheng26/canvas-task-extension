import axios from 'axios';
import {
  AssignmentType,
  FinalAssignment,
  Options,
  PlannerAssignment,
} from '../types';
import { useQuery, UseQueryResult } from 'react-query';
import dashCourses from '../utils/dashCourses';
import onCoursePage from '../utils/onCoursePage';
import useCourseNames from './useCourseNames';
import useCourseColors from './useCourseColors';
import baseURL from '../utils/baseURL';
import { DemoAssignments } from '../tests/demo';
import { AssignmentDefaults, OptionsDefaults } from '../constants';
import useCoursePositions from './useCoursePositions';
import isDemo from '../utils/isDemo';

const parseLinkHeader = (link: string) => {
  const re = /<([^>]+)>; rel="([^"]+)"/g;
  let arrRes: RegExpExecArray | null;
  const ret: Record<string, { url: string; page: string }> = {};
  while ((arrRes = re.exec(link)) !== null) {
    ret[arrRes[2]] = {
      url: arrRes[1],
      page: arrRes[2],
    };
  }
  return ret;
};

export async function getPaginatedRequest<T>(
  url: string,
  recurse = false
): Promise<T[]> {
  const res = await axios.get(url);
  if (recurse && 'link' in res.headers) {
    const parsed = parseLinkHeader(res.headers['link']);
    if (parsed && 'next' in parsed && parsed['next'].url !== url)
      return (res.data as T[]).concat(
        (await getPaginatedRequest(parsed['next'].url, true)) as T[]
      );
  }
  return res.data;
}

/* Get assignments from api */
async function getAllAssignmentsRequest(
  start: string,
  end: string,
  allPages = false
): Promise<PlannerAssignment[]> {
  const initialURL = `${baseURL()}/api/v1/planner/items?start_date=${start}${
    end ? '&end_date=' + end : ''
  }&per_page=1000`;
  return await getPaginatedRequest<PlannerAssignment>(initialURL, allPages);
}

/* Merge api objects into Assignment objects. */
export function convertPlannerAssignments(
  assignments: PlannerAssignment[]
): FinalAssignment[] {
  return assignments.map((assignment) => {
    const converted: Partial<FinalAssignment> = {
      html_url:
        assignment.html_url || assignment.plannable.linked_object_html_url,
      type: assignment.plannable_type,
      id: assignment.plannable_id,
      plannable_id: assignment.plannable_id, // just in case it changes in the future
      override_id: assignment.planner_override?.id,
      course_id: assignment.course_id || assignment.plannable.course_id,
      name: assignment.plannable.title,
      due_at: assignment.plannable.due_at || assignment.plannable.todo_date,
      points_possible: assignment.plannable.points_possible,
      submitted:
        assignment.submissions !== false
          ? assignment.submissions.submitted
          : undefined,
      submitted_late:
        assignment.submissions !== false && assignment.submissions.late,
      graded:
        assignment.submissions !== false
          ? assignment.submissions.excused || assignment.submissions.graded
          : undefined,
      graded_at:
        assignment.submissions !== false
          ? assignment.submissions.posted_at
          : undefined,
      marked_complete:
        assignment.planner_override?.marked_complete ||
        assignment.planner_override?.dismissed,
      marked_at: assignment.planner_override?.updated_at,
    };

    const full: FinalAssignment = {
      ...AssignmentDefaults,
    };

    Object.keys(converted).forEach((k) => {
      const prop = k as keyof FinalAssignment;
      if (converted[prop] !== null && typeof converted[prop] !== 'undefined')
        full[prop] = converted[prop] as never;
    });

    return full;
  });
}

/* Only assignments between the exact datetimes */
export function filterTimeBounds(
  startDate: Date,
  endDate: Date | '' = '',
  assignments: FinalAssignment[]
): FinalAssignment[] {
  return assignments.filter((assignment) => {
    const due_date = new Date(assignment.due_at);
    return (
      due_date.valueOf() >= startDate.valueOf() &&
      (!endDate || due_date.valueOf() < endDate.valueOf())
    );
  });
}

/* Only assignments from the specified courses */
export function filterCourses(
  courses: number[],
  assignments: FinalAssignment[]
): FinalAssignment[] {
  const courseSet = new Set(courses);
  return assignments.filter((assignment) => {
    return (
      (assignment.course_id === 0 || !!assignment.course_id) &&
      courseSet.has(assignment.course_id)
    );
  });
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

/* Set the course name of custom tasks with no course name to "Custom Task" */
export function applyCustomTaskLabels(
  assignments: FinalAssignment[]
): FinalAssignment[] {
  return assignments.map((assignment) => {
    if (assignment.type === AssignmentType.NOTE && assignment.course_id === 0)
      assignment.course_name = 'Custom Task';

    return assignment;
  });
}

export async function getAllAssignments(
  startDate: Date,
  endDate?: Date,
  allPages = false
): Promise<FinalAssignment[]> {
  /* Expand bounds by 1 day to account for possible time zone differences with api. */
  const st = new Date(startDate);
  st.setDate(startDate.getDate() - 1);
  const startStr = st.toISOString().split('T')[0];
  let endStr = '';

  if (endDate) {
    const en = new Date(endDate);
    en.setDate(en.getDate() + 1);

    endStr = en.toISOString().split('T')[0];
  }

  const requests = isDemo()
    ? DemoAssignments
    : await getAllAssignmentsRequest(startStr, endStr, allPages);
  return convertPlannerAssignments(requests as PlannerAssignment[]);
}

async function processAssignments(
  startDate: Date,
  endDate?: Date,
  options: Options = OptionsDefaults,
  colors?: Record<string, string>,
  names?: Record<string, string>,
  positions?: Record<string, number>,
  allPages = false
): Promise<FinalAssignment[]> {
  /* modify this filter if announcements are used in the future */
  let assignments = await getAllAssignments(startDate, endDate, allPages);
  assignments = filterAssignmentTypes(assignments);
  assignments = filterTimeBounds(startDate, endDate, assignments);
  if (colors) assignments = applyCourseColor(colors, assignments);
  if (names) assignments = applyCourseName(names, assignments);
  if (positions) assignments = applyCoursePositions(positions, assignments);
  assignments = applyCustomTaskLabels(assignments);

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
  endDate?: Date,
  options: Options = OptionsDefaults,
  allPages = false
): UseQueryResult<FinalAssignment[]> {
  const { data: colors } = useCourseColors(
    options.theme_color !== OptionsDefaults.theme_color
      ? options.theme_color
      : undefined
  );
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
        positions as Record<string, number>,
        allPages
      ),
    {
      staleTime: Infinity,
      enabled: !!colors && !!names,
    }
  );
}
