import React, { useEffect, useMemo, useState } from 'react';
import CourseDropdown from '../course-dropdown';
import TaskChart from '../task-chart';
import TaskList from '../task-list';
import { Course, FinalAssignment, Options } from '../../types';
import extractCourses from './utils/extractCourses';
import { filterCourses, filterTimeBounds } from '../../hooks/useAssignments';
import markAssignment from './utils/markAssignment';
import deleteAssignment from './utils/deleteAssignment';
import { AssignmentStatus } from '../../types/assignment';
import { OptionsDefaults } from '../../constants';
import { CourseStoreContext, DarkContext } from '../../contexts/contexts';
import dashCourses from '../../utils/dashCourses';
import { useNewCourseStore } from '../../hooks/useCourseStore';
import { coursesToChoices } from '../course-dropdown/CourseDropdown';

export interface TaskContainerProps {
  assignments: FinalAssignment[];
  announcements: FinalAssignment[];
  loading?: boolean;
  courseId?: string | false;
  courseData: Course[]; // all courses, for corner case when on course page w/ no assignments
  options: Options;
  startDate?: Date;
  endDate?: Date;
}

/*
  Main app component that renders all async content
*/

export default function TaskContainer({
  announcements,
  assignments,
  courseId,
  courseData,
  loading,
  options,
  startDate,
  endDate,
}: TaskContainerProps): JSX.Element {
  const courseStore = useNewCourseStore(courseData);
  const courseList = Object.values(courseStore.state);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    courseList && courseId ? courseId : ''
  );

  const themeColor = options.theme_color || OptionsDefaults.theme_color;
  const weekKey = startDate?.toISOString() || '1';

  // update assignments in state when marked as complete, then push updates asynchronously to local storage
  const [updatedAssignments, setUpdatedAssignments] =
    useState<FinalAssignment[]>(assignments);

  const [updatedAnnouncements, setUpdatedAnnouncements] =
    useState<FinalAssignment[]>(announcements);

  const courses: string[] = useMemo(() => {
    if (courseList && courseId !== false)
      return courseId ? [courseId as string] : [];
    const extracted = extractCourses(
      updatedAssignments.concat(updatedAnnouncements)
    );
    if (options.dash_courses && courseList) {
      const inExtracted = new Set();
      extracted.forEach((id) => inExtracted.add(id));
      const dash = dashCourses();
      return dash
        ? extracted.concat(
            courseList
              .filter((c) => dash.has(c.id) && !inExtracted.has(c.id))
              .map((c) => c.id)
          )
        : extracted;
    }
    return extracted;
  }, [updatedAssignments, updatedAnnouncements, courseId, courseList]);

  function markAssignmentAs(id: string, status: AssignmentStatus) {
    if (status === AssignmentStatus.DELETED) {
      setUpdatedAssignments(
        updatedAssignments.filter((a) => {
          if (a.id === id) {
            deleteAssignment(a);
            return false;
          }
          return true;
        })
      );
    } else if (status === AssignmentStatus.SEEN) {
      setUpdatedAnnouncements(
        updatedAnnouncements.map((a) => {
          if (a.id == id) return markAssignment(AssignmentStatus.SEEN, a);
          return a;
        })
      );
    } else {
      setUpdatedAssignments(
        updatedAssignments.map((a) => {
          if (a.id == id) return markAssignment(status, a);
          return a;
        })
      );
    }
  }

  async function createNewAssignment(
    assignment: FinalAssignment | FinalAssignment[]
  ) {
    if (startDate && endDate) {
      const withinBounds = filterTimeBounds(
        startDate,
        endDate,
        Array.isArray(assignment) ? assignment : [assignment]
      );
      if (withinBounds.length) {
        const newAssignments = updatedAssignments.concat(withinBounds);
        setUpdatedAssignments(newAssignments);
      }
    }
  }

  // Don't let user switch courses when on a course page
  const chosenCourseId = courseId ? courseId : selectedCourseId;

  useEffect(() => {
    if (courseId) {
      setUpdatedAssignments(filterCourses([courseId], assignments));
      setUpdatedAnnouncements(filterCourses([courseId], announcements));
    } else {
      setUpdatedAssignments(assignments);
      setUpdatedAnnouncements(announcements);
    }
  }, [assignments, announcements, courseId]);

  return (
    <DarkContext.Provider value={options.dark_mode}>
      <CourseStoreContext.Provider value={courseStore}>
        <CourseDropdown
          choices={coursesToChoices(courses, courseStore)}
          onCoursePage={!!courseId}
          selectedId={chosenCourseId}
          setChoice={setSelectedCourseId}
        />
        <TaskChart
          assignments={updatedAssignments}
          colorOverride={
            courseId ? courseStore.state[courses[0]].color : undefined
          }
          courses={courses}
          loading={loading}
          onCoursePage={!!courseId}
          selectedCourseId={chosenCourseId}
          setCourse={setSelectedCourseId}
          showConfetti={options.show_confetti}
          themeColor={themeColor}
          weekKey={weekKey}
        />
        <TaskList
          announcements={updatedAnnouncements}
          assignments={updatedAssignments}
          createAssignment={createNewAssignment}
          loading={loading}
          markAssignment={markAssignmentAs}
          selectedCourseId={chosenCourseId}
          showConfetti={options.show_confetti}
          showDateHeadings={options.due_date_headings}
          weekKey={weekKey}
        />
      </CourseStoreContext.Provider>
    </DarkContext.Provider>
  );
}
