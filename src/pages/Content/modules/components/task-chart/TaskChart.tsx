import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import RadialBarChart from '../radial-bar-chart';
import BeatLoader from '../spinners';
import { FinalAssignment } from '../../types';
import useChartData from './hooks/useChartData';
import useSelectChartData from './hooks/useBar';
import Confetti from 'react-dom-confetti';
import useOptions from '../../hooks/useOptions';
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
}

export default function TaskChart({
  assignments,
  colorOverride,
  loading,
  onCoursePage,
  selectedCourseId = -1,
  setCourse,
}: TaskChartProps): JSX.Element {
  /* useMemo so it doesn't animate the bars when switching courses. */
  const { data: options } = useOptions();
  const themeColor = options?.theme_color || OptionsDefaults.theme_color;

  const chartData = useMemo(
    () => useChartData(assignments, colorOverride || themeColor),
    [assignments]
  );
  const [done, total, color] = useSelectChartData(selectedCourseId, chartData);

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
      {options && options.show_confetti ? (
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
