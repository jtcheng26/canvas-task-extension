interface Course {
  id: string;
  color: string; // via dashboard colors request
  name: string; // via course code for now, may change to chosen names
  original_name?: string; // if the user assigns a new course name, canvas api will add an optional original_name field
  position: number; // via dashboard positions request
  course_code?: string;
  access_restricted_by_date?: boolean;
}

export default Course;
