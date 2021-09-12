import axios, { AxiosResponse } from 'axios';
import { Assignment, Options, StringStringLookup } from '../types';
import useCourses from './useCourses';
import { useQuery, UseQueryResult } from 'react-query';
import { Course } from '../types';
import dashCourses from '../utils/dashCourses';
import onCoursePage from '../utils/onCoursePage';
import AssignmentMap from '../types/assignmentMap';
import useGrade from './useGrade';
import useCourseNames from './useCourseNames';
import useCourseColors from './useCourseColors';
import baseURL from '../utils/baseURL';
import { DemoAssignments } from '../tests/demo';

/* Get assignments for a stringified list of up to 10 courses */
function getAssignmentsRequest(
  start: string,
  end: string,
  courseList: string
): Promise<AxiosResponse> {
  return axios.get(
    `${baseURL()}/api/v1/calendar_events?type=assignment&start_date=${start}&end_date=${end}${courseList}&per_page=100&include=submission`
  );
}

export function getAllAssignmentRequests(
  start: string,
  end: string,
  courses: Course[]
): Promise<AxiosResponse>[] {
  let page = 0;
  const requests = [];
  while (page * 10 < courses.length) {
    let courseList = '';
    for (let i = 10 * page; i < 10 * page + 10 && i < courses.length; i++) {
      courseList += `&context_codes[]=course_${courses[i].id}`;
    }
    requests.push(getAssignmentsRequest(start, end, courseList));
    page++;
  }
  return requests;
}

export function onlyUnlockedAssignments(
  assignments: AssignmentMap
): AssignmentMap {
  const newAssignments: AssignmentMap = {};
  Object.keys(assignments).forEach((course) => {
    newAssignments[course] = assignments[course].filter((assignment) => {
      if (assignment.locked_for_user) {
        // if locked but submitted/graded already, include in chart
        if (assignment.submission)
          return (
            assignment.submission.attempt ||
            assignment.submission.score ||
            assignment.submission.grade
          );
        return false;
      }
      return true;
    });
  });

  return newAssignments;
}

export function withinTimeBounds(
  startDate: Date,
  endDate: Date,
  assignments: AssignmentMap
): AssignmentMap {
  const newAssignments: AssignmentMap = {};
  Object.keys(assignments).forEach((course) => {
    newAssignments[course] = assignments[course].filter((assignment) => {
      const due_date = new Date(assignment.due_at);
      return (
        due_date.valueOf() >= startDate.valueOf() &&
        due_date.valueOf() < endDate.valueOf()
      );
    });
  });
  return newAssignments;
}

export function onlyTheseCourses(
  courses: number[],
  assignments: AssignmentMap
): AssignmentMap {
  const newAssignments: AssignmentMap = {};
  courses.forEach((course) => {
    newAssignments[course] = assignments[course];
  });
  return newAssignments;
}

export function onlyActiveAssignments(
  assignments: AssignmentMap
): AssignmentMap {
  const newAssignments: AssignmentMap = {};
  Object.keys(assignments).forEach((course) => {
    if (assignments[course].length) {
      newAssignments[course] = assignments[course];
    }
  });

  return newAssignments;
}

async function getAssignments(
  startDate: Date,
  endDate: Date,
  options: Options,
  colors: StringStringLookup,
  names: StringStringLookup,
  courses: Course[]
): Promise<AssignmentMap> {
  /* Expand bounds by 1 day to account for possible time zone differences with api */
  const st = new Date(startDate);
  st.setDate(startDate.getDate() - 1);
  const en = new Date(endDate);
  en.setDate(en.getDate() + 1);

  const startStr = st.toISOString().split('T')[0];
  const endStr = en.toISOString().split('T')[0];
  const requests = process.env.DEMO
    ? [
        {
          data: DemoAssignments.map((d) => {
            return {
              assignment: d,
            };
          }),
        },
      ]
    : await axios.all(getAllAssignmentRequests(startStr, endStr, courses));

  let assignments: AssignmentMap = {};
  courses.forEach((course) => {
    assignments[course.id] = [];
  });

  requests.forEach((request) => {
    request.data.forEach((data: { assignment: Assignment }) => {
      data.assignment.color = colors[data.assignment.course_id];
      data.assignment.course_name = names[data.assignment.course_id];
      data.assignment.grade = useGrade(data.assignment);
      assignments[data.assignment.course_id].push(data.assignment);
    });
  });

  assignments = onlyUnlockedAssignments(assignments);

  assignments = withinTimeBounds(startDate, endDate, assignments);

  const coursePageId = onCoursePage();
  if (coursePageId !== false) {
    assignments = onlyTheseCourses([coursePageId], assignments);
  } else {
    const dash = dashCourses();
    if (options.dash_courses && dash)
      assignments = onlyTheseCourses(Array.from(dash), assignments);
    else assignments = onlyActiveAssignments(assignments);
  }

  return assignments;
}

export default function useAssignments(
  startDate: Date,
  endDate: Date,
  options: Options
): UseQueryResult {
  const { data: courses } = useCourses();
  const { data: colors } = useCourseColors();
  const { data: names } = useCourseNames();
  return useQuery(
    ['names', startDate, endDate],
    () =>
      getAssignments(
        startDate,
        endDate,
        options,
        colors as StringStringLookup,
        names as StringStringLookup,
        courses as Course[]
      ),
    {
      staleTime: Infinity,
      enabled: !!courses && !!colors && !!names,
    }
  );
}
