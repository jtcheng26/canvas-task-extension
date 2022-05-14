// JSON response from /api/v1/planner/items
interface PlannerAssignment {
  color?: string;
  course_id: number;
  plannable_id: number;
  plannable_type: AssignmentType;
  planner_override: {
    marked_complete: boolean;
    dismissed: boolean;
  } | null;
  submissions:
    | {
        submitted: boolean;
        excused?: boolean;
        graded: boolean;
        missing?: boolean;
        late?: boolean;
        needs_grading: boolean;
        redo_request?: boolean;
        posted_at?: string;
      }
    | false;
  plannable: {
    id: number;
    title: string;
    due_at?: string;
    points_possible?: number;
  };
  html_url: string;
}

// Immutable object representation used in our code
interface FinalAssignment {
  color: string; // color assigned to course
  html_url: string; // link to assignment page
  name: string; // title of assignment
  points_possible: number;
  due_at: string;
  course_id: number; // course the assignment belongs to
  id: number; // id of the assignment
  submitted: boolean; // has the user submitted it?
  graded: boolean; // has the teacher graded it?
  graded_at: string; // date the teacher graded (if graded)
  score: number; // grade assigned, 0 if ungraded or unsubmitted
  type: AssignmentType;
  course_name: string; // via useCourseName
  marked_complete: boolean; // marked complete in the sidebar or through the planner
  position: number;
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

export { PlannerAssignment, FinalAssignment, AssignmentType };
