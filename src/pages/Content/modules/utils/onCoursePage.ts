export default function onCoursePage(): boolean {
  const url = location.pathname.split('/');
  return url.length === 3 && url[url.length - 2] === 'courses';
}
