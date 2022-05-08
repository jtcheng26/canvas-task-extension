import React, { useMemo } from 'react';
import styled from 'styled-components';
import RadialBarChart from '../radial-bar-chart';
import BeatLoader from '../spinners';
import { FinalAssignment } from '../../types';
import useChartData from './hooks/useChartData';
import useSelectChartData from './hooks/useBar';

/*
  Renders progress chart
*/

const ChartContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 15px 0px;
`;

const SubtitleText = styled.div`
  font-size: 13px;
  font-weight: bold;
  line-height: 1.25em;
  color: ${(p) => p.color};
`;

const TitleText = styled.div`
  font-size: 25px;
  font-weight: bold;
  line-height: 1.25em;
  color: ${(p) => p.color};
`;

export interface TaskChartProps {
  assignments: FinalAssignment[];
  loading?: boolean;
  selectedCourseId: number;
  setCourse: (id: number) => void;
}

export default function TaskChart({
  assignments,
  loading,
  selectedCourseId = -1,
  setCourse,
}: TaskChartProps): JSX.Element {
  /* useMemo so it doesn't animate the bars when switching courses. */
  const chartData = useMemo(() => useChartData(assignments), [assignments]);
  const [done, total, color] = useSelectChartData(selectedCourseId, chartData);

  function handleClick(id: number) {
    if (selectedCourseId === id) setCourse(-1);
    else setCourse(id);
  }

  const complete = 'Complete';
  const percent = total === 0 ? '100%' : `${Math.floor((100 * done) / total)}%`;
  const progress = `${done}/${total}`;

  return (
    <ChartContainer>
      <RadialBarChart
        bgColor="rgba(127, 127, 127, 10%)"
        data={chartData}
        onSelect={handleClick}
        selectedBar={selectedCourseId}
        size={chartData.bars.length < 7 ? 210 : 280}
      >
        {loading ? (
          <BeatLoader
            color="var(--ic-brand-font-color-dark-lightened-30)"
            loading
            size={10}
          />
        ) : (
          <>
            <TitleText color={color}>{percent}</TitleText>
            <SubtitleText color={color}>{progress}</SubtitleText>
            <SubtitleText color={color}>{complete}</SubtitleText>
          </>
        )}
      </RadialBarChart>
    </ChartContainer>
  );
}
