import React from 'react';
import { generateTestSample } from './utils/generate';
import { Course, PlannerAssignment } from '../types';
import { OptionsDefaults } from '../constants';
import axios from 'axios';
import baseURL from '../utils/baseURL';
import {
  APITestData,
  mockAPI,
  mockAPIData,
  mockedBaseURLString,
} from './utils/api';
import {
  all_planner_tests,
  courses_tests,
  custom_colors_tests,
  custom_pos_tests,
} from './data/api/space';
import App from '../components/App';
import chrome from 'sinon-chrome';
import fs from 'fs';
import { generateRandomNumberArray } from './utils/generate';
import {
  render,
  RenderResult,
  prettyDOM,
  screen,
  cleanup,
} from '@testing-library/react';
import RealPlannerData from './data/api/planner.json';
import RealColorsData from './data/api/colors.json';
import RealPosData from './data/api/dashboard_positions.json';
import RealCourseData from './data/api/courses.json';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('../utils/baseURL');
const mockedBaseURL = baseURL as jest.MockedFunction<() => string>;

beforeAll(() => {
  fs.mkdirSync('./log/tests/smoke', { recursive: true });
  fs.mkdirSync('./log/tests/failed', { recursive: true });
  mockedBaseURL.mockReturnValue(mockedBaseURLString);
  // hacky but I'm not using any weird chrome APIs so it's fine
  global.chrome = chrome as unknown as typeof global.chrome;
});

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  cleanup();
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

function logTestToFile(
  filename: string,
  test: PlannerAssignment[],
  seed: number[]
) {
  const courses = courses_tests[seed[2] % courses_tests.length];
  const colors = custom_colors_tests[seed[1] % custom_colors_tests.length];
  const pos = custom_pos_tests[seed[0] % custom_pos_tests.length];
  fs.writeFileSync(
    `${filename}-${Date.now().valueOf()}.json`,
    JSON.stringify(
      {
        planner_items: test,
        courses: courses,
        colors: colors,
        positions: pos,
      },
      null,
      2
    ) + '\n'
  );
}

async function renderAppTest(
  test: PlannerAssignment[],
  seed: number[],
  data?: APITestData
): Promise<RenderResult> {
  if (data) mockAPIData(data, mockedAxios);
  else mockAPI(test, seed, mockedAxios);
  try {
    const app = render(
      <App
        MIN_LOAD_TIME={0}
        options={{ ...OptionsDefaults, show_confetti: false }}
      />
    );
    return app;
  } catch (err) {
    logTestToFile(
      './log/tests/failed/tfc-test-log-fail',
      data ? data.planner_items : test,
      seed
    );
    throw err;
  }
}

describe('end-to-end', () => {
  it('renders smoke test', async () => {
    const seed = generateRandomNumberArray(3);
    const FAILED_TEST_DATA = undefined; //FAILED_TEST as APITestData;
    const tests = generateTestSample(20, all_planner_tests);
    const app = await renderAppTest(tests, seed, FAILED_TEST_DATA);
    expect(await screen.findByText('Complete')).toBeTruthy();
    fs.writeFileSync(
      './log/tests/smoke/tfc-test-log.html',
      prettyDOM(app.container, 1000000, { highlight: false }) + '\n'
    );
    logTestToFile('./log/tests/smoke/tfc-test-log', tests, seed);
    expect(app.container.querySelectorAll('#tfc-fail-load')).toHaveLength(0); // <Header /> and <ContentLoader />
  });

  it('works on real data', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2021-12-14'));
    const TEST_DATA = {
      planner_items: RealPlannerData,
      courses: RealCourseData as unknown as Course[],
      colors: RealColorsData,
      positions: RealPosData,
    } as APITestData;
    const app = await renderAppTest([], [], TEST_DATA);
    expect(await screen.findByText('Complete')).toBeTruthy();
    expect(await screen.findByText('Literary Criticism Essay')).toBeTruthy();
    expect(app.container.querySelectorAll('#tfc-fail-load')).toHaveLength(0); // <Header /> and <ContentLoader />
  });

  for (let k = 1; k <= 200; k++) {
    const tasks_per_run = 100;
    it('renders stress test ' + k, async () => {
      const tests = generateTestSample(tasks_per_run, all_planner_tests);
      await renderAppTest(tests, generateRandomNumberArray(3));
      expect(await screen.findByText('Complete')).toBeTruthy();
    });
  }

  for (let k = 1; k <= 20; k++) {
    const tasks_per_run = 10000;
    it('renders load test ' + k, async () => {
      const tests = generateTestSample(tasks_per_run, all_planner_tests);
      await renderAppTest(tests, generateRandomNumberArray(3));
      expect(await screen.findByText('Complete')).toBeTruthy();
    });
  }
});
