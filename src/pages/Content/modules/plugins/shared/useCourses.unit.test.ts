import axios from 'axios';
import baseURL from '../../utils/baseURL';
import { getCanvasCourses } from '../canvas/loaders/loadCourses';

import activeAndRestricted from '../../tests/data/api/courses/activeAndRestrictedCourses.json';
import active from '../../tests/data/api/courses/activeCourses.json';
import restricted from '../../tests/data/api/courses/restrictedCourses.json';

import customColors from '../../tests/data/api/colors.json';
import customPositions from '../../tests/data/api/dashboard_positions.json';

import chrome from 'sinon-chrome';

jest.mock('axios');
jest.mock('../utils/baseURL');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedBaseURL = baseURL as jest.MockedFunction<() => string>;
const mockedBaseURLString = 'mockedURL';

beforeAll(() => {
  mockedBaseURL.mockReturnValue(mockedBaseURLString);
  global.chrome = chrome as unknown as typeof global.chrome;
});

test('useCourses hook gets all the courses', async () => {
  mockedAxios.get.mockImplementation((url) => {
    switch (url) {
      case mockedBaseURLString + '/api/v1/users/self/dashboard_positions':
        return Promise.resolve({ headers: {}, data: customPositions });
      case mockedBaseURLString + '/api/v1/users/self/colors':
        return Promise.resolve({ headers: {}, data: customColors });
      default:
        return Promise.resolve({ headers: {}, data: active });
    }
  });

  const res = (await getCanvasCourses()).slice(1);
  expect(res).toStrictEqual(active);
});

test('useCourses hook filters date-restricted courses', async () => {
  mockedAxios.get.mockImplementation((url) => {
    switch (url) {
      case mockedBaseURLString + '/api/v1/users/self/dashboard_positions':
        return Promise.resolve({ headers: {}, data: customPositions });
      case mockedBaseURLString + '/api/v1/users/self/colors':
        return Promise.resolve({ headers: {}, data: customColors });
      default:
        return Promise.resolve({ headers: {}, data: activeAndRestricted });
    }
  });

  const res = (await getCanvasCourses()).slice(1);

  expect(res.length).toBe(
    activeAndRestricted.reduce(
      (a, b) => a + (b.access_restricted_by_date ? 0 : 1),
      0
    )
  );
});

test('useCourses hook works when all courses are restricted', async () => {
  mockedAxios.get.mockImplementation((url) => {
    switch (url) {
      case mockedBaseURLString + '/api/v1/users/self/dashboard_positions':
        return Promise.resolve({ headers: {}, data: customPositions });
      case mockedBaseURLString + '/api/v1/users/self/colors':
        return Promise.resolve({ headers: {}, data: customColors });
      default:
        return Promise.resolve({ headers: {}, data: restricted });
    }
  });

  const res = (await getCanvasCourses()).slice(1);
  expect(res).toBeDefined();
  expect(res.length).toBe(0);
});

test('useCourses hook applies course colors', async () => {
  const colors: { custom_colors: Record<string, string> } = {
    custom_colors: {
      1: '#26f',
      2: '#2f6',
      3: '#62f',
      4: '#6f2',
      5: '#f26',
      6: '#f62',
    },
  };
  mockedAxios.get.mockImplementation((url) => {
    switch (url) {
      case mockedBaseURLString + '/api/v1/users/self/dashboard_positions':
        return Promise.resolve({ headers: {}, data: customPositions });
      case mockedBaseURLString + '/api/v1/users/self/colors':
        return Promise.resolve({ headers: {}, data: colors });
      default:
        return Promise.resolve({ headers: {}, data: activeAndRestricted });
    }
  });

  const res = (await getCanvasCourses()).slice(1);
  expect(res).toBeDefined();
  expect(res.length).toBeGreaterThan(0);
  res.forEach((course) => {
    expect(course.id).toBeTruthy();
    expect(course.color).toBe(colors.custom_colors[course.id]);
  });
});
