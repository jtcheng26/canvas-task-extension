import axios from 'axios';

function getPrevMonday() {
  const d = new Date();
  d.setDate(d.getDate() - ((d.getDay() - 1 + 7) % 7));
  d.setHours(0, 0, 0);
  return d;
}

function getNextMonday() {
  const d = new Date();
  if (d.getDay() != 1) {
    d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7));
  } else {
    d.setDate(d.getDate() + 7);
  }
  d.setHours(0, 0, 0);
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
    const courseNames = {};
    if (userData.links.length > 0) {
      // if on dashboard and not course page
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
      courseNames[id] = name;
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
    const prevMondayLocal = new Date(
      data.prevMonday.getTime() -
        data.prevMonday.getTimezoneOffset() * 60 * 1000
    );
    const nextMondayLocal = new Date(
      data.nextMonday.getTime() -
        data.nextMonday.getTimezoneOffset() * 60 * 1000
    );
    const prevMondayStr = prevMondayLocal.toISOString().split('T')[0];
    const nextMondayStr = nextMondayLocal.toISOString().split('T')[0];
    const assignments = await axios.get(
      `https://${location.hostname}/api/v1/calendar_events?type=assignment&start_date=${prevMondayStr}&end_date=${nextMondayStr}${courseList}&per_page=100&include=submission`
    );
    data.assignments = assignments.data.map((task) => {
      task.assignment.color =
        userData.colors[`course_${task.assignment.course_id}`];
      task.assignment.grade =
        task.assignment.submission.score === null
          ? 0
          : task.assignment.submission.score;
      task.assignment.course_code =
        courseNames[parseInt(task.assignment.course_id)];
      return task.assignment;
    });
    /*
      filters by due date times, might be different for different districts
      In my school system, classes end around 3:00pm, so I put all assignments due before that time on Monday the previous week's work
      Similarly, I made assignments due after 3:00pm on Monday are this week's work.
      Thinking about making these options customizable in the future.
    */
    data.assignments = data.assignments.filter((task) => {
      const due_date = new Date(task.due_at);
      if (due_date.getDate() == data.prevMonday.getDate())
        return due_date.getHours() >= 15;
      else if (due_date.getDate() == data.nextMonday.getDate())
        return due_date.getHours() < 15;
      return true;
    });
  } catch (error) {
    console.error(error);
  }
  return data;
};
