import React, { useEffect } from 'react';
import styled from 'styled-components';
import TaskContainer from './TaskContainer';
import BeatLoader from './spinners/BeatLoader';
import { Options } from '../types';
import CompareMonthDate from '../utils/compareMonthDate';
import useAssignments from '../hooks/useAssignments';
import AssignmentMap from '../types/assignmentMap';
import { useState } from 'react';
import TaskList from './TaskList';

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

interface ContentLoaderProps {
  options: Options;
  startDate: Date;
  endDate: Date;
  loadedCallback: () => void;
}

/*
  utility component that fetches async data and re-renders content when necessary
*/

function ContentLoader({
  options,
  startDate,
  endDate,
  loadedCallback,
}: ContentLoaderProps): JSX.Element {
  const [assignmentData, setAssignmentData] = useState<AssignmentMap | null>();

  const { data, isError, isSuccess } = useAssignments(
    startDate,
    endDate,
    options
  );

  useEffect(() => {
    if (isSuccess) {
      setAssignmentData(data as AssignmentMap);
      loadedCallback();
    }
  }, [isSuccess]);

  const failed = 'Failed to load';
  return (
    <>
      {!isSuccess && !isError && !assignmentData && (
        <LoadingDiv>
          <ClipLoadingDiv>
            <SkeletonChart>
              <BeatLoader color="#e8e8e8" />
            </SkeletonChart>
          </ClipLoadingDiv>
          <TaskList assignments={[]} options={options} skeleton />
        </LoadingDiv>
      )}
      {assignmentData ? (
        <TaskContainer
          data={assignmentData as AssignmentMap}
          loading={!isSuccess}
          options={options}
        />
      ) : (
        ''
      )}
      {isError && <h1>{failed}</h1>}
    </>
  );
}

/*
  compareProps function so content is re-rendered properly when prev and next buttons clicked
*/
function compareProps(
  prevProps: ContentLoaderProps,
  nextProps: ContentLoaderProps
) {
  return (
    CompareMonthDate(prevProps.startDate, nextProps.startDate) &&
    CompareMonthDate(prevProps.endDate, nextProps.endDate)
  );
}

export default React.memo(ContentLoader, compareProps);
