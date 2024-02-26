import { AssignmentStatus } from '../../../types/assignment';

export interface GradescopeCourse {
  gid: string; // gradescope id
  name: string;
  course_code: string; // shortname
}

export interface GradescopeTask {
  id: string;
  gid: string;
  name: string;
  status: string;
  due_date: string;
}

export interface GradescopeIntegrationState {
  GSCOPE_INT_canvas_courses: Record<string, string>; // Canvas course_id to name (for gscope)
  GSCOPE_INT_course_id_map: Record<string, string>; // gid to Canvas course_id (for Canvas), also is the record of enabled courses (for gscope)
  // tasks_map: Record<string, GradescopeTask[]>; // list of gscope tasks per course (for Canvas), GSCOPE_INT_tasks_12345 <12345 is gid>
  // courses_map: Record<string, GradescopeCourse[]>;
}

export interface GradescopeOverride {
  id: string;
  gid: string;
  name: string;
  status:
    | AssignmentStatus.COMPLETE
    | AssignmentStatus.UNFINISHED
    | AssignmentStatus.DELETED;
  due_date: string;
}
