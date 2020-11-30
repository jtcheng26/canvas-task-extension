import axios from 'axios';

function getPrevMonday() {
  const d = new Date();
  d.setDate(d.getDate() - ((d.getDay() - 1 + 7) % 7));
  d.setHours(23, 59, 59);
  return d;
}

function getNextMonday() {
  const d = new Date();
  if (d.getDay() != 1) {
    d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7));
  } else {
    d.setDate(d.getDate() + 7);
  }
  d.setHours(23, 59, 59);
  return d;
}

export const getRelevantAssignments = async () => {
  const data = {};
  data.prevMonday = getPrevMonday();
  data.nextMonday = getNextMonday();
  try {
    const userData = {
      colors: axios.get(
        `https://${location.hostname}/api/v1/users/self/colors`
      ),
      positions: axios.get(
        `https://${location.hostname}/api/v1/users/self/dashboard_positions`
      ),
    };
    const userDataGet = await axios.all([userData.colors, userData.positions]);
    userData.colors = userDataGet[0].data.custom_colors;
    (userData.links = Array.from(
      document.getElementsByClassName('ic-DashboardCard__link')
    )),
      (userData.positions = userDataGet[1].data.dashboard_positions);
    if (userData.links.length > 0) {
      // if on dashboard and not course page
      const courseNames = {};
      let requests = [];
      for (let link of userData.links) {
        const id = parseInt(link.pathname.split('/').pop());
        requests.push(
          axios.get(`https://${location.hostname}/api/v1/courses/${id}`)
        );
      }
      requests = await axios.all(requests);
      requests = requests.map((request) => {
        courseNames[request.data.id] = request.data.course_code;
      });
      data.courses = userData.links.map((link) => {
        const obj = {},
          id = parseInt(link.pathname.split('/').pop());
        obj.id = parseInt(id);
        obj.color = userData.colors[`course_${id}`];
        obj.name = courseNames[parseInt(id)];
        obj.position = userData.positions[`course_${id}`];
        return obj;
      });
    } else {
      // on course page
      const id = location.pathname.split('/').pop();
      const name = (
        await axios.get(`https://${location.hostname}/api/v1/courses/${id}`)
      ).data.course_code;
      data.courses = [
        {
          id: parseInt(id),
          color: userData.colors[`course_${id}`],
          name: name,
          position: 0,
        },
      ];
    }
    let courseList = '';
    data.courses.forEach((course) => {
      courseList += `&context_codes[]=course_${course.id}`;
    });
    const assignments = await axios.get(
      `https://${
        location.hostname
      }/api/v1/calendar_events?type=assignment&start_date=${data.prevMonday.toISOString()}&end_date=${data.nextMonday.toISOString()}&include=submission${courseList}`
    );
    data.assignments = assignments.data.map((task) => task.assignment);
    data.assignments = data.assignments.filter((task) => {
      task.color = userData.colors[`course_${task.course_id}`];
      const due = new Date(task.due_at);
      return (
        due.valueOf() > data.prevMonday.valueOf() &&
        due.valueOf() <= data.nextMonday.valueOf()
      );
    });
  } catch (error) {
    console.error(error);
  }
  return data;
};
