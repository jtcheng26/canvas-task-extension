import { AssignmentType, FinalAssignment, Options } from '../../types';
import baseURL from '../../utils/baseURL';
import { AssignmentDefaults } from '../../constants';
import isDemo from '../../utils/isDemo';
import { getPaginatedRequest, processAssignmentList } from '../useAssignments';
import MissingAssignmentsSample from '../../tests/data/api/missing_submissions.json';
import assignmentIsDone from '../../utils/assignmentIsDone';

type MissingAssignment = typeof MissingAssignmentsSample[0];

async function getMissingAssignmentsRequest(
  allPages = true
): Promise<MissingAssignment[]> {
  const initialURL = `${baseURL()}/api/v1/users/self/missing_submissions?include=planner_overrides&filter=submittable,current_grading_period&per_page=1000`;
  return await getPaginatedRequest<MissingAssignment>(initialURL, allPages);
}

function parseAssignmentType(assignment: MissingAssignment) {
  if (
    assignment.is_quiz_assignment ||
    assignment.quiz_id ||
    assignment.original_quiz_id ||
    assignment.submission_types.includes('online_quiz')
  )
    return AssignmentType.QUIZ;
  if (
    'discussion_topic' in assignment ||
    assignment.submission_types.includes('discussion_topic')
  )
    return AssignmentType.DISCUSSION;
  return AssignmentType.ASSIGNMENT;
}

/* Merge api objects into Assignment objects. */
function convertMissingAssignments(
  assignments: MissingAssignment[]
): FinalAssignment[] {
  return assignments.map((assignment) => {
    const converted: Partial<FinalAssignment> = {
      html_url: assignment.html_url,
      type: assignment.planner_override
        ? (assignment.planner_override.plannable_type as AssignmentType)
        : parseAssignmentType(assignment),
      id: assignment.id.toString(),
      plannable_id: (assignment.planner_override
        ? assignment.planner_override.plannable_id
        : assignment.id
      ).toString(), // just in case it changes in the future
      override_id: assignment.planner_override?.id.toString(),
      course_id: assignment.course_id?.toString(), // must be present
      name: assignment.name,
      due_at: assignment.due_at || assignment.lock_at || '',
      points_possible: assignment.points_possible,
      submitted: false,
      graded: false,
      marked_complete:
        assignment.planner_override?.marked_complete ||
        assignment.planner_override?.dismissed,
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

// "missing" assignments marked complete stop showing up
function filterCompleted(assignments: FinalAssignment[]) {
  return assignments.filter((a) => !assignmentIsDone(a));
}

export async function getAllMissing(): Promise<FinalAssignment[]> {
  const data = isDemo() ? [] : await getMissingAssignmentsRequest();
  const assignments = filterCompleted(
    convertMissingAssignments(data as MissingAssignment[])
  );
  return assignments;
}

async function processAssignments(
  startDate: Date,
  endDate: Date,
  options: Options
): Promise<FinalAssignment[]> {
  if (!options.show_long_overdue) return [];
  const assignments: FinalAssignment[] = await getAllMissing();
  return processAssignmentList(assignments, startDate, endDate, options);
}

// only respects end date: assignments due after will not be included, but all assignments due before that need grading are included.
export default async function loadMissingAssignments(
  endDate: Date,
  options: Options
): Promise<FinalAssignment[]> {
  const startDate = new Date('2000-01-01');
  return isDemo() ? [] : await processAssignments(startDate, endDate, options);
}
