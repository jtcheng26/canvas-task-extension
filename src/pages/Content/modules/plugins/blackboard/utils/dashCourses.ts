import { DemoCourses } from '../../../tests/demo';
import isDemo from '../../../utils/isDemo';

export default function dashCoursesBlackboard(): Set<string> | undefined {
  if (isDemo()) return new Set(DemoCourses.map((d) => d.id));
  const links = Array.from(document.querySelectorAll('article'));
  if (links.length > 0) {
    /* card view, note this does not always work on first load :( */
    const onDash: Set<string> = new Set();
    links.forEach((link) => {
      const id = link.getAttribute('data-course-id');
      if (id) onDash.add(id);
    });
    if (onDash.size > 0) return onDash;
  }
  // for non-ultra (this won't work until a bit after page load when the anchor tags appear)
  const container = document.getElementById('My_Courses_Tools');
  if (container) {
    const elems = container.querySelectorAll('a');
    if (elems.length) {
      const onDash: Set<string> = new Set();
      elems.forEach((elem) => {
        if (!elem || !elem.parentElement) return;
        const url = new URL(elem.href);
        const courseId = url.searchParams.get('id');
        if (!courseId) return;
        onDash.add(courseId);
      });
      return onDash;
    }
  }

  return undefined;
}
