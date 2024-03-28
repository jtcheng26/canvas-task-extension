import { useCallback, useContext, useEffect } from 'react';
import { Course } from '../types';
import { useObjectStore } from './useStore';
import { CourseStoreContext } from '../contexts/contexts';

// call the callback function whenever course colors change
function watchDashboardColors(callback: (id: string, color: string) => void) {
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutationRecord) {
      if (
        (mutationRecord.target as HTMLElement).classList.contains(
          'ic-DashboardCard__header_hero'
        )
      ) {
        const parentHeader = (mutationRecord.target as HTMLElement).closest(
          '.ic-DashboardCard__header'
        );
        if (!parentHeader) return;
        // holds the new color
        const coloredHeader = parentHeader.getElementsByClassName(
          'ic-DashboardCard__header_hero'
        ) as HTMLCollectionOf<HTMLElement>;
        // holds the course_id as part of URL
        const courseLink = parentHeader.getElementsByClassName(
          'ic-DashboardCard__link'
        ) as HTMLCollectionOf<HTMLAnchorElement>;
        if (!coloredHeader.length || !courseLink.length) return;
        const color = coloredHeader[0].style.backgroundColor;
        const url = courseLink[0].href.split('/');
        const course_id = url.pop() || url.pop(); // handle trailing slashes in URL
        callback(course_id as string, color);
      }
    });
  });
  // watch all the dashboard cards for changes
  const cards = document.getElementsByClassName('ic-DashboardCard__header');
  Array.from(cards).forEach((card) => {
    observer.observe(card, {
      attributes: true,
      attributeFilter: ['style'],
      subtree: true,
    });
  });

  return observer;
}

// call the callback function whenever the user changes their `theme_color` in options
function watchOptionsThemeColor(callback: (id: string, color: string) => void) {
  const listener = (changes: {
    [key: string]: chrome.storage.StorageChange;
  }) => {
    if ('theme_color' in changes)
      callback('0', changes['theme_color'].newValue);
  };
  chrome.storage.onChanged.addListener(listener);
  return listener;
}

export interface CourseStoreInterface {
  state: Record<string, Course>;
  dashCourses?: Set<string>;
  addCourse: (course: Course) => void;
  updateCourseColor: (id: string, color: string) => void;
  getCourseList: (courses?: string[]) => Course[]; // return list of Course objects from subset of course ids (or return all if none specified)
  newPage: (courses: Course[]) => void; // replace all state
}

export function useNewCourseStore(
  courses: Course[] = [],
  dashCourses?: Set<string>
): CourseStoreInterface {
  function toMap(list: Course[]) {
    const map: Record<string, Course> = {};
    list.forEach((course) => (map[course.id] = course));
    return map;
  }
  const { state, update, initialize } = useObjectStore<Course>(toMap(courses));
  function addCourse(course: Course) {
    update([course.id], course);
  }
  const updateCourseColor = useCallback(
    (id: string, color: string) => {
      if (id in state) update([id, 'color'], color);
    },
    [state]
  );
  function getCourseList(courses?: string[]): Course[] {
    if (!courses) return Object.values(state);
    return courses.map((c) => state[c]);
  }
  function newPage(courses: Course[]): void {
    initialize(toMap(courses));
  }

  useEffect(() => {
    // attach listeners here
    const observers = [watchDashboardColors(updateCourseColor)];
    const chromeStorageListeners = [watchOptionsThemeColor(updateCourseColor)];
    return () => {
      observers.forEach((observer) => observer.disconnect());
      chromeStorageListeners.forEach((listener) =>
        chrome.storage.onChanged.removeListener(listener)
      );
    };
  }, [updateCourseColor]);

  return {
    state,
    dashCourses,
    addCourse,
    updateCourseColor,
    getCourseList,
    newPage,
  };
}

export default function useCourseStore(): CourseStoreInterface {
  return useContext(CourseStoreContext);
}
