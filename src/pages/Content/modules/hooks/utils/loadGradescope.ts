import { GradescopeTask } from '../../components/gradescope/types';
import { getSyncedCourses } from '../../components/gradescope/utils/scrape';
import {
  getCourseTasks,
  getGradescopeIntegrationStatus,
  getGradescopeOverrides,
} from '../../components/gradescope/utils/store';
import { AssignmentDefaults } from '../../constants';
import { AssignmentType, FinalAssignment, Options } from '../../types';
import { AssignmentStatus } from '../../types/assignment';
import { processAssignmentList } from '../useAssignments';

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
  if (!(await getGradescopeIntegrationStatus())) return [];
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
  const assignments: FinalAssignment[] = await getAllGradescope();
  const ret = processAssignmentList(assignments, startDate, endDate, options);
  return ret;
}

export default async function loadGradescopeAssignments(
  startDate: Date,
  endDate: Date,
  options: Options
) {
  return await processAssignments(startDate, endDate, options);
}
