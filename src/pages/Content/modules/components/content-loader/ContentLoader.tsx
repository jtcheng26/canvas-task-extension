import React, { useEffect, useMemo, useRef } from 'react';
import TaskContainer from '../task-container';
import { AssignmentType, FinalAssignment, Options } from '../../types';
import useAssignments from '../../hooks/useAssignments';
import Skeleton from '../skeleton';
import onCoursePage from '../../utils/onCoursePage';
import useCourses from '../../hooks/useCourses';

interface ContentLoaderProps {
  clickable: boolean;
  firstLoad: boolean;
  options: Options;
  startDate: Date;
  endDate: Date;
  loadedCallback: () => void;
}

/*
  utility component that fetches async data and re-renders content when necessary
*/

function ContentLoader({
  clickable,
  firstLoad,
  options,
  startDate,
  endDate,
  loadedCallback,
}: ContentLoaderProps): JSX.Element {
  const {
    data: plannerData,
    isError,
    isSuccess, // "isLoading"
  } = useAssignments(startDate, endDate, options);
  const { data: courseData } = useCourses();
  const animationStart = useRef(0); // for counting load time
  const MIN_LOAD_TIME = 350; // delay between load and render so animations have time to play

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

  useEffect(() => {
    if (!isSuccess) {
      animationStart.current = Date.now();
    } else {
      const loadTime = Date.now() - animationStart.current;
      console.log('Tasks for Canvas: ' + loadTime / 1000 + 's load');
      // optional delay if loaded too fast
      if (loadTime < MIN_LOAD_TIME) {
        const to = setTimeout(() => {
          loadedCallback();
        }, Math.max(20, MIN_LOAD_TIME - loadTime));
        return () => {
          clearTimeout(to);
        };
      } else {
        loadedCallback();
      }
    }
  }, [isSuccess]);

  const assignmentData = useMemo(
    () =>
      plannerData
        ? {
            assignments: filterAnnouncements(plannerData, false),
            announcements: filterAnnouncements(plannerData, true),
          }
        : null,
    [plannerData]
  );

  const failed = 'Failed to load';
  const onCourse = onCoursePage();
  const loaded = clickable;

  if (isError) return <h1>{failed}</h1>;
  if (!assignmentData || !courseData)
    return <Skeleton dark={options.dark_mode} />;
  return (
    <TaskContainer
      announcements={assignmentData.announcements}
      assignments={assignmentData.assignments}
      courseData={courseData}
      courseId={onCourse}
      endDate={endDate}
      loading={!firstLoad && !loaded} // on first load, show immediately (no min delay)
      options={options}
      startDate={startDate}
    />
  );
}

/*
  compareProps function so content is re-rendered properly when prev and next buttons clicked
*/
function compareProps(
  prevProps: ContentLoaderProps,
  nextProps: ContentLoaderProps
) {
  return prevProps.clickable == nextProps.clickable;
}

export default React.memo(ContentLoader, compareProps);
