// JSON response from /api/v1/calender_events
interface Assignment {
  color?: string; // via course_id -> colors[course_id]
  html_url: string;
  name: string;
  points_possible: number;
  due_at: string;
  course_id: number;
  id: number;
  user_submitted: boolean;
  is_quiz_assignment: boolean;
  is_quiz_lti_assignment?: boolean;
  course_name?: string; // via useCourseName
  grade?: number; // via submission score/grade
  discussion_topic?: string | 0;
  locked_for_user?: boolean;
  needs_grading_count?: number; // for teachers/graders
  submission?: {
    attempt: number;
    score: number | null;
    grade: string | number | null;
    grader_id?: number | null; // check if assignment is graded or not
  };
  canvas_tasks_marked_as_complete?: boolean;
}

// JSON response from /api/v1/planner/items
interface PlannerAssignment {
  color?: string;
  course_id: number;
  id: number;
  plannable_type: 'assignment' | 'quiz' | 'discussion_topic' | 'planner_note';
  planner_override?: {
    marked_complete: boolean;
    dismissed: boolean;
  };
  submissions:
    | {
        submitted: boolean;
        excused: boolean;
        graded: boolean;
        missing: boolean;
        late: boolean;
        needs_grading: boolean;
        redo_request: boolean;
      }
    | boolean;
  plannable?: {
    id: number;
    title: string;
    due_at: string;
    points_possible: number;
  };
}

// Immutable object representation used in our code
interface FinalAssignment {
  color?: string; // color assigned to course
  html_url: string; // link to assignment page
  name: string; // title of assignment
  points_possible: number;
  due_at: string;
  course_id: number; // course the assignment belongs to
  id: number; // id of the assignment
  submitted: boolean; // has the user submitted it?
  graded: boolean; // has the teacher graded it?
  score?: number; // grade assigned, 0 if ungraded or unsubmitted
  type: AssignmentType;
  course_name?: string; // via useCourseName
  marked_complete: boolean; // marked complete in the sidebar or through the planner
  position?: number;
}

// possible values from plannable_type field
enum AssignmentType {
  ASSIGNMENT = 'assignment',
  QUIZ = 'quiz',
  DISCUSSION = 'discussion_topic',
  NOTE = 'planner_note',
  ANNOUNCEMENT = 'announcement',
  EVENT = 'calender_event',
}

export { Assignment, PlannerAssignment, FinalAssignment, AssignmentType };
