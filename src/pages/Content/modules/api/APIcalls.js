import axios from 'axios';

function getPrevMonday() {
  const d = new Date();
  d.setDate(d.getDate() - ((d.getDay() - 1 + 7) % 7));
  d.setHours(23, 59, 59);
  return d;
}

function getNextMonday() {
  const d = new Date();
  d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7));
  d.setHours(23, 59, 59);
  return d;
}

export const getRelevantAssignments = async () => {
  const data = {};
  data.prevMonday = getPrevMonday();
  data.nextMonday = getNextMonday();
  try {
    const colors = (
        await axios.get(`https://${location.hostname}/api/v1/users/self/colors`)
      ).data.custom_colors,
      links = Array.from(
        document.getElementsByClassName('ic-DashboardCard__link')
      );
    data.courses = links.map((link) => {
      const obj = {},
        id = parseInt(link.pathname.split('/').pop());
      obj.id = id;
      obj.color = colors[`course_${id}`];
      return obj;
    });
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
      task.color = colors[`course_${task.course_id}`];
      const due = new Date(task.due_at);
      return (
        due.valueOf() >= data.prevMonday.valueOf() &&
        due.valueOf() <= data.nextMonday.valueOf()
      );
    });
  } catch (error) {
    console.error(error);
  }
  return data;
};
