import { makeUseAssignments } from '../../shared/useAssignments';
import { makeUseCourses } from '../../shared/useCourses';
import { GRADESCOPE_THEME_COLOR } from '../../../components/gradescope/constants';
import { getSyncedCourses } from '../../../components/gradescope/utils/scrape';
import { Course, FinalAssignment, Options } from '../../../types';
import loadGradescopeAssignments from './loadGradescope';

async function loadGradescope(
  startDate: Date,
  endDate: Date,
  options: Options
): Promise<FinalAssignment[]> {
  const res = await Promise.all([
    loadGradescopeAssignments(startDate, endDate, options),
  ]);
  return Array.prototype.concat(...res);
}

async function getCourses(): Promise<Course[]> {
  const page = await (await fetch('https://www.gradescope.com/')).text();
  // DOMParser is safe from XSS as long as nodes aren't injected into the window DOM
  const parser = new DOMParser();
  const doc = parser.parseFromString(page, 'text/html');
  const courseSection = doc.getElementsByClassName('courseList');
  if (!courseSection) return []; // not logged in
  const termSection = courseSection[0].getElementsByClassName(
    'courseList--coursesForTerm'
  );
  const courseMap = await getSyncedCourses();
  const courseNodes = termSection[0].getElementsByTagName('a');
  const courses = Array.from(courseNodes).map((c) => {
    const id = c.href.split('/').pop();
    const name = c.getElementsByClassName('courseBox--name')[0].textContent;
    const shortName = c.getElementsByClassName('courseBox--shortname')[0]
      .textContent;
    return {
      id: !id ? '' : id in courseMap ? courseMap[id] : '',
      name: name || '',
      position: 0,
      color: GRADESCOPE_THEME_COLOR,
      course_code: shortName || '',
    };
  });
  return courses;
}

async function loadGradescopeCourses() {
  return await getCourses();
}

export const useGradescopeCourses = makeUseCourses(loadGradescopeCourses);

export const useGradescopeAssignments = makeUseAssignments(loadGradescope);
