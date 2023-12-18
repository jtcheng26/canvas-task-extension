import React from 'react';
import isDarkMode from '../utils/isDarkMode';
import { CourseStoreInterface } from '../hooks/useCourseStore';

export const DarkContext = React.createContext(isDarkMode());
export const CourseStoreContext = React.createContext<CourseStoreInterface>(
  {} as CourseStoreInterface
);
