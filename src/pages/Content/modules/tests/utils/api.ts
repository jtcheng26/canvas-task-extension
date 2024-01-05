import axios from 'axios';
import { Course, PlannerAssignment } from '../../types';
import { EXPERIMENT_CONFIG_URL } from '../../constants';
import {
  courses_tests,
  custom_colors_tests,
  custom_pos_tests,
} from '../data/api/space';

export const mockedBaseURLString = 'mockedURL';

export function urlMatches(url: string, path: string): boolean {
  return (
    url.slice(
      mockedBaseURLString.length,
      path.length + mockedBaseURLString.length
    ) === path
  );
}

export function mockAPI(
  test: PlannerAssignment[],
  seed: number[],
  mockedAxios: jest.Mocked<typeof axios>
): void {
  mockedAxios.get.mockImplementation((url) => {
    if (urlMatches(url, '/api/v1/users/self/dashboard_positions'))
      return Promise.resolve({
        headers: {},
        data: custom_pos_tests[seed[0] % custom_pos_tests.length],
      });
    if (urlMatches(url, '/api/v1/users/self/colors'))
      return Promise.resolve({
        headers: {},
        data: custom_colors_tests[seed[1] % custom_colors_tests.length],
      });
    if (urlMatches(url, '/api/v1/courses'))
      return Promise.resolve({
        headers: {},
        data: courses_tests[seed[2] % courses_tests.length],
      });
    if (urlMatches(url, '/api/v1/planner/items'))
      return Promise.resolve({ headers: {}, data: test });
    if (urlMatches(url, '/api/v1/users/self/missing_submissions'))
      return Promise.resolve({ headers: {}, data: [] });
    if (urlMatches(url, '/api/v1/users/self/todo'))
      return Promise.resolve({ headers: {}, data: [] });
    if (url === EXPERIMENT_CONFIG_URL)
      return Promise.resolve({ headers: {}, data: '{ "experiments": [] }' });
    return Promise.resolve({ headers: {}, data: null });
  });

  mockedAxios.post.mockImplementation((url) => {
    if (urlMatches(url, '/api/graphql'))
      return Promise.resolve({
        headers: {},
        data: {
          data: {
            item0:
              Math.random() < 0.25
                ? null
                : {
                    submissionsConnection: {
                      nodes: [
                        {
                          gradingStatus:
                            Math.random() < 0.5 ? 'graded' : 'ungraded',
                          grade: ['0', 'A', 'Excused', '25'][
                            Math.floor(Math.random() * 4)
                          ],
                          score: Math.random() < 0.5 ? 0 : 25.0,
                        },
                      ],
                    },
                  },
          },
        },
      });
    return Promise.resolve({ headers: {}, data: null });
  });
}

export interface APITestData {
  planner_items: PlannerAssignment[];
  courses: Course[];
  colors: { custom_colors: Record<string, string> };
  positions: { dashboard_positions: Record<string, number> };
}

export function mockAPIData(
  test: APITestData,
  mockedAxios: jest.Mocked<typeof axios>
): void {
  mockedAxios.get.mockImplementation((url) => {
    if (urlMatches(url, '/api/v1/users/self/dashboard_positions'))
      return Promise.resolve({
        headers: {},
        data: test.positions,
      });
    if (urlMatches(url, '/api/v1/users/self/colors'))
      return Promise.resolve({
        headers: {},
        data: test.colors,
      });
    if (urlMatches(url, '/api/v1/courses'))
      return Promise.resolve({
        headers: {},
        data: test.courses,
      });
    if (urlMatches(url, '/api/v1/planner/items'))
      return Promise.resolve({ headers: {}, data: test.planner_items });
    if (urlMatches(url, '/api/v1/users/self/missing_submissions'))
      return Promise.resolve({ headers: {}, data: [] });
    if (urlMatches(url, '/api/v1/users/self/todo'))
      return Promise.resolve({ headers: {}, data: [] });
    if (url === EXPERIMENT_CONFIG_URL)
      return Promise.resolve({ headers: {}, data: '{ "experiments": [] }' });
    return Promise.resolve({ headers: {}, data: null });
  });
  mockedAxios.post.mockImplementation((url) => {
    if (urlMatches(url, '/api/graphql'))
      return Promise.resolve({
        headers: {},
        data: {
          data: {
            item0:
              Math.random() < 0.25
                ? null
                : {
                    submissionsConnection: {
                      nodes: [
                        {
                          gradingStatus:
                            Math.random() < 0.5 ? 'graded' : 'ungraded',
                          grade: ['0', 'A', 'Excused', '25'][
                            Math.floor(Math.random() * 4)
                          ],
                          score: Math.random() < 0.5 ? 0 : 25.0,
                        },
                      ],
                    },
                  },
          },
        },
      });
    return Promise.resolve({ headers: {}, data: null });
  });
}
