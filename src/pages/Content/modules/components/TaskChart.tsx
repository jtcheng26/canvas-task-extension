import React, { useState } from 'react';
import styled from 'styled-components';
import '../../content.styles.css';
import useCoursePositions from '../hooks/useCoursePositions';
import useCourseColors from '../hooks/useCourseColors';
import { ChartData } from './radial-bar-chart/types';
import AssignmentMap from '../types/assignmentMap';
import RadialBarChart from './radial-bar-chart';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { BeatLoader } from 'react-spinners';
import numDone from '../utils/numDone';
import numTotal from '../utils/numTotal';

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
  font-family: Lato Extended;
  font-weight: bold;
  line-height: 1.25em;
  color: ${(p) => p.color};
`;

const TitleText = styled.div`
  font-size: 25px;
  font-family: Lato Extended;
  font-weight: bold;
  line-height: 1.25em;
  color: ${(p) => p.color};
`;

interface TaskChartProps {
  assignments: AssignmentMap;
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
  const { data: positions } = useCoursePositions();
  const { data: colors } = useCourseColors();

  const initialData: ChartData = { bars: [] };
  const [chartData, setChartData] = useState(initialData);

  useEffect(() => {
    if (positions && colors) {
      const sortedCourses = Object.keys(assignments).sort((a, b) => {
        return (
          (positions[a] ? positions[a] : 0) - (positions[b] ? positions[b] : 0)
        );
      });

      const data: ChartData = {
        bars: sortedCourses.map((course_id) => {
          return {
            id: parseInt(course_id),
            value: numDone(assignments[course_id]),
            max: numTotal(assignments[course_id]),
            color: colors[course_id],
          };
        }),
      };

      if (data.bars.length === 0)
        data.bars.push({
          id: -1,
          value: 10,
          max: 10,
          color: 'var(--ic-brand-global-nav-bgd)',
        });
      setChartData(data);
    }
  }, [positions, colors, assignments]);

  function handleClick(id: number) {
    if (selectedCourseId === id) setCourse(-1);
    else setCourse(id);
  }

  const complete = 'Complete';

  const done = useMemo(() => {
    if (selectedCourseId === -1) {
      return Object.keys(assignments).reduce((a, b) => {
        return a + numDone(assignments[b]);
      }, 0);
    }
    return numDone(assignments[selectedCourseId]);
  }, [selectedCourseId, assignments]);

  const total = useMemo(() => {
    if (selectedCourseId === -1)
      return Object.keys(assignments).reduce((a, b) => {
        return a + numTotal(assignments[b]);
      }, 0);

    return numTotal(assignments[selectedCourseId]);
  }, [assignments, selectedCourseId]);

  const percent = useMemo(() => {
    return total === 0 ? '100%' : `${Math.floor((100 * done) / total)}%`;
  }, [done, total]);

  const progress = useMemo(() => {
    return `${done}/${total}`;
  }, [done, total]);

  const color = useMemo(() => {
    if (colors) {
      return selectedCourseId === -1
        ? 'var(--ic-brand-font-color-dark)'
        : colors[selectedCourseId];
    }
    return 'var(--ic-brand-font-color-dark)';
  }, [selectedCourseId, colors]);
  return (
    <ChartContainer>
      <RadialBarChart
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
