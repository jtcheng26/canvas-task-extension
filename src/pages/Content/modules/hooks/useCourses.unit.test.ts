import axios from 'axios';
import baseURL from '../utils/baseURL';
import { getCourses } from './useCourses';

import activeAndRestricted from '../tests/data/api/courses/activeAndRestrictedCourses.json';
import active from '../tests/data/api/courses/activeCourses.json';
import restricted from '../tests/data/api/courses/restrictedCourses.json';

jest.mock('axios');
jest.mock('../utils/baseURL');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedBaseURL = baseURL as jest.MockedFunction<() => string>;

beforeAll(() => {
  mockedBaseURL.mockReturnValue('mockedURL');
});

test('useCourses hook gets all the courses', async () => {
  mockedAxios.get.mockResolvedValueOnce({ data: active });

  const res = (await getCourses({})).slice(1);
  expect(res).toStrictEqual(active);
});

test('useCourses hook filters date-restricted courses', async () => {
  mockedAxios.get.mockResolvedValueOnce({ data: activeAndRestricted });

  const res = (await getCourses({})).slice(1);

  expect(res.length).toBe(
    activeAndRestricted.reduce(
      (a, b) => a + (b.access_restricted_by_date ? 0 : 1),
      0
    )
  );
});

test('useCourses hook works when all courses are restricted', async () => {
  mockedAxios.get.mockResolvedValueOnce({ data: restricted });

  const res = (await getCourses({})).slice(1);
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
  mockedAxios.get.mockResolvedValueOnce({ data: activeAndRestricted });

  const res = (await getCourses(colors.custom_colors)).slice(1);
  expect(res).toBeDefined();
  expect(res.length).toBeGreaterThan(0);
  res.forEach((course) => {
    expect(course.id).toBeTruthy();
    expect(course.color).toBe(colors.custom_colors[course.id]);
  });
});
