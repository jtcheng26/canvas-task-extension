import {
  TestSpace,
  generateTestSample,
  numUniqueInstances,
} from './utils/generate';
import { PlannerAssignment } from '../types';
import { loadCanvas } from '../plugins/canvas/loaders/loadCanvas';
import { getWeekEnd, getWeekStart } from '../utils/getPeriod';
import { OptionsDefaults } from '../constants';
import axios from 'axios';
import baseURL from '../utils/baseURL';
import { mockAPI, mockedBaseURLString, urlMatches } from './utils/api';
import { all_planner_tests } from './data/api/space';
import { generateRandomNumberArray } from './utils/generate';
import chrome from 'sinon-chrome';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('../utils/baseURL');
const mockedBaseURL = baseURL as jest.MockedFunction<() => string>;

beforeAll(() => {
  mockedBaseURL.mockReturnValue(mockedBaseURLString);
  global.chrome = chrome as unknown as typeof global.chrome;
});

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
    type SampleType = {
      a: number;
      b?: string;
      c?: {
        a?: string;
        b: number | null;
        c: {
          a: string;
        };
      };
    };

    const SampleTypeTestSpace: TestSpace<SampleType> = {
      a: [0, 1, 2],
      b: ['a', 'b', 'c', undefined],
      c: [
        {
          a: ['1', '2', '3', undefined],
          b: [null, 1, 2, 3, 4],
          c: [
            {
              a: ['0', '1'],
            },
            { a: ['2'] },
          ],
        },
        {
          a: [undefined],
          b: [null],
          c: [
            {
              a: ['0', '1', '2', '3', '4', '5', '6'],
            },
          ],
        },
        undefined,
      ],
    };
    const n = numUniqueInstances(SampleTypeTestSpace);
    expect(n).toBe(3 * 4 * (4 * 5 * (2 + 1) + 1 * 1 * 7 + 1));
  });
});

describe('loadCanvass', () => {
  it('Passes randomized tests', async () => {
    const tests = generateTestSample<PlannerAssignment>(
      1000,
      all_planner_tests
    );
    const start_period = getWeekStart(new Date().valueOf());
    const end_period = getWeekEnd(new Date());
    tests.forEach(async (t) => {
      const seed = generateRandomNumberArray(3);
      mockAPI([t], seed, mockedAxios);
      try {
        const res = await loadCanvas(start_period, end_period, OptionsDefaults);
        expect(res).toBeTruthy();
      } catch (err) {
        if (err instanceof Error)
          err.message = `Failing test:\n\n${JSON.stringify(test)}\n\n${
            err.message
          }`;
        throw err;
      }
    });
  });

  it('Passes full randomized tests', async () => {
    for (let i = 0; i < 1000; i++) {
      const tests = generateTestSample<PlannerAssignment>(
        1000,
        all_planner_tests
      );
      const start_period = getWeekStart(new Date().valueOf());
      const end_period = getWeekEnd(new Date());
      const seed = generateRandomNumberArray(3);
      mockAPI(tests, seed, mockedAxios);
      try {
        const res = await loadCanvas(start_period, end_period, OptionsDefaults);
        expect(res).toBeTruthy();
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
