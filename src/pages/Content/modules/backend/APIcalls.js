import axios from 'axios';

export const dataFetcher = {
  courseList: '', // string list of courses for api calls
  courseNames: {},
  updateAssignmentData: async (userOptions, startDate, endDate) => {
    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];
    const assignments = await axios.get(
      `https://${location.hostname}/api/v1/calendar_events?type=assignment&start_date=${startStr}&end_date=${endStr}${dataFetcher.courseList}&per_page=100&include=submission`
    );
    dataFetcher.data.assignments = assignments.data.filter((task) => {
      return task.assignment.course_id in dataFetcher.courseNames;
    });
    dataFetcher.data.assignments = dataFetcher.data.assignments.map((task) => {
      task.assignment.color =
        dataFetcher.userData.colors[`course_${task.assignment.course_id}`];
      task.assignment.grade = task.assignment.submission.score
        ? task.assignment.submission.score
        : 0;
      if (task.assignment.submission.grade === 'complete')
        task.assignment.grade = 1;
      task.assignment.course_code =
        dataFetcher.courseNames[parseInt(task.assignment.course_id)];
      return task.assignment;
    });
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
    return dataFetcher.data;
  },
  userData: {},
  data: {},
  getCourseData: async () => {
    if (dataFetcher.userData.links.length > 0) {
      // if on dashboard and not course page
      let requests = [];
      for (let link of dataFetcher.userData.links) {
        const id = parseInt(link.pathname.split('/').pop());
        requests.push(
          axios.get(`https://${location.hostname}/api/v1/courses/${id}`)
        );
      }
      requests = await axios.all(requests);
      requests = requests.map((request) => {
        dataFetcher.courseNames[request.data.id] = request.data.course_code;
      });
      dataFetcher.data.courses = dataFetcher.userData.links.map((link) => {
        const obj = {},
          id = parseInt(link.pathname.split('/').pop());
        obj.id = parseInt(id);
        obj.color = dataFetcher.userData.colors[`course_${id}`];
        obj.name = dataFetcher.courseNames[parseInt(id)];
        obj.position = dataFetcher.userData.positions[`course_${id}`];
        return obj;
      });
    } else {
      // on course page
      const id = location.pathname.split('/').pop();
      const name = (
        await axios.get(`https://${location.hostname}/api/v1/courses/${id}`)
      ).data.course_code;
      dataFetcher.courseNames[id] = name;
      dataFetcher.data.courses = [
        {
          id: parseInt(id),
          color: dataFetcher.userData.colors[`course_${id}`],
          name: name,
          position: 0,
        },
      ];
    }
    dataFetcher.courseList = '';
    dataFetcher.data.courses.forEach((course) => {
      dataFetcher.courseList += `&context_codes[]=course_${course.id}`;
    });
  },
  getUserData: async () => {
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
    ]);
    dataFetcher.userData.colors = userDataGet[0].data.custom_colors;
    (dataFetcher.userData.links = Array.from(
      document.getElementsByClassName('ic-DashboardCard__link')
    )),
      (dataFetcher.userData.positions =
        userDataGet[1].data.dashboard_positions);
  },
  getRelevantAssignments: async (userOptions, startDate, endDate) => {
    try {
      if (Object.keys(dataFetcher.data).length == 0) {
        await dataFetcher.getUserData();
        await dataFetcher.getCourseData();
      }
      await dataFetcher.updateAssignmentData(userOptions, startDate, endDate);
    } catch (error) {
      console.error(error);
    }
    console.log(dataFetcher.data);
    return dataFetcher.data;
  },
};
