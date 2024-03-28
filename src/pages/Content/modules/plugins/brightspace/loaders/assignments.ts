import {
  AssignmentType,
  Course,
  FinalAssignment,
  Options,
} from '../../../types';
import baseURL from '../../../utils/baseURL';
import loadBrightspaceCourses, {
  getPaginatedRequestBrightspace,
} from './courses';
import { AssignmentDefaults } from '../../../constants';
import { processAssignmentList } from '../../shared/useAssignments';
import { BrightspaceLMSConfig } from '..';
import { loadCustomTasks } from '../../shared/customTask';
import { applyCustomOverrides } from '../../shared/customOverride';

type BrightspaceItem = {
  UserId: string;
  OrgUnitId: string;
  ItemId: number;
  ItemName: string;
  ItemType: number;
  ItemUrl?: string;
  StartDate?: string;
  EndDate?: string;
  DueDate?: string;
  CompletionType: number;
  DateCompleted?: string;
  ActivityType: number;
  IsExempt: boolean;
};

async function getAssignmentsRequest(
  start: string,
  end: string,
  courses: Course[]
) {
  const url = `${baseURL()}/d2l/api/le/1.67/content/myItems/?startDateTime=${start}&endDateTime=${end}&orgUnitIdsCSV=${courses
    .map((c) => c.id)
    .join(',')}`;
  return getPaginatedRequestBrightspace<BrightspaceItem>(url, true);
}

function parseAssignments(assignments: BrightspaceItem[]): FinalAssignment[] {
  function parseActivityType(t: number) {
    if (t === 4) return AssignmentType.QUIZ;
    else if (t === 5 || t === 6) return AssignmentType.DISCUSSION;
    return AssignmentType.ASSIGNMENT;
  }
  return assignments.map((assignment) => ({
    ...AssignmentDefaults,
    name: assignment.ItemName,
    id: assignment.ItemId + '',
    plannable_id: assignment.ItemId + '', // unused
    type: parseActivityType(assignment.ActivityType), // todo: link based off ActivityType
    html_url: assignment.ItemUrl || '/',
    due_at: new Date('2024-03-29').toISOString(),
    course_id: assignment.OrgUnitId,
    submitted: !!assignment.DateCompleted,
    graded: false,
    points_possible: 10,
    score: 0,
  }));
}

export default async function loadBrightspaceAssignments(
  startDate: Date,
  endDate: Date,
  options: Options
) {
  /* Expand bounds by 1 day to account for possible time zone differences with api. */
  const st = new Date(startDate);
  st.setDate(startDate.getDate() - 1);
  const en = new Date(endDate);
  en.setDate(en.getDate() + 1);

  const startStr = st.toISOString().split('T')[0];
  const endStr = en.toISOString().split('T')[0];

  const courses = await loadBrightspaceCourses();
  const assignmentSources = await Promise.all([
    (async () =>
      parseAssignments(
        await getAssignmentsRequest(startStr, endStr, courses)
      ))(),
    loadCustomTasks('brightspace_custom'),
  ]);
  const assignments = Array.prototype.concat(...assignmentSources);
  console.log(assignments);
  const marked = await applyCustomOverrides(assignments, 'brightspace_custom');
  return processAssignmentList(
    marked,
    startDate,
    endDate,
    options,
    BrightspaceLMSConfig.onCoursePage,
    BrightspaceLMSConfig.dashCourses(courses)
  );
}
