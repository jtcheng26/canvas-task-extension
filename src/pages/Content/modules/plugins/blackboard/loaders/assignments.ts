import { BlackboardLMSConfig } from '..';
import { AssignmentDefaults } from '../../../constants';
import {
  AssignmentType,
  Course,
  FinalAssignment,
  Options,
} from '../../../types';
import baseURL from '../../../utils/baseURL';
import { applyCustomOverrides } from '../../shared/customOverride';
import { loadCustomTasks } from '../../shared/customTask';
import loadGradescopeAssignments from '../../shared/loadGradescope';
import {
  filterTimeBounds,
  processAssignmentList,
} from '../../shared/useAssignments';
import loadBlackboardCourses, {
  getPaginatedRequestBlackboard,
} from './courses';

type BlackboardGradebookColumn = {
  id: string;
  contentId: string;
  parentId: string;
  name: string;
  score: {
    possible: number;
  };
  grading: {
    due?: string;
    type: string;
  };
  scoreProviderHandle: 'resource/x-bb-assessment' | 'resource/x-bb-forumlink';
};

type BlackboardContentLink = {
  links: {
    href: string;
    type: string;
  }[];
};

type BlackboardAttempt = {
  id: string;
  status: 'NotAttempted' | 'NeedsGrading' | 'Completed';
  exempt: boolean;
  submissionDate?: string;
  displayGrade?: {
    score: number;
  };
};

type BlackboardAnnouncement = {
  id: string;
  title: string;
  availability: {
    duration: {
      start: string;
    };
  };
};

async function getGradebookColumnsRequest(courseId: string) {
  const url = `${baseURL()}/learn/api/public/v2/courses/${courseId}/gradebook/columns`;
  return getPaginatedRequestBlackboard<BlackboardGradebookColumn>(url, true);
}

async function getAssignmentLink(courseId: string, contentId: string) {
  const url = `${baseURL()}/learn/api/public/v1/courses/${courseId}/contents/${contentId}?fields=links`;
  return (await (await fetch(url)).json()) as BlackboardContentLink;
}

async function getAttemptsRequest(courseId: string, column: string) {
  const url = `${baseURL()}/learn/api/public/v2/courses/${courseId}/gradebook/columns/${column}/attempts`;
  return await getPaginatedRequestBlackboard<BlackboardAttempt>(url, true);
}

async function getAnnouncementsRequest(
  courseId: string,
  startDate: string,
  endDate: string
) {
  const url = `${baseURL()}/learn/api/public/v1/courses/${courseId}/announcements?startDate=${startDate}&startDateCompare=between&startDateUntil=${endDate}`;
  return await getPaginatedRequestBlackboard<BlackboardAnnouncement>(url, true);
}

function parseAnnouncement(
  courseId: string,
  announcement: BlackboardAnnouncement
): FinalAssignment {
  const res: FinalAssignment = {
    ...AssignmentDefaults,
    name: announcement.title,
    id: announcement.id,
    type: AssignmentType.ANNOUNCEMENT,
    html_url: `${baseURL()}/ultra/courses/${courseId}/announcements`,
    due_at: announcement.availability.duration.start,
    course_id: courseId,
    marked_complete: false,
  };

  return res;
}

function parseAssignment(
  courseId: string,
  col: BlackboardGradebookColumn
): FinalAssignment {
  const assignment = {
    ...AssignmentDefaults,
    name: col.name,
    id: col.contentId + '', // content id
    plannable_id: col.id + '', // gradebook column id
    type: AssignmentType.ASSIGNMENT,
    html_url: '/',
    due_at: col.grading.due || '',
    course_id: courseId,
    submitted: false,
    graded: false,
    points_possible: col.score.possible,
    score: 0,
  };

  // Quizzes have the same internal structure as assignments, so I can't really differentiate them yet.
  if (col.scoreProviderHandle === 'resource/x-bb-forumlink')
    assignment.type = AssignmentType.DISCUSSION;

  return assignment;
}

async function updateAssignmentDetails(assignment: FinalAssignment) {
  const [links, attempts] = await Promise.all([
    getAssignmentLink(assignment.course_id, assignment.id),
    getAttemptsRequest(assignment.course_id, assignment.plannable_id),
  ]);
  if ('links' in links && links.links.length) {
    const html = links.links.filter((l) => l.type === 'text/html');
    if (html.length) assignment.html_url = baseURL() + html[0].href;
  }
  if (attempts.length) {
    const attempt = attempts[0];
    if (attempt.status !== 'NotAttempted') assignment.submitted = true;
    if ('displayGrade' in attempt && attempt.displayGrade) {
      assignment.score = attempt.displayGrade.score;
      assignment.graded = true;
    }
  }

  return assignment;
}

async function collectAnnouncements(
  startDate: Date,
  endDate: Date,
  courses: Course[]
): Promise<FinalAssignment[]> {
  const startStr = startDate.toISOString().split('T')[0];
  const endStr = endDate.toISOString().split('T')[0];
  const getAnnouncements = async (course: Course) => {
    const announcements = await getAnnouncementsRequest(
      course.id,
      startStr,
      endStr
    );
    return announcements.map((a) => parseAnnouncement(course.id, a));
  };
  const announcements: FinalAssignment[] = Array.prototype.concat(
    ...(await Promise.all(courses.map((c) => getAnnouncements(c))))
  );
  console.log(announcements);

  return announcements;
}

async function collectAssignments(
  startDate: Date,
  endDate: Date,
  courses: Course[]
): Promise<FinalAssignment[]> {
  const cols: BlackboardGradebookColumn[][] = await Promise.all(
    courses.map((c) => getGradebookColumnsRequest(c.id))
  );
  const assignments = await Promise.all(
    Array.prototype.concat(
      ...cols.map((course_cols, i) =>
        course_cols
          .filter((c) => c.grading.type === 'Attempts')
          .map((c) => parseAssignment(courses[i].id, c))
      )
    )
  );
  const filtered = filterTimeBounds(startDate, endDate, assignments);
  const updated = await Promise.all(
    filtered.map((a) => updateAssignmentDetails(a))
  );
  return updated;
}
// calendars => gradebook columns => (filter) => gradebook column attempts

export default async function loadBlackboardAssignments(
  startDate: Date,
  endDate: Date,
  options: Options
) {
  /* Expand bounds by 1 day to account for possible time zone differences with api. */
  const st = new Date(startDate);
  st.setDate(startDate.getDate() - 1);
  const en = new Date(endDate);
  en.setDate(en.getDate() + 1);

  const courses = await loadBlackboardCourses();

  const assignmentSources = await Promise.all([
    collectAnnouncements(st, en, courses),
    collectAssignments(st, en, courses),
    loadCustomTasks('blackboard_custom'),
    loadGradescopeAssignments(st, en, options),
  ]);
  const assignments = Array.prototype.concat(...assignmentSources);
  const marked = await applyCustomOverrides(assignments, 'blackboard_custom');
  return processAssignmentList(
    marked,
    startDate,
    endDate,
    options,
    BlackboardLMSConfig.onCoursePage,
    BlackboardLMSConfig.dashCourses(courses)
  );
}
