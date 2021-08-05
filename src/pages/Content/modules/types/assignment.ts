interface Assignment {
  color: string;
  html_url: string;
  name: string;
  points_possible: number;
  due_at: string;
  course_id: number;
  id: number;
  user_submitted: boolean;
  is_quiz_assignment: boolean;
  is_quiz_lti_assignment?: boolean;
  course_code: string;
  grade: number;
}

export default Assignment;
