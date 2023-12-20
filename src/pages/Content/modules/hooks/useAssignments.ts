import axios from 'axios';
import {
  AssignmentType,
  FinalAssignment,
  Options,
  PlannerAssignment,
} from '../types';
import dashCourses from '../utils/dashCourses';
import onCoursePage from '../utils/onCoursePage';
import baseURL from '../utils/baseURL';
import { DemoAssignments } from '../tests/demo';
import { AssignmentDefaults } from '../constants';
import isDemo from '../utils/isDemo';
import JSONBigInt from 'json-bigint';
import loadNeedsGrading from './useNeedsGrading';
import { useEffect, useState } from 'react';

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
  try {
    const res = await axios.get(url, {
      transformResponse: [(data) => JSONBigInt.parse(data)],
    });

    if (recurse && 'link' in res.headers) {
      const parsed = parseLinkHeader(res.headers['link']);
      if (parsed && 'next' in parsed && parsed['next'].url !== url)
        return (res.data as T[]).concat(
          (await getPaginatedRequest(parsed['next'].url, true)) as T[]
        );
    }

    return res.data;
  } catch (err) {
    console.error(err);
    return []; // still return all successful pages if error instead of hanging
  }
}

/* Get assignments from api */
async function getAllAssignmentsRequest(
  start: string,
  end: string,
  allPages = true
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
      id: assignment.plannable_id.toString(),
      plannable_id: assignment.plannable_id.toString(), // just in case it changes in the future
      override_id: assignment.planner_override?.id.toString(),
      course_id: (
        assignment.course_id || assignment.plannable.course_id
      )?.toString(),
      name: assignment.plannable.title,
      due_at:
        assignment.plannable.due_at ||
        assignment.plannable.todo_date ||
        assignment.plannable_date,
      points_possible: assignment.plannable.points_possible,
      submitted:
        assignment.submissions !== false
          ? assignment.submissions.submitted
          : undefined,
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
        assignment.planner_override?.dismissed ||
        (assignment.plannable_type === AssignmentType.ANNOUNCEMENT &&
          assignment.plannable.read_state === 'read'),
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
  courses: string[],
  assignments: FinalAssignment[]
): FinalAssignment[] {
  const courseSet = new Set(courses);
  return assignments.filter((assignment) => {
    return (
      (assignment.course_id === '0' || !!assignment.course_id) &&
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
    AssignmentType.ANNOUNCEMENT,
  ];
  return assignments.filter((assignment) =>
    validAssignments.includes(assignment.type)
  );
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
  const data = isDemo()
    ? DemoAssignments
    : await getAllAssignmentsRequest(startStr, endStr);

  return convertPlannerAssignments(data as PlannerAssignment[]);
}

export function processAssignmentList(
  assignments: FinalAssignment[],
  startDate: Date,
  endDate: Date,
  options: Options
): FinalAssignment[] {
  assignments = filterAssignmentTypes(assignments);
  assignments = filterTimeBounds(startDate, endDate, assignments);
  // if (colors) assignments = applyCourseColor(colors, assignments);
  // if (names) assignments = applyCourseName(names, assignments);
  // if (positions) assignments = applyCoursePositions(positions, assignments);
  // assignments = applyCustomTaskLabels(assignments);

  const coursePageId = onCoursePage();

  if (coursePageId !== false) {
    assignments = filterCourses([coursePageId], assignments);
  } else {
    const dash = dashCourses();
    if (options.dash_courses && dash)
      assignments = filterCourses(Array.from(dash).concat(['0']), assignments);
  }
  return assignments;
}

async function processAssignments(
  startDate: Date,
  endDate: Date,
  options: Options
): Promise<FinalAssignment[]> {
  /* modify this filter if announcements are used in the future */
  const assignments = await getAllAssignments(startDate, endDate);
  return processAssignmentList(assignments, startDate, endDate, options);
}

interface UseAssignmentsHookInterface {
  data: FinalAssignment[] | null;
  isError: boolean;
  isSuccess: boolean;
}

export default function useAssignments(
  startDate: Date,
  endDate: Date,
  options: Options
): UseAssignmentsHookInterface {
  const [data, setData] = useState<FinalAssignment[] | null>(null);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  useEffect(() => {
    setIsSuccess(false);
    setIsError(false);
    Promise.all([
      loadNeedsGrading(endDate, options),
      processAssignments(startDate, endDate, options),
    ])
      .then((res) => {
        setData(res[0].concat(res[1]));
        setIsSuccess(true);
        setIsError(false);
      })
      .catch((err) => {
        console.error(err);
        setIsError(true);
        setIsSuccess(false);
      });
  }, [startDate, endDate]);
  return { data, isError, isSuccess };
}
