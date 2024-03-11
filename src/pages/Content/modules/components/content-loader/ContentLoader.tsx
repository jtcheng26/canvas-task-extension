import React, { useEffect, useMemo, useRef } from 'react';
import TaskContainer from '../task-container';
import { AssignmentType, FinalAssignment, Options } from '../../types';
import onCoursePage from '../../utils/onCoursePage';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorRender from '../error/ErrorRender';
import { LMSConfig } from '../../types/config';

interface ContentLoaderProps {
  clickable: boolean;
  firstLoad: boolean;
  options: Options;
  startDate: Date;
  endDate: Date;
  loadedCallback: () => void;
  MIN_LOAD_TIME?: number; // delay between load and render so animations have time to play
  lms: LMSConfig;
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
  MIN_LOAD_TIME = 350,
  lms,
}: ContentLoaderProps): JSX.Element {
  const {
    data: plannerData,
    isError: assignmentsError,
    isSuccess,
    errorMessage: assignmentsErrorMessage,
  } = lms.useAssignments(startDate, endDate, options);
  const {
    data: courseData,
    isError: coursesError,
    isSuccess: coursesSuccess,
    errorMessage: coursesErrorMessage,
  } = lms.useCourses(options.theme_color);
  const animationStart = useRef(0); // for counting load time

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
    if (!isSuccess || !coursesSuccess) {
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
  }, [isSuccess, coursesSuccess]);

  const assignmentData = useMemo(() => {
    /* IMPORTANT: validates all `course_id` in assignments. This is the first point where both assignment and course data are synchronized. */
    if (!(plannerData && courseData))
      return { assignments: [], announcements: [] };
    const map = new Set<string>();
    courseData.forEach((c) => map.add(c.id));
    return {
      assignments: filterAnnouncements(plannerData, false).map((a) => {
        if (!map.has(a.course_id))
          return {
            ...a,
            course_id: '0',
          };
        return a;
      }),
      announcements: filterAnnouncements(plannerData, true).map((a) => {
        if (!map.has(a.course_id))
          return {
            ...a,
            course_id: '0',
          };
        return a;
      }),
    };
  }, [plannerData, courseData]);

  const onCourse = onCoursePage();
  const isLoading = !firstLoad && !clickable;

  // so props are "frozen" while loading and update in sync when done loading
  const prevData = useRef({
    courses: courseData,
    assignments: assignmentData ? assignmentData.assignments : [],
    announcements: assignmentData ? assignmentData.announcements : [],
    startDate: startDate,
    endDate: endDate,
  });

  useEffect(() => {
    if (!isLoading) {
      prevData.current = {
        courses: courseData,
        assignments: assignmentData ? assignmentData.assignments : [],
        announcements: assignmentData ? assignmentData.announcements : [],
        startDate: startDate,
        endDate: endDate,
      };
    }
  }, [isLoading, assignmentData, courseData, startDate, endDate]);

  if (assignmentsError)
    return (
      <ErrorRender
        error={
          new Error('Assignments Failed to load: ' + assignmentsErrorMessage)
        }
      />
    );
  if (coursesError)
    return (
      <ErrorRender
        error={new Error('Courses failed to load: ' + coursesErrorMessage)}
      />
    );
  return (
    <ErrorBoundary fallbackRender={ErrorRender}>
      <TaskContainer
        announcements={
          isLoading
            ? prevData.current.announcements
            : assignmentData.announcements
        }
        assignments={
          isLoading ? prevData.current.assignments : assignmentData.assignments
        }
        courseData={(isLoading ? prevData.current.courses : courseData) || []}
        courseId={onCourse}
        endDate={isLoading ? prevData.current.endDate : endDate}
        lms={lms}
        loading={isLoading} // on first load, show immediately (no min delay)
        options={options}
        startDate={isLoading ? prevData.current.startDate : startDate}
      />
    </ErrorBoundary>
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
