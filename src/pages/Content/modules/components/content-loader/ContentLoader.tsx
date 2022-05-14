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

  useEffect(() => {
    if (isSuccess) {
      setAssignmentData(data as FinalAssignment[]);
      loadedCallback();
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
          loading={!isSuccess}
          options={options}
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
