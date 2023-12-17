import React from 'react';
import isDarkMode from '../utils/isDarkMode';
import useCourseStore from '../hooks/useCourseStore';

export const DarkContext = React.createContext(isDarkMode());
export const CourseStoreContext = React.createContext(useCourseStore());
