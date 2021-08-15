import React from 'react';
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
      },
      {
        id: 2,
        value: 4,
        color: '#00AAFF',
      },
      {
        id: 3,
        value: 10,
        color: '#AAFF00',
      },
      {
        id: 4,
        value: 4,
        color: '#00AAFF',
      },
      {
        id: 5,
        value: 10,
        color: '#AAFF00',
      },
      {
        id: 6,
        value: 10,
        color: '#AAFF00',
      },
      {
        id: 7,
        value: 10,
        color: '#AAFF00',
      },
      // {
      //   id: 8,
      //   value: 6,
      //   color: '#00AAFF',
      // },
      // {
      //   id: 9,
      //   value: 6,
      //   color: '#AAFF00',
      // },
      // {
      //   id: 10,
      //   value: 6,
      //   color: '#00FFAA',
      // },
      // {
      //   id: 11,
      //   value: 6,
      //   color: '#AA00FF',
      // },
      // {
      //   id: 12,
      //   value: 6,
      //   color: '#FF00AA',
      // },
      // {
      //   id: 13,
      //   value: 6,
      //   color: '#BB5544',
      // },
    ],
    max: 10,
  };
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
      onSelect={onSelect}
      size={size}
    >
      <TitleText>{titleText}</TitleText>
      <SubtitleText>{progressText}</SubtitleText>
      <SubtitleText>{completeText}</SubtitleText>
    </RadialBarChart>
  );
}
