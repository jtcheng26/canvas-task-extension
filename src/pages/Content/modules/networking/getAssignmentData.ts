import axios from 'axios';
import { Options, Course, Assignment, UserData, Data } from '../types';
import AllAssignmentsRequest from './requests/allAssignments';

export default async function getAssignmentData(
  courseData: Course[],
  userData: UserData,
  options: Options,
  startDate: Date,
  endDate: Date
) {
  /*
    Fetch assignments based on course list. Uses calendar events api for improved performance, but as a result, will only show assignments that have a due date
  */
  const startStr = startDate.toISOString().split('T')[0];
  const endStr = endDate.toISOString().split('T')[0];
  const requests = await axios.all(
    AllAssignmentsRequest(startStr, endStr, courseData)
  );
  let assignments: Assignment[] = [];
  requests.forEach((request) => {
    request.data.forEach((data: { assignment: Assignment }) => {
      assignments.push(data.assignment);
    });
  });
  /* 
    filter 1: visible courses and exclude locked assignments
  */
  assignments = assignments.filter((assignment) => {
    if (!(assignment.course_id in userData.names)) {
      return false;
    } else if (assignment.locked_for_user) {
      if (assignment.submission) {
        return assignment.submission.attempt || assignment.submission.score;
      } else {
        return false;
      }
    } else {
      return true;
    }
  });
  /*
    set color and grade for assignments
  */
  assignments = assignments.map((assignment) => {
    assignment.color = userData.colors[`course_${assignment.course_id}`];
    if (assignment.submission) {
      assignment.grade = assignment.submission.score
        ? assignment.submission.score
        : 0;
      if (assignment.submission.grade === 'complete') assignment.grade = 1;
      if (
        typeof assignment.submission.grade === 'string' &&
        assignment.submission.grade.length === 1 &&
        assignment.submission.grade.match(/[A-E]/i)
      )
        assignment.grade = 1;
    } else {
      assignment.grade = 0;
    }
    assignment.course_code = userData.names[assignment.course_id];
    return assignment;
  });
  /*
    filter 2: start and end time
  */
  assignments = assignments.filter((assignment) => {
    const due_date = new Date(assignment.due_at);
    if (
      due_date.getMonth() == startDate.getMonth() &&
      due_date.getDate() == startDate.getDate()
    ) {
      if (due_date.getHours() == options.startHour) {
        return due_date.getMinutes() >= options.startMinutes;
      } else {
        return due_date.getHours() >= options.startHour;
      }
    } else if (
      due_date.getMonth() == endDate.getMonth() &&
      due_date.getDate() == endDate.getDate()
    ) {
      if (due_date.getHours() == options.startHour) {
        return due_date.getMinutes() < options.startMinutes;
      } else {
        return due_date.getHours() < options.startHour;
      }
    }
    return true;
  });
  /* 
    count # of assignments for each course
  */
  const assignment_count: { [key: number]: number } = {};
  for (let course_id in userData.names) {
    assignment_count[course_id] = 0;
  }
  assignments.forEach((assignment) => {
    assignment_count[assignment.course_id]++;
  });
  /*
    if on course page, filter to course
  */
  let courses: Course[] = [];
  const url = location.pathname.split('/');
  if (url.length === 3 && url[url.length - 2] === 'courses') {
    const id = parseInt(url.pop() as string);
    courses = courseData.filter((course) => {
      return course.id === id;
    });
  } else {
    /* dashboard */
    let cardView = true;
    if (options.dash_courses) {
      const links = Array.from(
        document.getElementsByClassName('ic-DashboardCard__link')
      );
      if (links.length === 0) {
        cardView = false;
      } else {
        /* card view */
        const onDash: { [key: number]: boolean } = {};
        links.forEach((link) => {
          const id = parseInt(
            (link as HTMLAnchorElement).href.split('/').pop() as string
          );
          onDash[id] = true;
        });
        courses = courseData.filter((course) => {
          return onDash[course.id];
        });
        assignments = assignments.filter((assignment) => {
          return onDash[assignment.course_id];
        });
      }
    }
    /* 
      filter 3: courses w/ active assignments
    */
    if (!cardView || !options.dash_courses) {
      courses = courseData.filter((course) => {
        return assignment_count[course.id] > 0;
      });
    }
  }
  return {
    courses,
    assignments,
  };
}
