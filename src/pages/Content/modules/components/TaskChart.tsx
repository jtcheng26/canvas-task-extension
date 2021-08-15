import React, { useState } from 'react';
import styled from 'styled-components';
import '../../content.styles.css';
import { Assignment } from '../types';
import useCoursePositions from '../hooks/useCoursePositions';
import useCourseColors from '../hooks/useCourseColors';
import { ChartData } from './radial-bar-chart/types';
import AssignmentMap from '../types/assignmentMap';
import RadialBarChart from './radial-bar-chart';
import { useEffect } from 'react';
import { useMemo } from 'react';

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
  color: ${(p) => p.color};
`;

interface TaskChartProps {
  assignments: AssignmentMap;
  selectedCourseId: number;
  setCourse: (id: number) => void;
}

export default function TaskChart({
  assignments,
  selectedCourseId = -1,
  setCourse,
}: TaskChartProps): JSX.Element {
  const { data: positions } = useCoursePositions();
  const { data: colors } = useCourseColors();

  const initialData: ChartData = { bars: [] };
  const [chartData, setChartData] = useState(initialData);

  function ringProgress(assignment: Assignment): 1 | 0 {
    if (!assignment.points_possible) return 0;
    return assignment.user_submitted || assignment.grade > 0 ? 1 : 0;
  }

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
            value: assignments[course_id].reduce(
              (a, b) => a + ringProgress(b),
              0
            ),
            max: assignments[course_id].reduce(
              (a, b) => a + (b.points_possible === 0 ? 0 : 1),
              0
            ),
            color: colors[course_id],
          };
        }),
      };

      if (data.bars.length === 0)
        data.bars.push({
          id: -1,
          value: 10,
          max: 10,
          color: 'var(--ic-brand-font-color-dark)',
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
        return (
          a +
          assignments[b].reduce((c, d) => {
            return c + ringProgress(d);
          }, 0)
        );
      }, 0);
    }
    return assignments[selectedCourseId].reduce((a, b) => {
      return a + ringProgress(b);
    }, 0);
  }, [selectedCourseId, assignments]);

  const total = useMemo(() => {
    if (selectedCourseId === -1)
      return Object.keys(assignments).reduce((a, b) => {
        return (
          a +
          assignments[b].reduce(
            (a, b) => a + (b.points_possible === 0 ? 0 : 1),
            0
          )
        );
      }, 0);

    return assignments[selectedCourseId].reduce(
      (a, b) => a + (b.points_possible === 0 ? 0 : 1),
      0
    );
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
        size={210}
      >
        <TitleText color={color}>{percent}</TitleText>
        <SubtitleText color={color}>{progress}</SubtitleText>
        <SubtitleText color={color}>{complete}</SubtitleText>
      </RadialBarChart>
    </ChartContainer>
  );
}
