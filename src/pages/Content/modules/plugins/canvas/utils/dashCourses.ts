import { DemoCourses } from '../../../tests/demo';
import isDemo from '../../../utils/isDemo';

export default function dashCoursesCanvas(): Set<string> | undefined {
  if (isDemo()) return new Set(DemoCourses.map((d) => d.id));
  const links = Array.from(
    document.getElementsByClassName('ic-DashboardCard__link')
  );
  if (links.length > 0) {
    /* card view */
    const onDash: Set<string> = new Set();
    links.forEach((link) => {
      const id = (link as HTMLAnchorElement).href.split('/').pop() as string;
      onDash.add(id);
    });
    return onDash;
  }
}
