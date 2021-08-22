export default function onCoursePage(): false | number {
  const url = window.location.pathname.split('/');
  if (url.length === 3 && url[url.length - 2] === 'courses')
    return parseInt(url.pop() as string);
  return false;
}
