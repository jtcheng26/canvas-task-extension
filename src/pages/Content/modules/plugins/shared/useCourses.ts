import { Course } from '../../types';
import { useEffect, useState } from 'react';
import { UseCoursesHookInterface } from '../../types/config';

export const makeUseCourses = (
  loader: (defaultColor?: string) => Promise<Course[]>
) => {
  return (defaultColor?: string) => {
    const [state, setState] = useState<UseCoursesHookInterface>({
      data: null,
      isError: false,
      isSuccess: false,
      errorMessage: '',
    });
    useEffect(() => {
      loader(defaultColor)
        .then((res) => {
          setState({
            data: res,
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
