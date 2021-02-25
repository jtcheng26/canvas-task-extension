import axios from 'axios';
// import { demoAssignments, demoCourses } from '../test/demo'

export const dataFetcher = {
  courseNames: {},
  courseData: [],
  updateAssignmentData: async (userOptions, startDate, endDate) => {
    /*
      Fetch assignments based on course list. Uses calendar events api for improved performance, but as a result, will only show assignments that have a due date
    */
    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];
    let page = 0;
    let requests = [];
    while (page * 10 < dataFetcher.courseData.length) {
      let courseList = '';
      for (
        let i = 10 * page;
        i < 10 * page + 10 && i < dataFetcher.courseData.length;
        i++
      ) {
        courseList += `&context_codes[]=course_${dataFetcher.courseData[i].id}`;
      }
      requests.push(
        axios.get(
          `https://${location.hostname}/api/v1/calendar_events?type=assignment&start_date=${startStr}&end_date=${endStr}${courseList}&per_page=100&include=submission`
        )
      );
      page++;
    }
    requests = await axios.all(requests);
    let assignments = [];
    requests.forEach((request) => {
      assignments = assignments.concat(request.data);
    });
    /* 
      filter by visible courses and exclude locked assignments
    */
    dataFetcher.data.assignments = assignments.filter((task) => {
      return (
        !task.assignment.locked_for_user &&
        task.assignment.course_id in dataFetcher.courseNames
      );
    });
    /*
      set color and grade for assignments
    */
    dataFetcher.data.assignments = dataFetcher.data.assignments.map((task) => {
      task.assignment.color =
        dataFetcher.userData.colors[`course_${task.assignment.course_id}`];
      task.assignment.grade = task.assignment.submission.score
        ? task.assignment.submission.score
        : 0;
      if (task.assignment.submission.grade === 'complete')
        task.assignment.grade = 1;
      task.assignment.course_code =
        dataFetcher.courseNames[task.assignment.course_id];
      return task.assignment;
    });
    /*
      Filter by start and end time
    */
    dataFetcher.data.assignments = dataFetcher.data.assignments.filter(
      (task) => {
        const due_date = new Date(task.due_at);
        if (
          due_date.getMonth() == startDate.getMonth() &&
          due_date.getDate() == startDate.getDate()
        ) {
          if (due_date.getHours() == userOptions.startHour) {
            return due_date.getMinutes() >= userOptions.startMinutes;
          } else {
            return due_date.getHours() >= userOptions.startHour;
          }
        } else if (
          due_date.getMonth() == endDate.getMonth() &&
          due_date.getDate() == endDate.getDate()
        ) {
          if (due_date.getHours() == userOptions.startHour) {
            return due_date.getMinutes() < userOptions.startMinutes;
          } else {
            return due_date.getHours() < userOptions.startHour;
          }
        }
        return true;
      }
    );
    const assignment_count = {};
    for (let course_id in dataFetcher.courseNames) {
      assignment_count[course_id] = 0;
    }
    dataFetcher.data.assignments.forEach((assignment) => {
      assignment_count[assignment.course_id]++;
    });
    const url = location.pathname.split('/');
    if (url.length === 3 && url[url.length - 2] === 'courses') {
      /* course page */
      const id = parseInt(url.pop());
      dataFetcher.data.courses = dataFetcher.courseData.filter((course) => {
        return course.id === id;
      });
    } else {
      /* dashboard */
      let cardView = true;
      if (userOptions.dash_courses) {
        const links = Array.from(
          document.getElementsByClassName('ic-DashboardCard__link')
        );
        if (links.length === 0) {
          cardView = false;
        } else {
          /* card view */
          const onDash = {};
          links.forEach((link) => {
            const id = parseInt(link.href.split('/').pop());
            onDash[id] = true;
          });
          dataFetcher.data.courses = dataFetcher.courseData.filter((course) => {
            return onDash[course.id];
          });
        }
      }
      if (!cardView || !userOptions.dash_courses) {
        dataFetcher.data.courses = dataFetcher.courseData.filter((course) => {
          return assignment_count[course.id] > 0;
        });
      }
    }
    return dataFetcher.data;
  },
  userData: {},
  data: {},
  getCourseData: async () => {
    /*
      Course Data = course id, color, name, position
    */
    const url = location.pathname.split('/');
    if (url.length === 3 && url[url.length - 2] === 'courses') {
      /* on course page */
      const id = parseInt(url.pop());
      dataFetcher.courseData = [
        {
          id: id,
          color: dataFetcher.userData.colors[`course_${id}`],
          name: dataFetcher.courseNames[id],
          position: 0,
        },
      ];
    } else {
      /* if on dashboard and not course page */
      dataFetcher.courseData = dataFetcher.courseData.map((course) => {
        const obj = {},
          id = course.id;
        obj.id = id;
        obj.color = dataFetcher.userData.colors[`course_${id}`];
        obj.name = dataFetcher.courseNames[id];
        obj.position =
          dataFetcher.userData.positions[`course_${id}`] ||
          dataFetcher.userData.positions[`course_${id}`] === 0
            ? dataFetcher.userData.positions[`course_${id}`]
            : 10;
        return obj;
      });
    }
    dataFetcher.data.courses = dataFetcher.courseData;
  },
  getUserData: async () => {
    /*
      'User Data' = dashboard colors and dashboard positions
    */
    const request = axios.get(
      `https://${location.hostname}/api/v1/courses?per_page=200`
    );
    dataFetcher.userData = {
      colors: axios.get(
        `https://${location.hostname}/api/v1/users/self/colors`
      ),
      positions: axios.get(
        `https://${location.hostname}/api/v1/users/self/dashboard_positions`
      ),
    };
    const userDataGet = await axios.all([
      dataFetcher.userData.colors,
      dataFetcher.userData.positions,
      request,
    ]);
    dataFetcher.userData.colors = userDataGet[0].data.custom_colors;
    dataFetcher.userData.positions = userDataGet[1].data.dashboard_positions;
    dataFetcher.courseData = userDataGet[2].data.filter((course) => {
      return !course.access_restricted_by_date;
    });
    dataFetcher.courseData.forEach((course) => {
      dataFetcher.courseNames[course.id] = course.course_code;
    });
  },
  getRelevantAssignments: async (userOptions, startDate, endDate) => {
    /*
      fetches everything
    */
    try {
      if (Object.keys(dataFetcher.data).length == 0) {
        await dataFetcher.getUserData();
        //console.log(dataFetcher.userData);
        await dataFetcher.getCourseData();
        //console.log(dataFetcher.courseData);
      }
      await dataFetcher.updateAssignmentData(userOptions, startDate, endDate);
      //console.log(dataFetcher.data);
    } catch (error) {
      console.error(error);
    }
    // console.log(dataFetcher.data);
    // dataFetcher.data = {assignments: demoAssignments, courses: demoCourses}
    return dataFetcher.data;
  },
};
