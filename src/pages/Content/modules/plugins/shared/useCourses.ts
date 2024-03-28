import { Course } from '../../types';
import { useEffect, useState } from 'react';
import { UseCoursesHookInterface } from '../../types/config';
import { THEME_COLOR } from '../../constants';

export const makeUseCourses = (loader: () => Promise<Course[]>) => {
  return (defaultColor?: string) => {
    const CustomCourse: Course = {
      id: '0',
      color: defaultColor || THEME_COLOR,
      position: 0,
      name: 'Custom Task',
      course_code: 'Custom Task',
    };
    const [state, setState] = useState<UseCoursesHookInterface>({
      data: null,
      isError: false,
      isSuccess: false,
      errorMessage: '',
    });
    useEffect(() => {
      loader()
        .then((res) => {
          setState({
            data: [CustomCourse].concat(res),
            isSuccess: true,
            isError: false,
            errorMessage: '',
          });
        })
        .catch((err) => {
          console.error(err);
          setState({
            data: null,
            isSuccess: false,
            isError: true,
            errorMessage: err.message,
          });
        });
    }, []);
    return state;
  };
};
