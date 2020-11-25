import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import Task from './Task';

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

const color = 'rgb(0, 0, 0)',
  html_url = 'https://this.is.a.test/',
  name = 'Dummy Assignment',
  points_possible = 10;
let due_at = new Date();
due_at.setMonth(1);
due_at.setDate(1);
due_at.setFullYear(1990);
due_at.setHours(10, 10, 10, 10);
due_at = due_at.toISOString();
const mockData = {
  color,
  html_url,
  name,
  points_possible,
  due_at,
};

it('renders color', () => {
  act(() => {
    render(<Task assignment={mockData} />, container);
  });
  expect(container.firstChild.firstChild.style.backgroundColor).toBe(color);
});

it('renders name', () => {
  act(() => {
    render(<Task assignment={mockData} />, container);
  });
  expect(container.firstChild.firstChild.textContent).toBe(name);
});

it('renders points and due date', () => {
  act(() => {
    render(<Task assignment={mockData} />, container);
  });
  expect(container.firstChild.lastChild.textContent).toBe(
    points_possible + ' points \xa0|\xa0 ' + 'Feb 1 at 10:10 AM'
  );
});

it('sets link', () => {
  act(() => {
    render(<Task assignment={mockData} />, container);
  });
  expect(container.firstChild.firstChild.firstChild.href).toBe(html_url);
});
