interface Course {
  id: number;
  color: string;
  name: string;
  position: number;
  course_code?: string;
  access_restricted_by_date?: boolean;
}

export default Course;
