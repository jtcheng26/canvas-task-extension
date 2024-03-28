import axios from 'axios';
import {
  AssignmentType,
  FinalAssignment,
  Options,
  PlannerAssignment,
} from '../../../types';
import baseURL from '../../../utils/baseURL';
import { DemoAssignments } from '../../../tests/demo';
import { AssignmentDefaults } from '../../../constants';
import isDemo from '../../../utils/isDemo';
import JSONBigInt from 'json-bigint';
import loadNeedsGrading from './loadNeedsGrading';
import loadMissingAssignments from './loadMissingAssignments';
import { queryGraded } from './loadGraded';
import loadGradescopeAssignments, {
  isDuplicateAssignment,
} from './loadGradescope';
import {
  mergePartial,
  processAssignmentList,
} from '../../shared/useAssignments';
import onCoursePageCanvas from '../utils/onCoursePage';
import dashCoursesCanvas from '../utils/dashCourses';

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
  // assumption: this request will succeed, otherwise we should throw a fatal error and not load
  const initialURL = `${baseURL()}/api/v1/planner/items?start_date=${start}${
    end ? '&end_date=' + end : ''
  }&per_page=1000`;
  return await getPaginatedRequest<PlannerAssignment>(initialURL, allPages);
}

function isValidDate(datestr: string): boolean {
  const date = new Date(datestr);
  return date.toString() !== 'Invalid Date' && !isNaN(date.valueOf());
}

const PlannerAssignmentDefaults: PlannerAssignment = {
  id: '0',
  course_id: '0',
  plannable_id: '0', // required
  plannable_type: AssignmentType.ASSIGNMENT,
  planner_override: null, // remember to check properties if not null
  plannable_date: undefined,
  submissions: false, // remember to check properties if not false
  plannable: {
    assignment_id: undefined, // use this for graphql requests
    id: '0',
    title: 'Untitled Assignment',
    details: '',
    due_at: '', // this or todo_date required
    todo_date: '', // for custom planner notes
    points_possible: 0,
    course_id: '0', // for custom planner notes
    linked_object_html_url: '', // for custom planner notes
    read_state: '', // for announcements
  },
  html_url: '',
};

/* Merge api objects into Assignment objects. */
export function convertPlannerAssignments(
  assignments: PlannerAssignment[]
): FinalAssignment[] {
  assignments = assignments.map((assignment) =>
    mergePartial<PlannerAssignment>(assignment, PlannerAssignmentDefaults)
  );
  return assignments.map((assignment) => {
    const converted: Partial<FinalAssignment> = {
      html_url:
        assignment.html_url || assignment.plannable.linked_object_html_url,
      type: assignment.plannable_type,
      id: assignment.plannable.assignment_id // for quizzes, use this id to query graphql
        ? assignment.plannable.assignment_id.toString()
        : assignment.plannable_id?.toString(),
      plannable_id: assignment.plannable_id?.toString(), // just in case it changes in the future
      override_id: assignment.planner_override?.id.toString(),
      course_id: assignment.plannable.course_id
        ? assignment.plannable.course_id.toString()
        : assignment.course_id
        ? assignment.course_id.toString()
        : '0',
      name: assignment.plannable.title,
      due_at:
        assignment.plannable.due_at ||
        assignment.plannable.todo_date ||
        assignment.plannable_date,
      points_possible: assignment.plannable.points_possible,
      submitted: assignment.submissions
        ? assignment.submissions.submitted
        : undefined,
      graded: assignment.submissions
        ? assignment.submissions.excused || assignment.submissions.graded
        : undefined,
      graded_at: assignment.submissions
        ? assignment.submissions.posted_at
        : undefined,
      marked_complete:
        assignment.planner_override?.marked_complete ||
        assignment.planner_override?.dismissed ||
        (assignment.plannable_type === AssignmentType.ANNOUNCEMENT &&
          assignment.plannable.read_state === 'read'),
    };

    if (
      assignment.plannable_type === AssignmentType.NOTE &&
      assignment.plannable.details
    ) {
      const parsed = assignment.plannable.details.split('\n');
      // custom task with details
      if (
        parsed.length >= 2 &&
        parsed[0].trim() === 'Created using Tasks for Canvas'
      ) {
        if (parsed[1].trim() === 'Instructor Note') {
          converted.needs_grading_count = 1;
          converted.total_submissions = 1;
        }
        // in case the user added other details after
        try {
          if (parsed.length >= 3)
            converted.html_url = parsed[2].split(' ')[0].trim();
          if (
            parsed.length >= 4 &&
            (!converted.course_id || converted.course_id === '0')
          )
            converted.course_id = parsed[3].split(' ')[0].trim();
        } catch {
          converted.html_url = '/';
          converted.course_id = converted.course_id || '0';
        }
      }
    }

    const full = mergePartial<FinalAssignment>(converted, AssignmentDefaults);

    // critical properties
    if (!isValidDate(full.due_at)) full.due_at = new Date().toISOString();
    if (!full.course_id) full.course_id = '0';

    return full;
  });
}

export async function getAllAssignments(
  startDate: Date,
  endDate: Date,
  options: Options
): Promise<FinalAssignment[]> {
  /* Expand bounds by 1 day to account for possible time zone differences with api. */
  const st = new Date(startDate);
  st.setDate(startDate.getDate() - 1);
  const en = new Date(endDate);
  en.setDate(en.getDate() + 1);

  const startStr = st.toISOString().split('T')[0];
  const endStr = en.toISOString().split('T')[0];
  const data = isDemo()
    ? options.show_needs_grading
      ? []
      : DemoAssignments
    : await getAllAssignmentsRequest(startStr, endStr);

  return convertPlannerAssignments(data as PlannerAssignment[]);
}

export async function loadAssignments(
  startDate: Date,
  endDate: Date,
  options: Options
): Promise<FinalAssignment[]> {
  /* modify this filter if announcements are used in the future */
  const assignments = await getAllAssignments(startDate, endDate, options);
  const filtered = processAssignmentList(
    assignments,
    startDate,
    endDate,
    options,
    onCoursePageCanvas,
    dashCoursesCanvas()
  );
  const gradeRecords = await queryGraded(
    filtered.filter((a) => a.graded).map((a) => a.id)
  );
  // zero points does not count as graded
  return filtered.map((a) => {
    if (!(a.id in gradeRecords)) return a;
    a.graded =
      a.graded && (a.points_possible === 0 || gradeRecords[a.id].score > 0);
    a.score = gradeRecords[a.id].score;
    a.grade = gradeRecords[a.id].grade;
    return a;
  });
}

export async function loadCanvas(
  startDate: Date,
  endDate: Date,
  options: Options
): Promise<FinalAssignment[]> {
  const res = await Promise.all([
    loadNeedsGrading(endDate, options),
    loadMissingAssignments(endDate, options),
    loadAssignments(startDate, endDate, options),
    loadGradescopeAssignments(startDate, endDate, options),
  ]);
  // remove duplicates between gradescope/canvas
  res[3] = res[3].filter(
    (a) => res[2].filter((b) => isDuplicateAssignment(a, b)).length === 0
  );
  // merge all lists of assignments together
  return Array.prototype.concat(...res);
}
