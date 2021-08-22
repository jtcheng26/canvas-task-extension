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
  submission?: {
    attempt: number;
    score: number | null;
    grade: string | number | null;
  };
}

export default Assignment;
