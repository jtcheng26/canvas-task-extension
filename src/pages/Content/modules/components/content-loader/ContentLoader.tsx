import React, { useEffect } from 'react';
import TaskContainer from '../task-container';
import { Options } from '../../types';
import CompareMonthDate from './utils/compareMonthDate';
import useAssignments from '../../hooks/useAssignments';
import Skeleton from '../skeleton';

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
    if (isSuccess) {
      loadedCallback();
    }
  }, [isSuccess]);

  const failed = 'Failed to load';
  return (
    <>
      {!isSuccess && !isError && !data && <Skeleton />}
      {data ? (
        <TaskContainer
          assignments={data}
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
