import React from 'react';
import TaskList from './TaskList';
import { shallow } from 'enzyme';
import Task from './Task';
import {
  finishedAssignments,
  unfinishedAssignments,
  unsubmittedButGradedAssignment,
  unfinishedAssignment,
  finishedAssignment,
} from '../test/assignment';

const assignmentCount = unfinishedAssignments.length;
const visibleAssignmentCount = 4; // max visible assignments before extending
const e = { preventDefault: () => {} }; // event mock

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
      wrapper.find('a').props().onClick(e);
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
      wrapper.find('a').props().onClick(e);
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
  it('does not render assignments if unsubmitted but graded already', () => {
    let wrapper = shallow(
      <TaskList
        assignments={[
          unfinishedAssignment,
          finishedAssignment,
          unsubmittedButGradedAssignment,
        ]}
      />
    );
    expect(wrapper.find(Task).length).toBe(1);
    wrapper = shallow(
      <TaskList
        assignments={unfinishedAssignments
          .concat(finishedAssignments)
          .concat([unsubmittedButGradedAssignment])}
        course_id={-1}
      />
    );
    expect(wrapper.find(Task).length).toBe(
      Math.min(visibleAssignmentCount, assignmentCount)
    );
    if (assignmentCount > visibleAssignmentCount) {
      wrapper.find('a').props().onClick(e);
    }
    expect(wrapper.find(Task).length).toBe(assignmentCount);
  });
});
