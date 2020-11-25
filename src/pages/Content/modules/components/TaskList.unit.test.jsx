import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import TaskList from './TaskList';

jest.mock('./Task');

jest.mock('./Subtitle');

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

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

it("renders 'None' when there are no assignments regardless of current course", () => {
  act(() => {
    render(<TaskList assignments={[]} />, container);
  });
  expect(container.firstChild.lastChild.textContent).toBe('None');
  act(() => {
    render(<TaskList assignments={[]} courses={-1} />, container);
  });
  expect(container.firstChild.lastChild.textContent).toBe('None');
  act(() => {
    render(<TaskList assignments={[]} courses={123456} />, container);
  });
  expect(container.firstChild.lastChild.textContent).toBe('None');
});

it("renders 'None' when there all assignments are finished regardless of current course", () => {
  act(() => {
    render(<TaskList assignments={[finishedAssignment]} />, container);
  });
  expect(container.firstChild.lastChild.textContent).toBe('None');
  act(() => {
    render(
      <TaskList assignments={finishedAssignments} courses={-1} />,
      container
    );
  });
  expect(container.firstChild.lastChild.textContent).toBe('None');
  act(() => {
    render(
      <TaskList assignments={finishedAssignments} courses={123456} />,
      container
    );
  });
  expect(container.firstChild.lastChild.textContent).toBe('None');
});

it('renders all assignments for all courses if all unfinished', () => {
  act(() => {
    render(<TaskList assignments={[unfinishedAssignment]} />, container);
  });
  expect(container.firstChild.lastChild.textContent).toBe(
    'Unfinished Assignment Test'
  );
  act(() => {
    render(
      <TaskList assignments={unfinishedAssignments} courses={-1} />,
      container
    );
  });
  for (let i = 1; i <= assignmentCount; i++) {
    expect(container.firstChild.lastChild.children[i - 1].textContent).toBe(
      `Unfinished Assignment Test ${i}`
    );
  }
  act(() => {
    render(
      <TaskList assignments={unfinishedAssignments} courses={123456} />,
      container
    );
  });
  for (let i = 1; i <= assignmentCount; i++) {
    expect(container.firstChild.lastChild.children[i - 1].textContent).toBe(
      `Unfinished Assignment Test ${i}`
    );
  }
});

it('renders only unfinished assignments for all courses if some finished and some unfinished', () => {
  act(() => {
    render(
      <TaskList assignments={[unfinishedAssignment, finishedAssignment]} />,
      container
    );
  });
  expect(container.firstChild.lastChild.children.length).toBe(1);
  expect(container.firstChild.lastChild.textContent).toBe(
    'Unfinished Assignment Test'
  );
  act(() => {
    render(
      <TaskList
        assignments={unfinishedAssignments.concat(finishedAssignments)}
        courses={-1}
      />,
      container
    );
  });
  expect(container.firstChild.lastChild.children.length).toBe(assignmentCount);
  for (let i = 1; i <= assignmentCount; i++) {
    expect(container.firstChild.lastChild.children[i - 1].textContent).toBe(
      `Unfinished Assignment Test ${i}`
    );
  }
  act(() => {
    render(
      <TaskList
        assignments={finishedAssignments.concat(unfinishedAssignments)}
        courses={123456}
      />,
      container
    );
  });
  expect(container.firstChild.lastChild.children.length).toBe(assignmentCount);
  for (let i = 1; i <= assignmentCount; i++) {
    expect(container.firstChild.lastChild.children[i - 1].textContent).toBe(
      `Unfinished Assignment Test ${i}`
    );
  }
});

it('renders all assignments for a selected course if all unfinished', () => {
  act(() => {
    render(
      <TaskList assignments={[unfinishedAssignment]} course={123456} />,
      container
    );
  });
  expect(container.firstChild.lastChild.textContent).toBe(
    'Unfinished Assignment Test'
  );
  act(() => {
    render(
      <TaskList assignments={[unfinishedAssignment]} course_id={0} />,
      container
    );
  });
  expect(container.firstChild.lastChild.children.length).toBe(0);
  act(() => {
    render(
      <TaskList assignments={unfinishedAssignments} course_id={1} />,
      container
    );
  });
  for (let i = 1; i <= assignmentCount / 2; i++) {
    expect(container.firstChild.lastChild.children[i - 1].textContent).toBe(
      `Unfinished Assignment Test ${i}`
    );
  }
  act(() => {
    render(
      <TaskList assignments={unfinishedAssignments} course_id={2} />,
      container
    );
  });
  for (let i = 1; i <= assignmentCount / 2; i++) {
    expect(container.firstChild.lastChild.children[i - 1].textContent).toBe(
      `Unfinished Assignment Test ${assignmentCount / 2 + i}`
    );
  }
  act(() => {
    render(
      <TaskList assignments={unfinishedAssignments} course_id={3} />,
      container
    );
  });
  expect(container.firstChild.lastChild.children.length).toBe(0);
});

it("renders 'None' when there are unfinished assignments but none for the selected course", () => {
  act(() => {
    render(
      <TaskList assignments={[unfinishedAssignment]} course_id={3} />,
      container
    );
  });
  expect(container.firstChild.lastChild.textContent).toBe('None');
  act(() => {
    render(
      <TaskList assignments={unfinishedAssignments} course_id={0} />,
      container
    );
  });
  expect(container.firstChild.lastChild.textContent).toBe('None');
  act(() => {
    render(
      <TaskList assignments={unfinishedAssignments} course_id={3} />,
      container
    );
  });
  expect(container.firstChild.lastChild.textContent).toBe('None');
});

it('renders only unfinished assignments for a selected course if some finished and some unfinished', () => {
  act(() => {
    render(
      <TaskList
        assignments={[unfinishedAssignment, finishedAssignment]}
        course={123456}
      />,
      container
    );
  });
  expect(container.firstChild.lastChild.children.length).toBe(1);
  expect(container.firstChild.lastChild.textContent).toBe(
    'Unfinished Assignment Test'
  );
  act(() => {
    render(
      <TaskList
        assignments={unfinishedAssignments.concat(finishedAssignments)}
        course_id={1}
      />,
      container
    );
  });
  expect(container.firstChild.lastChild.children.length).toBe(
    assignmentCount / 2
  );
  for (let i = 1; i <= assignmentCount / 2; i++) {
    expect(container.firstChild.lastChild.children[i - 1].textContent).toBe(
      `Unfinished Assignment Test ${i}`
    );
  }
  act(() => {
    render(
      <TaskList
        assignments={finishedAssignments.concat(unfinishedAssignments)}
        course_id={2}
      />,
      container
    );
  });
  expect(container.firstChild.lastChild.children.length).toBe(
    assignmentCount / 2
  );
  for (let i = 1; i <= assignmentCount / 2; i++) {
    expect(container.firstChild.lastChild.children[i - 1].textContent).toBe(
      `Unfinished Assignment Test ${assignmentCount / 2 + i}`
    );
  }
});
