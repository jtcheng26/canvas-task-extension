import React from 'react';
import styled from 'styled-components';
import BeatLoader from '../spinners';
import TaskList from '../task-list';

const LoadingDiv = styled.div`
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SkeletonChart = styled.div`
  width: 110px;
  height: 110px;
  border: 40px solid #e8e8e8;
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

export default function Skeleton(): JSX.Element {
  return (
    <LoadingDiv>
      <ClipLoadingDiv>
        <SkeletonChart>
          <BeatLoader color="#e8e8e8" />
        </SkeletonChart>
      </ClipLoadingDiv>
      <TaskList
        assignments={[]}
        selectedCourseId={-1}
        showDateHeadings={false}
        skeleton
      />
    </LoadingDiv>
  );
}
