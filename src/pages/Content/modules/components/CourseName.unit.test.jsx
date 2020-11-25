import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import CourseName from './CourseName';

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

const code = 'Dummy Course Code',
  color = 'rgb(255, 0, 0)';

it("defaults text to 'All Courses'", () => {
  act(() => {
    render(<CourseName color={color} courseCode="-1" />, container);
  });
  expect(container.firstChild.textContent).toBe('All Courses');
});

it('defaults color to black', () => {
  act(() => {
    render(<CourseName color={color} courseCode="-1" />, container);
  });
  expect(container.firstChild.style.color).toBe('rgb(0, 0, 0)');
});

it('renders course code', () => {
  act(() => {
    render(<CourseName color={color} courseCode={code} />, container);
  });
  expect(container.firstChild.textContent).toBe(code);
});

it('renders course color', () => {
  act(() => {
    render(<CourseName color={color} courseCode={code} />, container);
  });
  expect(container.firstChild.style.color).toBe(color);
});
