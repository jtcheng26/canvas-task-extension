/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import RadialBarChart from '../RadialBarChart';
import { TitleText } from '../example';
import type { ChartData } from '../types';

export default {
  title: 'Components/RadialBarChart',
  component: RadialBarChart,
} as ComponentMeta<typeof RadialBarChart>;

interface storyProps {
  data: ChartData;
}

// No Canvas fonts/styling, will look a bit different
const Template: ComponentStory<typeof RadialBarChart> = ({
  data,
}: storyProps) => {
  function onEnter(id: string) {
    console.log(id);
  }
  function onLeave(id: string) {
    console.log(id);
  }
  const titleText = '69%';
  return (
    <RadialBarChart
      data={data}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      selectedBar=""
      size={300}
    >
      <TitleText>{titleText}</TitleText>
    </RadialBarChart>
  );
};

const sampleBars = [
  {
    id: '1',
    value: 2,
    color: '#000000',
    max: 10,
  },
  {
    id: '2',
    value: 4,
    color: '#00AAFF',
    max: 10,
  },
  {
    id: '3',
    value: 10,
    color: '#AAFF00',
    max: 10,
  },
  {
    id: '4',
    value: 4,
    color: '#00AAFF',
    max: 10,
  },
  {
    id: '5',
    value: 7,
    color: '#AAFF00',
    max: 10,
  },
  {
    id: '6',
    value: 8,
    color: '#AAFF00',
    max: 10,
  },
  {
    id: '7',
    value: 3,
    color: '#AAFF00',
    max: 10,
  },
  {
    id: '8',
    value: 6,
    color: '#00AAFF',
    max: 10,
  },
  {
    id: '9',
    value: 6,
    color: '#AAFF00',
    max: 10,
  },
  {
    id: '10',
    value: 6,
    color: '#00FFAA',
    max: 10,
  },
  {
    id: '11',
    value: 6,
    color: '#AA00FF',
    max: 10,
  },
  {
    id: '12',
    value: 6,
    color: '#FF00AA',
    max: 10,
  },
  {
    id: '13',
    value: 6,
    color: '#BB5544',
    max: 10,
  },
];

export const Rings1 = Template.bind({});
Rings1.args = {
  data: {
    bars: sampleBars.slice(0, 1),
  },
};

export const Rings2 = Template.bind({});
Rings2.args = {
  data: {
    bars: sampleBars.slice(0, 2),
  },
};

export const Rings3 = Template.bind({});
Rings3.args = {
  data: {
    bars: sampleBars.slice(0, 3),
  },
};

export const Rings4 = Template.bind({});
Rings4.args = {
  data: {
    bars: sampleBars.slice(0, 4),
  },
};

export const Rings5 = Template.bind({});
Rings5.args = {
  data: {
    bars: sampleBars.slice(0, 5),
  },
};

export const Rings6 = Template.bind({});
Rings6.args = {
  data: {
    bars: sampleBars.slice(0, 6),
  },
};

export const Rings7 = Template.bind({});
Rings7.args = {
  data: {
    bars: sampleBars.slice(0, 7),
  },
};

export const Rings8 = Template.bind({});
Rings8.args = {
  data: {
    bars: sampleBars.slice(0, 8),
  },
};

export const Rings9 = Template.bind({});
Rings9.args = {
  data: {
    bars: sampleBars.slice(0, 9),
  },
};

export const Rings10 = Template.bind({});
Rings10.args = {
  data: {
    bars: sampleBars.slice(0, 10),
  },
};

export const Rings11 = Template.bind({});
Rings11.args = {
  data: {
    bars: sampleBars.slice(0, 11),
  },
};

export const Rings12 = Template.bind({});
Rings12.args = {
  data: {
    bars: sampleBars.slice(0, 12),
  },
};

export const Rings13 = Template.bind({});
Rings13.args = {
  data: {
    bars: sampleBars.slice(0, 13),
  },
};
