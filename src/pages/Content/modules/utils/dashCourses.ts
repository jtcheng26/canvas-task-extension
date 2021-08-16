export default function dashCourses(): Set<number> | undefined {
  const links = Array.from(
    document.getElementsByClassName('ic-DashboardCard__link')
  );
  if (links.length > 0) {
    /* card view */
    const onDash: Set<number> = new Set();
    links.forEach((link) => {
      const id = parseInt(
        (link as HTMLAnchorElement).href.split('/').pop() as string
      );
      onDash.add(id);
    });
    return onDash;
  }
}
