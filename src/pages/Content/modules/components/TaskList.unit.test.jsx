import React from 'react';
import TaskList from './TaskList';
import { shallow } from 'enzyme';
import Task from './Task';

const finishedAssignment = {
  color: 'rgb(0, 0, 0)',
  html_url: 'https://this.is.a.test/',
  name: `Finished Assignment Test`,
  points_possible: 5,
  due_at: new Date().toISOString(),
  course_id: 123456,
  id: 1,
  submission: {
    attempt: 1,
  },
};
const finishedAssignments = [];
const assignmentCount = 6;

for (let i = 1; i <= assignmentCount; i++) {
  finishedAssignments.push({
    color: 'rgb(0, 0, 0)',
    html_url: 'https://this.is.a.test/',
    name: `Finished Assignment Test ${i}`,
    points_possible: 5,
    due_at: new Date().toISOString(),
    course_id: i <= assignmentCount / 2 ? 1 : 2,
    id: 10 + i,
    submission: {
      attempt: 1,
    },
  });
}

const unfinishedAssignment = {
  color: 'rgb(0, 0, 0)',
  html_url: 'https://this.is.a.test/',
  name: `Unfinished Assignment Test`,
  points_possible: 5,
  due_at: new Date().toISOString(),
  course_id: 123456,
  id: 2,
  submission: {
    attempt: null,
  },
};

const unfinishedAssignments = [];

for (let i = 1; i <= assignmentCount; i++) {
  unfinishedAssignments.push({
    color: 'rgb(0, 0, 0)',
    html_url: 'https://this.is.a.test/',
    name: `Unfinished Assignment Test ${i}`,
    points_possible: 5,
    due_at: new Date().toISOString(),
    course_id: i <= assignmentCount / 2 ? 1 : 2,
    id: 20 + i,
    submission: {
      attempt: null,
    },
  });
}

const visibleAssignmentCount = 4;

describe('<TaskList />', () => {
  it("renders 'None' when there are no assignments regardless of current course", () => {
    let wrapper = shallow(<TaskList assignments={[]} />);
    expect(wrapper.find(Task).length).toBe(0);
    wrapper = shallow(<TaskList assignments={[]} course_id={-1} />);
    expect(wrapper.find(Task).length).toBe(0);
    wrapper = shallow(<TaskList assignments={[]} course_id={123456} />);
    expect(wrapper.find(Task).length).toBe(0);
  });

  it("renders 'None' when all assignments are finished regardless of current course", () => {
    let wrapper = shallow(<TaskList assignments={[finishedAssignment]} />);
    expect(wrapper.find(Task).length).toBe(0);
    wrapper = shallow(
      <TaskList assignments={finishedAssignments} course_id={-1} />
    );
    expect(wrapper.find(Task).length).toBe(0);
    wrapper = shallow(
      <TaskList assignments={finishedAssignments} course_id={123456} />
    );
    expect(wrapper.find(Task).length).toBe(0);
  });

  it('renders all assignments for all courses if all unfinished', () => {
    let wrapper = shallow(<TaskList assignments={[unfinishedAssignment]} />);
    expect(wrapper.find(Task).length).toBe(1);
    wrapper = shallow(
      <TaskList assignments={unfinishedAssignments} course_id={-1} />
    );
    expect(wrapper.find(Task).length).toBe(
      Math.min(visibleAssignmentCount, assignmentCount)
    );
    const e = { preventDefault: () => {} };
    if (assignmentCount > visibleAssignmentCount) {
      wrapper.find('a').props().onClick(e);
    }
    expect(wrapper.find(Task).length).toBe(assignmentCount);
  });

  it('renders only unfinished assignments for all courses if some finished and some unfinished', () => {
    let wrapper = shallow(
      <TaskList assignments={[unfinishedAssignment, finishedAssignment]} />
    );
    expect(wrapper.find(Task).length).toBe(1);
    wrapper = shallow(
      <TaskList
        assignments={unfinishedAssignments.concat(finishedAssignments)}
        course_id={-1}
      />
    );
    expect(wrapper.find(Task).length).toBe(
      Math.min(visibleAssignmentCount, assignmentCount)
    );
    const e = { preventDefault: () => {} };
    if (assignmentCount > visibleAssignmentCount) {
      wrapper.find('a').props().onClick(e);
    }
    expect(wrapper.find(Task).length).toBe(assignmentCount);
  });

  it('renders all assignments for a selected course if all unfinished', () => {
    let wrapper = shallow(
      <TaskList assignments={[unfinishedAssignment]} course_id={123456} />
    );
    expect(wrapper.find(Task).length).toBe(1);
    wrapper = shallow(
      <TaskList assignments={unfinishedAssignments} course_id={0} />
    );
    expect(wrapper.find(Task).length).toBe(0);
    wrapper = shallow(
      <TaskList assignments={unfinishedAssignments} course_id={1} />
    );
    expect(wrapper.find(Task).length).toBe(
      Math.min(visibleAssignmentCount, assignmentCount / 2)
    );
    const e = { preventDefault: () => {} };
    if (assignmentCount / 2 > visibleAssignmentCount) {
      wrapper.find('a').props().onClick(e);
    }
    expect(wrapper.find(Task).length).toBe(assignmentCount / 2);
    wrapper = shallow(
      <TaskList assignments={unfinishedAssignments} course_id={2} />
    );
    expect(wrapper.find(Task).length).toBe(
      Math.min(visibleAssignmentCount, assignmentCount / 2)
    );
    if (assignmentCount / 2 > visibleAssignmentCount) {
      wrapper.find('a').props().onClick(e);
    }
    expect(wrapper.find(Task).length).toBe(assignmentCount / 2);

    wrapper = shallow(
      <TaskList assignments={unfinishedAssignments} course_id={3} />
    );
    expect(wrapper.find(Task).length).toBe(0);
  });

  it("renders 'None' when there are unfinished assignments but none for the selected course", () => {
    let wrapper = shallow(
      <TaskList assignments={[unfinishedAssignment]} course_id={0} />
    );
    expect(wrapper.find(Task).length).toBe(0);
    wrapper = shallow(
      <TaskList assignments={unfinishedAssignments} course_id={3} />
    );
    expect(wrapper.find(Task).length).toBe(0);
    wrapper = shallow(
      <TaskList assignments={unfinishedAssignments} course_id={0} />
    );
    expect(wrapper.find(Task).length).toBe(0);
  });

  it('renders only unfinished assignments for a selected course if some finished and some unfinished', () => {
    let wrapper = shallow(
      <TaskList
        assignments={[unfinishedAssignment, finishedAssignment]}
        course_id={123456}
      />
    );
    expect(wrapper.find(Task).length).toBe(1);
    wrapper = shallow(
      <TaskList
        assignments={unfinishedAssignments.concat(finishedAssignments)}
        course_id={0}
      />
    );
    expect(wrapper.find(Task).length).toBe(0);
    wrapper = shallow(
      <TaskList
        assignments={unfinishedAssignments.concat(finishedAssignments)}
        course_id={1}
      />
    );
    expect(wrapper.find(Task).length).toBe(
      Math.min(visibleAssignmentCount, assignmentCount / 2)
    );
    if (assignmentCount / 2 > visibleAssignmentCount) {
      wrapper.find('a').props().onClick();
    }
    expect(wrapper.find(Task).length).toBe(assignmentCount / 2);

    wrapper = shallow(
      <TaskList
        assignments={unfinishedAssignments.concat(finishedAssignments)}
        course_id={2}
      />
    );
    expect(wrapper.find(Task).length).toBe(
      Math.min(visibleAssignmentCount, assignmentCount / 2)
    );
    if (assignmentCount / 2 > visibleAssignmentCount) {
      wrapper.find('a').props().onClick();
    }
    expect(wrapper.find(Task).length).toBe(assignmentCount / 2);

    wrapper = shallow(
      <TaskList
        assignments={unfinishedAssignments.concat(finishedAssignments)}
        course_id={3}
      />
    );
    expect(wrapper.find(Task).length).toBe(0);
  });
});
