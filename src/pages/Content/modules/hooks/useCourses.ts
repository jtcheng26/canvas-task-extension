import axios from 'axios';
import { THEME_COLOR } from '../constants';
import { DemoColors, DemoCourses, DemoPositions } from '../tests/demo';
import { Course } from '../types';
import baseURL from '../utils/baseURL';
import isDemo from '../utils/isDemo';
import { useEffect, useState } from 'react';

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
async function applyCoursePositions(courses: Course[]): Promise<Course[]> {
  const positions = await getCoursePositions();
  courses.forEach((course: Course) => {
    course.position = course.id in positions ? positions[course.id] : 0;
  });
  return courses;
}

/* Apply the `color` property to each course. */
async function applyColor(
  courses: Course[],
  defaultColor?: string
): Promise<Course[]> {
  const colors = await getCourseColors(defaultColor);
  courses.forEach((course) => {
    course.color =
      course.id in colors ? colors[course.id] : defaultColor || THEME_COLOR;
  });
  return courses;
}

/* Fetch user-chosen course names. */
async function applyCourseNames(courses: Course[]): Promise<Course[]> {
  courses.forEach((course: Course) => {
    course.name = course.original_name
      ? (course.name as string)
      : (course.course_code as string);
  });
  return courses;
}

/* Get all courses (200 limit for now, will change to paginate in the future) */
export async function getCourses(): Promise<Course[]> {
  if (isDemo()) return DemoCourses;

  const { data } = await axios.get(`${baseURL()}/api/v1/courses?per_page=200`);

  const CustomCourse: Course = {
    id: '0',
    color: THEME_COLOR,
    position: 0,
    name: 'Custom Task',
    course_code: 'Custom Task',
  };

  const courses = data
    .filter((course: Course) => !course.access_restricted_by_date)
    .map((course: Course) => {
      course.id = course.id.toString();
      return course;
    });

  await Promise.all([
    applyColor(courses),
    applyCourseNames(courses),
    applyCoursePositions(courses),
  ]);

  return [CustomCourse].concat(courses);
}

interface UseCoursesHookInterface {
  data: Course[] | null;
  isError: boolean;
  isSuccess: boolean;
}

/* Use cached course data */
export default function useCourses(): UseCoursesHookInterface {
  const [data, setData] = useState<Course[] | null>(null);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  useEffect(() => {
    setIsSuccess(false);
    setIsError(false);
    getCourses()
      .then((res) => {
        setData(res);
        setIsSuccess(true);
        setIsError(false);
      })
      .catch((err) => {
        console.error(err);
        setIsError(true);
        setIsSuccess(false);
      });
  }, []);
  return {
    data,
    isError,
    isSuccess,
  };
}
