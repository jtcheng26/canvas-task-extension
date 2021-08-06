import { Course, UserData } from '../../types';

/* Combine course data with user-selected colors, names, and positions */
export default function processCourseData(
  courseData: Course[],
  userData: UserData
): Course[] {
  /*
    Course Data = course id, color, name, position
  */
  const url = location.pathname.split('/');
  if (url.length === 3 && url[url.length - 2] === 'courses') {
    /* on course page */
    const id = parseInt(url.pop() as string);
    courseData.push({
      id: id,
      color: userData.colors[`course_${id}`],
      name: userData.names[id],
      position: 0,
    });
  } else {
    /* if on dashboard and not course page */
    courseData = courseData.map((course) => {
      const obj: Course = {
        id: course.id,
        color: userData.colors[`course_${course.id}`],
        name: userData.names[course.id],
        position:
          userData.positions[`course_${course.id}`] ||
          userData.positions[`course_${course.id}`] === 0
            ? userData.positions[`course_${course.id}`]
            : 10,
      };
      return obj;
    });
  }
  return courseData;
}
