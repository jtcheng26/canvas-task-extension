/* Check if we are on a course page. */
export default function onCoursePage(): false | string {
  const url = window.location.pathname.split('/');
  if (url.length === 3 && url[url.length - 2] === 'courses')
    return url.pop() as string;
  return false;
}
