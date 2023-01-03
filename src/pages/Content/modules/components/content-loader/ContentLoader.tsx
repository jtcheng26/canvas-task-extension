import React, { useEffect, useState } from 'react';
import TaskContainer from '../task-container';
import { FinalAssignment, Options } from '../../types';
import CompareMonthDate from './utils/compareMonthDate';
import useAssignments from '../../hooks/useAssignments';
import Skeleton from '../skeleton';
import onCoursePage from '../../utils/onCoursePage';
import useCourses from '../../hooks/useCourses';

interface ContentLoaderProps {
  options: Options;
  startDate: Date;
  endDate: Date;
  loadedCallback: () => void;
}

/*
  utility component that fetches async data and re-renders content when necessary
*/

function ContentLoader({
  options,
  startDate,
  endDate,
  loadedCallback,
}: ContentLoaderProps): JSX.Element {
  const [assignmentData, setAssignmentData] =
    useState<FinalAssignment[] | null>();
  const { data, isError, isSuccess } = useAssignments(
    startDate,
    endDate,
    options
  );

  const { data: courseData } = useCourses();

  const MIN_LOAD_TIME = 300; // keep waiting for animation if data loads too fast
  const [animationStart, setAnimationStart] = useState(0);

  useEffect(() => {
    if (isSuccess) {
      const loadTime = Date.now() - animationStart;
      console.log(loadTime / 1000);
      if (loadTime < MIN_LOAD_TIME) {
        const to = setTimeout(() => {
          setAssignmentData(data as FinalAssignment[]);
          loadedCallback();
        }, Math.min(20, MIN_LOAD_TIME - loadTime));
        return () => clearTimeout(to);
      } else {
        setAssignmentData(data as FinalAssignment[]);
        loadedCallback();
      }
    } else {
      setAnimationStart(Date.now());
    }
  }, [isSuccess]);

  const failed = 'Failed to load';
  const onCourse = onCoursePage();
  return (
    <>
      {!isSuccess && !isError && !assignmentData && <Skeleton />}
      {assignmentData ? (
        <TaskContainer
          assignments={assignmentData}
          courseId={onCourse}
          courseList={courseData}
          endDate={endDate}
          loading={!isSuccess}
          options={options}
          startDate={startDate}
        />
      ) : (
        ''
      )}
      {isError && <h1>{failed}</h1>}
    </>
  );
}

/*
  compareProps function so content is re-rendered properly when prev and next buttons clicked
*/
function compareProps(
  prevProps: ContentLoaderProps,
  nextProps: ContentLoaderProps
) {
  return (
    CompareMonthDate(prevProps.startDate, nextProps.startDate) &&
    CompareMonthDate(prevProps.endDate, nextProps.endDate)
  );
}

export default React.memo(ContentLoader, compareProps);
