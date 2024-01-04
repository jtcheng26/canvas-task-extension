import {
  generateTestInstance,
  numUniqueInstances,
  TestSpace,
} from './utils/generate';
import { PlannerAssignment } from '../types';
import { loadAssignments } from '../hooks/useAssignments';
import { getWeekEnd, getWeekStart } from '../utils/getPeriod';
import { OptionsDefaults } from '../constants';
import axios from 'axios';
import baseURL from '../utils/baseURL';
import { mockAPI, mockedBaseURLString, urlMatches } from './utils/api';
import { all_planner_tests } from './data/api/space';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('../utils/baseURL');
const mockedBaseURL = baseURL as jest.MockedFunction<() => string>;

beforeAll(() => {
  mockedBaseURL.mockReturnValue(mockedBaseURLString);
});

function generateTestSample<Type>(N: number, space: TestSpace<Type>): Type[] {
  const data: Type[] = [];
  for (let i = 0; i < N; i++) {
    data.push(generateTestInstance<Type>(space));
  }
  return data;
}

describe('stress test fixtures', () => {
  it('Mocks api correctly', () => {
    expect(
      urlMatches(
        mockedBaseURLString + '/api/v1/courses?per_page=2000',
        '/api/v1/courses'
      )
    ).toBe(true);
  });

  it('Gets the correct number of possibilities for a test space', () => {
    const n = numUniqueInstances(all_planner_tests);
    expect(n).toBe(
      2 *
        3 *
        2 *
        7 *
        (1 * 2 * 2 + 1 + 1) *
        2 *
        (3 * 3 * 3 * 1 * 1 * 3 * 1 * 1 + 1 + 1) *
        (2 * 2 * 2 * 10 * 2 * 2 * 3 * 2 * 2 * 3) *
        3
    );
  });
});

describe('loadAssignments', () => {
  it('Passes randomized tests', () => {
    const tests = generateTestSample<PlannerAssignment>(
      1000,
      all_planner_tests
    );
    const start_period = getWeekStart(new Date().valueOf());
    const end_period = getWeekEnd(new Date());
    tests.forEach(async (t) => {
      mockAPI([t], mockedAxios);
      try {
        expect(
          async () =>
            await loadAssignments(start_period, end_period, OptionsDefaults)
        ).not.toThrowError();
      } catch (err) {
        throw new Error(`Failing test:\n\n${JSON.stringify(t)}\n\n`, {
          cause: err,
        });
      }
    });
  });

  it('Passes full randomized tests', () => {
    for (let i = 0; i < 1000; i++) {
      const tests = generateTestSample<PlannerAssignment>(
        1000,
        all_planner_tests
      );
      const start_period = getWeekStart(new Date().valueOf());
      const end_period = getWeekEnd(new Date());
      mockAPI(tests, mockedAxios);
      try {
        expect(
          async () =>
            await loadAssignments(start_period, end_period, OptionsDefaults)
        ).not.toThrowError();
      } catch (err) {
        if (err instanceof Error)
          err.message = `Failing test:\n\n${JSON.stringify(tests)}\n\n${
            err.message
          }`;
        throw err;
      }
    }
  });
});
