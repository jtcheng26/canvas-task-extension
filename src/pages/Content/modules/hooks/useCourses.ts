import axios from 'axios';
import { THEME_COLOR } from '../constants';
import { DemoColors, DemoCourses, DemoPositions } from '../tests/demo';
import { Course } from '../types';
import baseURL from '../utils/baseURL';
import isDemo from '../utils/isDemo';
import { useEffect, useState } from 'react';
import { getPaginatedRequest } from './useAssignments';
import { storeCanvasCourses } from '../components/gradescope/utils/store';
import { UseCoursesHookInterface } from '../types/config';

/* Get user dashboard course positions */
async function getCoursePositions(): Promise<Record<string, number>> {
  if (isDemo()) return DemoPositions;

  const { data } = await axios.get(
    `${baseURL()}/api/v1/users/self/dashboard_positions`
  );

  Object.keys(data.dashboard_positions).forEach((course_id) => {
    data.dashboard_positions[course_id.substring(7)] =
      data.dashboard_positions[course_id];
  });

  return data.dashboard_positions;
}

async function getCourseColors(
  defaultColor?: string
): Promise<Record<string, string>> {
  if (isDemo()) return DemoColors;

  const { data } = await axios.get(`${baseURL()}/api/v1/users/self/colors`);

  /* course_xxxxxx from api, we only want xxxxxx */
  Object.keys(data.custom_colors).forEach((course_id) => {
    data.custom_colors[course_id.substring(7)] = data.custom_colors[course_id];
  });

  data.custom_colors['0'] = defaultColor || THEME_COLOR;

  return data.custom_colors;
}

/* Apply user-chosen course positions. */
function applyCoursePositions(
  courses: Course[],
  positions: Record<string, number>
): Course[] {
  courses.forEach((course: Course) => {
    course.position = course.id in positions ? positions[course.id] : 0;
  });
  return courses;
}

/* Apply the `color` property to each course. */
function applyColor(
  courses: Course[],
  colors: Record<string, string>,
  defaultColor?: string
): Course[] {
  courses.forEach((course) => {
    course.color =
      course.id in colors ? colors[course.id] : defaultColor || THEME_COLOR;
  });
  return courses;
}

/* Fetch user-chosen course names. */
function applyCourseNames(courses: Course[]): Course[] {
  courses.forEach((course: Course) => {
    course.name = course.original_name
      ? (course.name as string)
      : (course.course_code as string);
  });
  return courses;
}

/* Get all courses (200 limit for now, will change to paginate in the future) */
export async function getCourses(defaultColor?: string): Promise<Course[]> {
  const [res, colors, positions] = isDemo()
    ? [DemoCourses, DemoColors, DemoPositions]
    : await Promise.all([
        getPaginatedRequest<Course>(
          `${baseURL()}/api/v1/courses?per_page=200`,
          true
        ),
        getCourseColors(),
        getCoursePositions(),
      ]);

  const CustomCourse: Course = {
    id: '0',
    color: defaultColor || THEME_COLOR,
    position: 0,
    name: 'Custom Task',
    course_code: 'Custom Task',
  };

  const courses = res
    .filter((course: Course) => !course.access_restricted_by_date)
    .map((course: Course) => {
      course.id = course.id.toString();
      return course;
    });

  applyColor(courses, colors);
  applyCourseNames(courses);
  applyCoursePositions(courses, positions);

  if (courses.length) storeCanvasCourses(courses);

  return [CustomCourse].concat(courses);
}

export const makeUseCourses = (
  loader: (defaultColor?: string) => Promise<Course[]>
) => {
  return (defaultColor?: string) => {
    const [state, setState] = useState<UseCoursesHookInterface>({
      data: null,
      isError: false,
      isSuccess: false,
      errorMessage: '',
    });
    useEffect(() => {
      loader(defaultColor)
        .then((res) => {
          setState({
            data: res,
            isSuccess: true,
            isError: false,
            errorMessage: '',
          });
        })
        .catch((err) => {
          console.error(err);
          setState({
            data: null,
            isSuccess: false,
            isError: true,
            errorMessage: err.message,
          });
        });
    }, []);
    return state;
  };
};

/* Use cached course data */
export const useCanvasCourses = makeUseCourses(getCourses);
