import axios from 'axios';
import baseURL from '../utils/baseURL';
import useCourses from './useCourses';

import activeAndRestricted from '../tests/data/api/courses/activeAndRestrictedCourses.json';
import active from '../tests/data/api/courses/activeCourses.json';
import restricted from '../tests/data/api/courses/restrictedCourses.json';
import testHookData from '../tests/utils/testHookData';
import { Course } from '../types';

jest.mock('axios');
jest.mock('../utils/baseURL');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedBaseURL = baseURL as jest.MockedFunction<() => string>;

beforeAll(() => {
  mockedBaseURL.mockReturnValue('mockedURL');
});

test('useCourses hook gets all the courses', async () => {
  mockedAxios.get.mockResolvedValueOnce({ data: active });

  const res = (await testHookData(useCourses)).data;
  expect(res).toStrictEqual(active);
});

test('useCourses hook filters date-restricted courses', async () => {
  mockedAxios.get.mockResolvedValueOnce({ data: activeAndRestricted });

  const res = (await testHookData(useCourses)).data as Course[];

  expect(res.length).toBe(
    activeAndRestricted.reduce(
      (a, b) => a + (b.access_restricted_by_date ? 0 : 1),
      0
    )
  );
});

test('useCourses hook works when all courses are restricted', async () => {
  mockedAxios.get.mockResolvedValueOnce({ data: restricted });

  const res = (await testHookData(useCourses)).data as Course[];
  expect(res).toBeDefined();
  expect(res.length).toBe(0);
});
