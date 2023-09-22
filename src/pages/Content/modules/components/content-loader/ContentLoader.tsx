import React, { useCallback, useEffect, useState } from 'react';
import TaskContainer from '../task-container';
import { AssignmentType, FinalAssignment, Options } from '../../types';
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

interface AssignmentData {
  assignments: FinalAssignment[];
  announcements: FinalAssignment[];
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
  const [assignmentData, setAssignmentData] = useState<AssignmentData | null>();
  const { data, isError, isSuccess } = useAssignments(
    startDate,
    endDate,
    options
  );

  const { data: courseData } = useCourses();

  const MIN_LOAD_TIME = 350; // keep waiting for animation if data loads too fast
  const [animationStart, setAnimationStart] = useState(0);

  const [loaded, setLoaded] = useState(false);

  function filterAnnouncements(
    data: FinalAssignment[],
    announcements: boolean
  ) {
    return data.filter((a) =>
      announcements
        ? a.type === AssignmentType.ANNOUNCEMENT
        : a.type !== AssignmentType.ANNOUNCEMENT
    );
  }

  const onLoad = useCallback((data: FinalAssignment[]) => {
    setLoaded(true);
    setAssignmentData({
      assignments: filterAnnouncements(data, false),
      announcements: filterAnnouncements(data, true),
    });
    loadedCallback();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      const loadTime = Date.now() - animationStart;
      console.log('Tasks for Canvas: ' + loadTime / 1000 + 's load');
      if (loadTime < MIN_LOAD_TIME) {
        const to = setTimeout(() => {
          onLoad(data as FinalAssignment[]);
        }, Math.max(20, MIN_LOAD_TIME - loadTime));
        return () => {
          clearTimeout(to);
        };
      } else {
        onLoad(data as FinalAssignment[]);
      }
    } else {
      setAnimationStart(Date.now());
      setLoaded(false);
    }
  }, [isSuccess]);

  const failed = 'Failed to load';
  const onCourse = onCoursePage();

  return (
    <>
      {!isSuccess && !isError && !assignmentData && (
        <Skeleton dark={options.dark_mode} />
      )}
      {assignmentData ? (
        <TaskContainer
          announcements={assignmentData.announcements}
          assignments={assignmentData.assignments}
          courseId={onCourse}
          courseList={courseData}
          endDate={endDate}
          loading={!loaded}
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
