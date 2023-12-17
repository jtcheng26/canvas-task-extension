import { Course } from '../types';
import useStore from './useStore';

interface CourseStoreInterface {
  state: Record<string, Course>;
  addCourse: (course: Course) => void;
  updateCourseColor: (id: string, color: string) => void;
  updateError: (id: string) => void;
}

export default function useCourseStore(): CourseStoreInterface {
  const [state, updateKey] = useStore<Course>({});
  function addCourse(course: Course) {
    updateKey([course.id], course);
  }
  function updateCourseColor(id: string, color: string) {
    updateKey([id, 'color'], color);
  }
  function updateError(id: string) {
    updateKey([id, 'error'], 0);
  }
  return {
    state,
    addCourse,
    updateCourseColor,
    updateError,
  };
}
