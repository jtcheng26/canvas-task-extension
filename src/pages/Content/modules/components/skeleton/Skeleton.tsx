import React from 'react';
import styled from 'styled-components';
import { DarkContext } from '../../contexts/darkContext';
import { DarkProps } from '../../types/props';
import BeatLoader from '../spinners';
import TaskList from '../task-list';

const LoadingDiv = styled.div`
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SkeletonChart = styled.div<DarkProps>`
  width: 110px;
  height: 110px;
  border: 40px solid ${(props) => (props.dark ? '#3f3f46' : '#e8e8e8')};
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ClipLoadingDiv = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 220px;
`;

export default function Skeleton({ dark }: DarkProps): JSX.Element {
  const elem = (
    <LoadingDiv>
      <ClipLoadingDiv>
        <SkeletonChart dark={dark}>
          <BeatLoader color={dark ? '#3f3f46' : '#e8e8e8'} />
        </SkeletonChart>
      </ClipLoadingDiv>
      <TaskList
        assignments={[]}
        selectedCourseId=""
        showDateHeadings={false}
        skeleton
        weekKey="skeleton"
      />
    </LoadingDiv>
  );
  if (dark)
    // testing purposes
    return <DarkContext.Provider value={dark}>{elem}</DarkContext.Provider>;
  else return elem;
}
