import { AssignmentStatus, FinalAssignment } from './assignment';
import Course from './course';
import Options from './options';

export type SupportedLMS = 'Canvas' | 'Demo';

// every interface that needs to be implemented for a new LMS
export interface LMSConfig {
  isActive: boolean; // true for only one LMS (i.e. window.location.hostname === ...)
  name: SupportedLMS;
  useAssignments: (
    startDate: Date,
    endDate: Date,
    options: Options
  ) => UseAssignmentsHookInterface; // read all assignments
  useCourses: (defaultColor?: string) => UseCoursesHookInterface; // read all the courses
  dashCourses: () => Set<string> | undefined; // for the active assignments/all courses option
  onCoursePage: () => false | string;
  createAssignment: (
    title: string,
    date: string,
    course_id?: string,
    grading?: boolean,
    link?: string
  ) => Promise<FinalAssignment | null>; // create assignments
  markAssignment: (
    complete: AssignmentStatus,
    assignment: FinalAssignment
  ) => FinalAssignment; // update/delete assignments
}

export interface UseAssignmentsHookInterface {
  data: FinalAssignment[] | null;
  isError: boolean;
  isSuccess: boolean;
  errorMessage: string;
}

export interface UseCoursesHookInterface {
  data: Course[] | null;
  isError: boolean;
  errorMessage: string;
  isSuccess: boolean;
}
