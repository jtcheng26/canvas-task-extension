import { storeCanvasCourses } from '../../../components/gradescope/utils/store';
import { Course } from '../../../types';
import baseURL from '../../../utils/baseURL';
import { loadCustomColorsWithDefaults } from '../../shared/customColors';

type PaginatedAPIResponse<T> = {
  results: T[];
  paging?: {
    nextPage: string;
  };
};

export async function getPaginatedRequestBlackboard<T>(
  url: string,
  recurse = false
): Promise<T[]> {
  const res = (await (await fetch(url)).json()) as PaginatedAPIResponse<T>;
  if (recurse && 'paging' in res && res.paging) {
    return res.results.concat(
      await getPaginatedRequestBlackboard(res.paging.nextPage, true)
    );
  }
  return res.results;
}

export type BlackboardCalendarItemType = '';

type BlackboardCalendar = {
  id: string;
  name: string;
};

async function getCourseColors(
  courses: string[]
): Promise<Record<string, string>> {
  const colors = await loadCustomColorsWithDefaults(
    'blackboard_custom',
    courses
  );

  return colors;
}

export default async function loadBlackboardCourses() {
  const res = await getPaginatedRequestBlackboard<BlackboardCalendar>(
    `${baseURL()}/learn/api/public/v1/calendars`,
    true
  );

  const filteredCourses = res.filter(
    (c) => c.id != 'INSTITUTION' && c.id != 'PERSONAL'
  );

  const colors = await getCourseColors(filteredCourses.map((c) => c.id));

  const courses: Course[] = filteredCourses.map((c) => {
    const cnameSplit = c.name.split(': ');
    return {
      id: c.id,
      color: colors[c.id],
      name:
        cnameSplit.length === 1
          ? cnameSplit[0]
          : cnameSplit.slice(1).join(': '),
      course_code: cnameSplit[0],
      position: 0,
    };
  });
  if (courses.length) storeCanvasCourses(courses);
  return courses;
}
