import React, { useState } from 'react';
import styled from 'styled-components';
import RadialBarChart from '.';
import { ChartData } from './types';

const SubtitleText = styled.div`
  font-size: 13px;
  font-family: Lato Extended;
  font-weight: bold;
  line-height: 1.25em;
`;

const TitleText = styled.div`
  font-size: 25px;
  font-family: Lato Extended;
  font-weight: bold;
`;

interface Props {
  size: number;
}

export default function RadialBarChartExample({ size }: Props): JSX.Element {
  const chartData: ChartData = {
    bars: [
      {
        id: 1,
        value: 2,
        color: '#000000',
        max: 10,
      },
      {
        id: 2,
        value: 4,
        color: '#00AAFF',
        max: 10,
      },
      {
        id: 3,
        value: 10,
        color: '#AAFF00',
        max: 10,
      },
      {
        id: 4,
        value: 4,
        color: '#00AAFF',
        max: 10,
      },
      {
        id: 5,
        value: 10,
        color: '#AAFF00',
        max: 10,
      },
      {
        id: 6,
        value: 10,
        color: '#AAFF00',
        max: 10,
      },
      {
        id: 7,
        value: 10,
        color: '#AAFF00',
        max: 10,
      },
      // {
      //   id: 8,
      //   value: 6,
      //   color: '#00AAFF',
      //   max: 10,
      // },
      // {
      //   id: 9,
      //   value: 6,
      //   color: '#AAFF00',
      //   max: 10,
      // },
      // {
      //   id: 10,
      //   value: 6,
      //   color: '#00FFAA',
      //   max: 10,
      // },
      // {
      //   id: 11,
      //   value: 6,
      //   color: '#AA00FF',
      //   max: 10,
      // },
      // {
      //   id: 12,
      //   value: 6,
      //   color: '#FF00AA',
      //   max: 10,
      // },
      // {
      //   id: 13,
      //   value: 6,
      //   color: '#BB5544',
      //   max: 10,
      // },
    ],
  };
  const [selected, setSelected] = useState(-1);
  function onSelect(id: number) {
    console.log(id);
  }
  function onEnter(id: number) {
    console.log(id);
  }
  function onLeave(id: number) {
    console.log(id);
  }

  const titleText = '50%';
  const progressText = '6/12';
  const completeText = 'Complete';
  return (
    <RadialBarChart
      data={chartData}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onSelect={setSelected}
      selectedBar={selected}
      size={size}
    >
      <TitleText>{titleText}</TitleText>
      <SubtitleText>{progressText}</SubtitleText>
      <SubtitleText>{completeText}</SubtitleText>
    </RadialBarChart>
  );
}
