import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import RadialBarChart, { ChartData } from '../radial-bar-chart';
import BeatLoader from '../spinners';
import { FinalAssignment } from '../../types';
import useChartData from './hooks/useChartData';
import useSelectChartData from './hooks/useBar';
import Confetti from 'react-dom-confetti';
import { OptionsDefaults } from '../../constants';
import useCourseStore from '../../hooks/useCourseStore';

/*
  Renders progress chart
*/
type OpacityProps = {
  opacity: number;
};
const ChartContainer = styled.div.attrs((props: OpacityProps) => ({
  style: {
    opacity: props.opacity,
  },
}))<OpacityProps>`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 15px 0px;

  transition: opacity 0.3s ease-in-out;
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
  courses: string[];
  colorOverride?: string;
  loading?: boolean;
  onCoursePage?: boolean;
  selectedCourseId: string;
  setCourse: (id: string) => void;
  showConfetti?: boolean;
  themeColor?: string;
  weekKey?: string;
}

export default function TaskChart({
  assignments,
  courses,
  colorOverride,
  loading,
  onCoursePage,
  selectedCourseId = '',
  setCourse,
  showConfetti = true,
  themeColor = OptionsDefaults.theme_color,
  weekKey = '',
}: TaskChartProps): JSX.Element {
  const courseStore = useCourseStore();
  /* useMemo so it doesn't animate the bars when switching courses. */
  const [chartData, setChartData] = useState(
    useChartData(
      assignments,
      courses,
      courseStore,
      colorOverride || themeColor,
      weekKey
    )
  );

  const [currKey, setCurrKey] = useState(weekKey);
  function compareData(a: ChartData, b: ChartData) {
    if (a.bars.length !== b.bars.length) return false;
    return a.bars.reduce(
      (prev, curr, i) =>
        prev &&
        b.bars[i].color == curr.color &&
        b.bars[i].id === curr.id &&
        b.bars[i].max === curr.max &&
        b.bars[i].value === curr.value,
      true
    );
  }

  useEffect(() => {
    // if assignments is same but weekkey different just change currkey
    // else update assignments
    // in order for everything to re-animate when weeks change, the key has to change at the same time as the data
    const newData = useChartData(
      assignments,
      courses,
      courseStore,
      colorOverride || themeColor,
      currKey
    );
    const isSame = compareData(newData, chartData);
    if (weekKey !== currKey) setCurrKey(weekKey);
    else if ((!loading && chartData.key !== newData.key) || !isSame)
      setChartData(newData);
  }, [assignments, courses, courseStore, loading, currKey, weekKey]);

  const [done, total, color] = useMemo(
    () => useSelectChartData(selectedCourseId, chartData),
    [selectedCourseId, chartData]
  );

  function handleClick(id: string) {
    if (selectedCourseId === id) setCourse('');
    else setCourse(id);
  }

  const complete = 'Complete';
  const percent = total === 0 ? '100%' : `${Math.floor((100 * done) / total)}%`;
  const progress = `${done}/${total}`;

  const [completion, setCompletion] = useState(false);
  const [confetti, setConfetti] = useState(false);
  useEffect(() => {
    if (selectedCourseId === '' || onCoursePage) {
      if (total > 0 && done === total) {
        const confettiTimer = setTimeout(() => {
          setConfetti(true);
        }, 1000); // confetti once rings finish animating

        const completionTimer = setTimeout(() => {
          setCompletion(true);
        }, 1000);
        return () => {
          clearTimeout(confettiTimer);
          clearTimeout(completionTimer);
        };
      } else {
        setConfetti(false);
        setCompletion(false);
      }
    }
  }, [done, total]);

  useEffect(() => {
    if (completion) {
      const to = setTimeout(() => {
        setCompletion(false);
      }, 300);
      return () => clearTimeout(to);
    }
  }, [completion]);

  return (
    <ChartContainer opacity={completion ? 0.7 : 1}>
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
        // bgColor="rgba(127, 127, 127, 10%)"
        data={chartData}
        onSelect={handleClick}
        selectedBar={colorOverride ? '' : selectedCourseId}
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
