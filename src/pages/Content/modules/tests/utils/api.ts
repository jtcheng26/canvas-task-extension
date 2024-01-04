import axios from 'axios';
import { PlannerAssignment } from '../../types';

import { DemoColors, DemoCourses, DemoPositions } from '../demo';

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
  mockedAxios: jest.Mocked<typeof axios>
): void {
  mockedAxios.get.mockImplementation((url) => {
    switch (url) {
      case mockedBaseURLString + '/api/v1/users/self/dashboard_positions':
        return Promise.resolve({ headers: {}, data: DemoPositions });
      case mockedBaseURLString + '/api/v1/users/self/colors':
        return Promise.resolve({ headers: {}, data: DemoColors });
      default:
        break;
    }
    if (urlMatches(url, '/api/v1/courses'))
      return Promise.resolve({ headers: {}, data: DemoCourses });
    if (urlMatches(url, '/api/v1/planner/items'))
      return Promise.resolve({ headers: {}, data: test });
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
