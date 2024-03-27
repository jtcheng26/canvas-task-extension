import { compareTwoStrings } from 'string-similarity';
import { GradescopeTask } from '../../components/gradescope/types';
import { getSyncedCourses } from '../../components/gradescope/utils/scrape';
import {
  getCourseTasks,
  getGradescopeOverrides,
} from '../../components/gradescope/utils/store';
import { AssignmentDefaults } from '../../constants';
import { AssignmentType, FinalAssignment, Options } from '../../types';
import { AssignmentStatus } from '../../types/assignment';
import { processAssignmentList } from '../useAssignments';
import migrateGradescopeToLocal from '../../components/gradescope/utils/migrate';

function getAssignmentURL(course: string, id: string) {
  if (!id) return `https://www.gradescope.com/courses/${course}`;
  return `https://www.gradescope.com/courses/${course}/assignments/${id}`;
}

function parseScore(status: string): [number, number] | null {
  try {
    const parts = status.split('/').map((s) => parseFloat(s.trim()));
    if (parts.length === 2) return [parts[0], parts[1]];
    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

function convertToAssignment(
  task: GradescopeTask,
  canvasCourse: string
): FinalAssignment {
  AssignmentDefaults;
  const parsedScore = parseScore(task.status) || null;
  return {
    ...AssignmentDefaults,
    name: task.name,
    id: task.id,
    plannable_id: task.gid, // placeholder field b/c this is needed to link overrides
    type: AssignmentType.GRADESCOPE,
    html_url: getAssignmentURL(task.gid, task.id),
    due_at: task.due_date,
    course_id: canvasCourse,
    submitted: task.status !== 'No Submission',
    graded: !!parsedScore, // TODO
    points_possible: parsedScore ? parsedScore[1] : 0,
    score: parsedScore ? parsedScore[0] : 0,
  };
}

async function getCourseTasksAndOverrides(
  gid: string
): Promise<GradescopeTask[]> {
  const [tasks, overrides] = await Promise.all([
    getCourseTasks(gid),
    getGradescopeOverrides(gid),
  ]);
  const gscopeStatus = {
    [AssignmentStatus.COMPLETE]: 'Submitted',
    [AssignmentStatus.UNFINISHED]: 'No Submission',
    [AssignmentStatus.DELETED]: 'deleted',
  };

  return tasks
    .map((task) => {
      const ov = overrides.filter(
        (o) =>
          o.id === task.id &&
          o.gid === task.gid &&
          o.name === task.name &&
          o.due_date === task.due_date
      );
      if (ov.length)
        return {
          ...task,
          status: gscopeStatus[ov[0].status],
        };
      return task;
    })
    .filter((t) => t.status !== 'deleted');
}

async function getAllGradescope(): Promise<FinalAssignment[]> {
  await migrateGradescopeToLocal();
  const courses = await getSyncedCourses();
  const gscopeIds = Object.keys(courses);
  if (!gscopeIds.length) return [];
  // get each course's tasks in parallel
  const reqs = gscopeIds.map((gid) =>
    (async () =>
      (await getCourseTasksAndOverrides(gid)).map((a) =>
        convertToAssignment(a, courses[gid])
      ))()
  );
  // combine lists
  return (await Promise.all(reqs)).reduce((sum, a) => sum.concat(a), []);
}

async function processAssignments(
  startDate: Date,
  endDate: Date,
  options: Options
): Promise<FinalAssignment[]> {
  if (options.GSCOPE_INT_disabled) return [];
  const assignments: FinalAssignment[] = await getAllGradescope();
  const ret = processAssignmentList(assignments, startDate, endDate, options);
  return ret;
}

// check if a Gradescope assignment is already listed in Canvas
export function isDuplicateAssignment(a: FinalAssignment, b: FinalAssignment) {
  return (
    a.course_id === b.course_id &&
    new Date(a.due_at).valueOf() === new Date(b.due_at).valueOf() &&
    compareTwoStrings(a.name, b.name) >= 0.9
  );
}

export default async function loadGradescopeAssignments(
  startDate: Date,
  endDate: Date,
  options: Options
) {
  return await processAssignments(startDate, endDate, options);
}
