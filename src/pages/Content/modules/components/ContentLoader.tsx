import React, { useEffect } from 'react';
import styled from 'styled-components';
import TaskContainer from './TaskContainer';
import MoonLoader from 'react-spinners/MoonLoader';
import { Options } from '../types';
import CompareMonthDate from '../utils/compareMonthDate';
import useAssignments from '../hooks/useAssignments';
import AssignmentMap from '../types/assignmentMap';
import { useState } from 'react';

const LoadingDiv = styled.div`
  padding-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
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
          <MoonLoader
            color="var(--ic-link-color)"
            css="align-self: center;"
            loading
            size={50}
          />
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
