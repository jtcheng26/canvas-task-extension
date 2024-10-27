import { DemoCourses } from '../../../tests/demo';
import isDemo from '../../../utils/isDemo';

export default function dashCoursesBlackboard(): Set<string> | undefined {
  if (isDemo()) return new Set(DemoCourses.map((d) => d.id));
  const links = Array.from(document.querySelectorAll('article'));
  if (links.length > 0) {
    /* card view */
    const onDash: Set<string> = new Set();
    links.forEach((link) => {
      const id = link.getAttribute('data-course-id');
      if (id) onDash.add(id);
    });
    return onDash;
  }
}
