import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TaskContainer from './TaskContainer';
import MoonLoader from 'react-spinners/MoonLoader';
import getData from '../networking/getData';
import { Data, Options } from '../types';
import CompareMonthDate from '../utils/compareMonthDate';
import useAssignments from '../hooks/useAssignments';
import AssignmentMap from '../types/assignmentMap';

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
  const { data, isError, isSuccess } = useAssignments(
    startDate,
    endDate,
    options
  );

  useEffect(() => {
    if (isSuccess) loadedCallback();
  }, [isSuccess]);
  // const [data, setData] = useState({});
  // const [isPending, setPending] = useState(true);
  // const [error, setError] = useState(false);
  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       setPending(true);
  //       setError(false);
  //       const response = (await getData(options, startDate, endDate)) as Data;
  //       setData(response);
  //       loadedCallback();
  //       setPending(false);
  //     } catch (err) {
  //       setPending(false);
  //       loadedCallback();
  //       setError(true);
  //     }
  //   }
  //   fetchData();
  // }, [options, startDate, endDate, setData, setPending, setError]);
  const failed = 'Failed to load';
  return (
    <>
      {!isSuccess && !isError && (
        <LoadingDiv>
          <MoonLoader
            color="var(--ic-link-color)"
            css="align-self: center;"
            loading
            size={50}
          />
        </LoadingDiv>
      )}
      {isSuccess ? <TaskContainer data={data as AssignmentMap} /> : ''}
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
