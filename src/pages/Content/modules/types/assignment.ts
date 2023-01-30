// JSON response from /api/v1/planner/items
interface PlannerAssignment {
  id?: string; // returned by POST /api/v1/planner_notes
  color?: string;
  course_id: string;
  plannable_id: string;
  plannable_type: AssignmentType;
  planner_override: {
    id: string;
    marked_complete: boolean;
    dismissed: boolean;
  } | null;
  plannable_date?: string;
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
    id: string;
    title: string;
    due_at?: string;
    todo_date?: string; // for custom planner notes
    points_possible?: number;
    course_id?: string; // for custom planner notes
    linked_object_html_url?: string; // for custom planner notes
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
  course_id: string; // course the assignment belongs to
  id: string; // id of the assignment
  plannable_id: string; // id of planner item for marking complete
  override_id?: string; // id of existing planner override
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

enum AssignmentStatus {
  UNFINISHED = 'unfinished',
  COMPLETE = 'complete',
  DELETED = 'deleted',
}

export { PlannerAssignment, FinalAssignment, AssignmentType, AssignmentStatus };
