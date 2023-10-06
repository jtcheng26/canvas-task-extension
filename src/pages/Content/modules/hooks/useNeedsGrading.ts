import { AssignmentType, FinalAssignment, Options } from '../types';
import { useQuery, UseQueryResult } from 'react-query';
import useCourseNames from './useCourseNames';
import useCourseColors from './useCourseColors';
import baseURL from '../utils/baseURL';
import { AssignmentDefaults, OptionsDefaults } from '../constants';
import useCoursePositions from './useCoursePositions';
import isDemo from '../utils/isDemo';
import { getPaginatedRequest, processAssignmentList } from './useAssignments';
import { TodoAssignment, TodoResponse } from '../types/assignment';
import apiReq from '../utils/apiReq';

interface NeedsGradingCount {
  id: string;
  needs_grading: number;
  total: number;
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

  const data = {
    query: `query MyQuery {
      ${queries.reduce((prev, curr) => prev + '\n' + curr, '')}
    }`,
  };

  const resp = await apiReq('/graphql', JSON.stringify(data), 'post');
  if ('errors' in resp.data || resp.status / 100 != 2) return {};
  const counts = resp.data.data;

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

export async function getAllTodos(): Promise<FinalAssignment[]> {
  const data = isDemo() ? [] : await getAllTodoRequest();
  const assignments = convertTodoAssignments(data as TodoResponse[]);
  // if (!assignments.length) return [];
  const counts = await queryNeedsGradingCounts(assignments.map((a) => a.id));
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
  options: Options,
  colors?: Record<string, string>,
  names?: Record<string, string>,
  positions?: Record<string, number>
): Promise<FinalAssignment[]> {
  if (!options.show_needs_grading) return [];
  const assignments: FinalAssignment[] = await getAllTodos();
  return processAssignmentList(
    assignments,
    startDate,
    endDate,
    options,
    colors,
    names,
    positions
  );
}

// only respects end date: assignments due after will not be included, but all assignments due before that need grading are included.
export default function useNeedsGrading(
  //   startDate: Date,
  endDate: Date,
  options: Options
): UseQueryResult<FinalAssignment[]> {
  const { data: colors } = useCourseColors(
    options.theme_color !== OptionsDefaults.theme_color
      ? options.theme_color
      : undefined
  );
  const { data: names } = useCourseNames();
  const { data: positions } = useCoursePositions();
  const startDate = new Date('2000-01-01');
  return useQuery(
    ['names', startDate, endDate],
    () =>
      processAssignments(
        startDate,
        endDate,
        options,
        colors as Record<string, string>,
        names as Record<string, string>,
        positions as Record<string, number>
      ),
    {
      staleTime: Infinity,
      enabled: !!colors && !!names,
    }
  );
}
