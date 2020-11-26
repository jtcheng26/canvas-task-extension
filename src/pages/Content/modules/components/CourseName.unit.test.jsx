import React from 'react';
import { shallow } from 'enzyme';
import CourseName from './CourseName';

const code = 'Dummy Course Code',
  color = 'rgb(255, 0, 0)';

describe('<CourseName />', () => {
  it("defaults text to 'All Courses'", () => {
    let wrapper = shallow(<CourseName color={color} courseCode="-1" />);
    expect(wrapper.text()).toBe('All Courses');
  });

  it('defaults color to black', () => {
    let wrapper = shallow(<CourseName color={color} courseCode="-1" />);
    expect(wrapper.prop('style')).toHaveProperty('color', '#000');
  });

  it('renders course code', () => {
    let wrapper = shallow(<CourseName color={color} courseCode={code} />);
    expect(wrapper.text()).toBe(code);
  });

  it('renders course color', () => {
    let wrapper = shallow(<CourseName color={color} courseCode={code} />);
    expect(wrapper.prop('style')).toHaveProperty('color', color);
  });
});
