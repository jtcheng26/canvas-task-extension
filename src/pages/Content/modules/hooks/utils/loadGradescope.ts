import { GradescopeTask } from '../../components/gradescope/types';
import { getSyncedCourses } from '../../components/gradescope/utils/scrape';
import {
  getCourseTasks,
  getGradescopeIntegrationStatus,
} from '../../components/gradescope/utils/store';
import { AssignmentDefaults } from '../../constants';
import { AssignmentType, FinalAssignment, Options } from '../../types';
import { processAssignmentList } from '../useAssignments';

function getAssignmentURL(course: string, id: string) {
  if (!id) return `https://www.gradescope.com/courses/${course}`;
  return `https://www.gradescope.com/courses/${course}/assignments/${id}`;
}

function convertToAssignment(
  task: GradescopeTask,
  canvasCourse: string
): FinalAssignment {
  AssignmentDefaults;
  return {
    ...AssignmentDefaults,
    name: task.name,
    id: task.id,
    type: AssignmentType.GRADESCOPE,
    html_url: getAssignmentURL(task.gid, task.id),
    due_at: task.due_date,
    course_id: canvasCourse,
    submitted: task.status !== 'No Submission',
    graded: false, // TODO
  };
}

async function getAllGradescope(): Promise<FinalAssignment[]> {
  if (!getGradescopeIntegrationStatus()) return [];
  const courses = await getSyncedCourses();
  const gscopeIds = Object.keys(courses);
  if (!gscopeIds.length) return [];
  console.log(gscopeIds);
  // get each course's tasks in parallel
  const reqs = gscopeIds.map((gid) =>
    (async () =>
      (await getCourseTasks(gid)).map((a) =>
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
  console.log(assignments);
  const ret = processAssignmentList(assignments, startDate, endDate, options);
  console.log(ret);
  return ret;
}

export default async function loadGradescopeAssignments(
  startDate: Date,
  endDate: Date,
  options: Options
) {
  return await processAssignments(startDate, endDate, options);
}
