import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import RadialBarChart, { ChartData } from '../radial-bar-chart';
import BeatLoader from '../spinners';
import { FinalAssignment } from '../../types';
import useChartData from './hooks/useChartData';
import useSelectChartData from './hooks/useBar';
import Confetti from 'react-dom-confetti';
import { OptionsDefaults } from '../../constants';

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

const ConfettiWrapper = styled.div`
  position: absolute;
  top: 250px;
`;

export interface TaskChartProps {
  assignments: FinalAssignment[];
  colorOverride?: string;
  loading?: boolean;
  onCoursePage?: boolean;
  selectedCourseId: number;
  setCourse: (id: number) => void;
  showConfetti?: boolean;
  themeColor?: string;
  weekKey?: string;
}

export default function TaskChart({
  assignments,
  colorOverride,
  loading,
  onCoursePage,
  selectedCourseId = -1,
  setCourse,
  showConfetti = true,
  themeColor = OptionsDefaults.theme_color,
  weekKey = '',
}: TaskChartProps): JSX.Element {
  /* useMemo so it doesn't animate the bars when switching courses. */

  const [chartData, setChartData] = useState(
    useChartData(assignments, colorOverride || themeColor)
  );

  const [currKey, setCurrKey] = useState(weekKey);
  function compareData(a: ChartData, b: ChartData) {
    if (a.bars.length !== b.bars.length) return false;
    return a.bars.reduce(
      (prev, curr, i) =>
        prev &&
        b.bars[i].id === curr.id &&
        b.bars[i].max === curr.max &&
        b.bars[i].value === curr.value,
      true
    );
  }

  function isEmpty(a: ChartData) {
    return a.bars.length === 0 || (a.bars.length === 1 && a.bars[0].max === 0);
  }

  useEffect(() => {
    // if assignments is same but weekkey different just change currkey
    // else update assignments
    // in order for everything to re-animate when weeks change, the key has to change at the same time as the data
    const newData = useChartData(
      assignments,
      colorOverride || themeColor,
      currKey
    );
    if (weekKey !== currKey) setCurrKey(weekKey);
    else if (
      (!loading &&
        isEmpty(chartData) &&
        isEmpty(newData) &&
        chartData.key !== newData.key) ||
      !compareData(newData, chartData)
    ) {
      setChartData(newData);
    }
  }, [assignments, loading, currKey, weekKey]);

  const [done, total, color] = useMemo(
    () => useSelectChartData(selectedCourseId, chartData),
    [selectedCourseId, chartData]
  );

  function handleClick(id: number) {
    if (selectedCourseId === id) setCourse(-1);
    else setCourse(id);
  }

  const complete = 'Complete';
  const percent = total === 0 ? '100%' : `${Math.floor((100 * done) / total)}%`;
  const progress = `${done}/${total}`;

  const [confetti, setConfetti] = useState(false);
  useEffect(() => {
    if (selectedCourseId === -1 || onCoursePage) {
      if (total > 0 && done === total) {
        const confettiTimer = setTimeout(() => {
          setConfetti(true);
        }, 1000); // confetti once rings finish animating

        return () => clearTimeout(confettiTimer);
      } else setConfetti(false);
    }
  }, [done, total]);

  return (
    <ChartContainer>
      {showConfetti ? (
        <ConfettiWrapper>
          <Confetti
            active={confetti}
            config={{
              elementCount: Math.min(200, 10 * done),
              startVelocity: 30,
            }}
          />
        </ConfettiWrapper>
      ) : (
        ''
      )}
      <RadialBarChart
        bgColor="rgba(127, 127, 127, 10%)"
        data={chartData}
        onSelect={handleClick}
        selectedBar={colorOverride ? -1 : selectedCourseId}
        size={chartData.bars.length < 7 ? 210 : 280}
      >
        {loading ? (
          <BeatLoader color="#4c5860dd" loading size={10} />
        ) : (
          <>
            <TitleText color={colorOverride || color}>{percent}</TitleText>
            <SubtitleText color={colorOverride || color}>
              {progress}
            </SubtitleText>
            <SubtitleText color={colorOverride || color}>
              {complete}
            </SubtitleText>
          </>
        )}
      </RadialBarChart>
    </ChartContainer>
  );
}
