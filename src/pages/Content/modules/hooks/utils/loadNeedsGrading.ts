import { AssignmentType, FinalAssignment, Options } from '../../types';
import baseURL from '../../utils/baseURL';
import { AssignmentDefaults } from '../../constants';
import isDemo from '../../utils/isDemo';
import {
  getPaginatedRequest,
  mergePartial,
  processAssignmentList,
} from '../useAssignments';
import { TodoAssignment, TodoResponse } from '../../types/assignment';
import graphqlReq from './gqlReq';
import { DemoNeedsGrading, DemoTeacherAssignments } from '../../tests/demo';

export interface NeedsGradingCount {
  id: string;
  needs_grading: number;
  total: number;
}

interface GQLResponse {
  [key: string]: {
    submissionsConnection?: {
      nodes: {
        gradingStatus: string;
      }[];
    };
  };
}

async function queryNeedsGradingCounts(
  ids: string[]
): Promise<Record<string, NeedsGradingCount>> {
  const newQuery = (
    id: string,
    idx: number
  ) => `  item${idx}: assignment(id: ${id}) {
      submissionsConnection {
        nodes {
          gradingStatus
        }
      }
    }`;

  const queries = ids.map((id, idx) => newQuery(id, idx));

  try {
    const counts = await graphqlReq<GQLResponse>(queries);

    const keys = Object.keys(counts);

    const ret: Record<string, NeedsGradingCount> = {};
    ids.forEach((id, idx) => {
      ret[id] = {
        id: id,
        total: counts[keys[idx]].submissionsConnection?.nodes.length,
        needs_grading: counts[keys[idx]].submissionsConnection?.nodes.filter(
          (x: { gradingStatus: string }) => x.gradingStatus === 'needs_grading'
        ).length,
      } as NeedsGradingCount;
    });
    return ret;
  } catch (err) {
    console.error(err);
    return {};
  }
}

/* Get assignments from api */
async function getAllTodoRequest(allPages = true): Promise<TodoResponse[]> {
  const initialURL = `${baseURL()}/api/v1/users/self/todo`;
  return await getPaginatedRequest<TodoResponse>(initialURL, allPages);
}

/* Merge api objects into Assignment objects. */
export function convertTodoAssignments(
  assignments: TodoResponse[]
): FinalAssignment[] {
  return assignments
    .filter((a) => a.assignment && a.needs_grading_count)
    .map((a) => a.assignment as TodoAssignment)
    .map((assignment) => {
      const converted: Partial<FinalAssignment> = {
        html_url: assignment.html_url,
        type: AssignmentType.ASSIGNMENT, // same gradebook icon, type doesn't matter
        id: assignment.id.toString(),
        plannable_id: assignment.id.toString(), // just in case it changes in the future
        course_id: assignment.course_id.toString(),
        name: assignment.name,
        due_at: assignment.due_at,
        points_possible: assignment.points_possible,
        submitted: assignment.needs_grading_count == 0,
        graded: assignment.needs_grading_count == 0,
        needs_grading_count: assignment.needs_grading_count,
      };

      const full = mergePartial(converted, AssignmentDefaults);
      return full;
    });
}

export async function getAllTodos(): Promise<FinalAssignment[]> {
  const data = isDemo() ? DemoTeacherAssignments : await getAllTodoRequest();
  const assignments = convertTodoAssignments(data as TodoResponse[]);
  const counts = isDemo()
    ? DemoNeedsGrading
    : await queryNeedsGradingCounts(assignments.map((a) => a.id));
  return assignments.map(
    (a) =>
      ({
        ...a,
        total_submissions:
          a.id in counts ? counts[a.id].total : a.needs_grading_count,
      } as FinalAssignment)
  );
}

async function processAssignments(
  startDate: Date,
  endDate: Date,
  options: Options
): Promise<FinalAssignment[]> {
  if (!options.show_needs_grading) return [];
  const assignments: FinalAssignment[] = await getAllTodos();
  return processAssignmentList(assignments, startDate, endDate, options);
}

// only respects end date: assignments due after will not be included, but all assignments due before that need grading are included.
export default async function loadNeedsGrading(
  endDate: Date,
  options: Options
): Promise<FinalAssignment[]> {
  const startDate = new Date('2000-01-01');
  return await processAssignments(startDate, endDate, options);
}
