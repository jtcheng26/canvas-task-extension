import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TaskContainer from './TaskContainer';
import MoonLoader from 'react-spinners/MoonLoader';
import { css } from '@emotion/core';
// import { dataFetcher } from '../utils/fetcher';
import getData from '../networking/getData';

/*
  compareProps function so content is re-rendered properly when prev and next buttons clicked
*/

function compareProps(prevProps, nextProps) {
  return (
    prevProps.startDate.getMonth() == nextProps.startDate.getMonth() &&
    prevProps.startDate.getDate() == nextProps.startDate.getDate() &&
    prevProps.endDate.getMonth() == nextProps.endDate.getMonth() &&
    prevProps.endDate.getDate() == nextProps.endDate.getDate()
  );
}

/*
  utility component that fetches async data and re-renders content when necessary
*/

function ContentLoader({ userOptions, startDate, endDate, loadedCallback }) {
  const [data, setData] = useState({});
  const [isPending, setPending] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    async function fetchData() {
      try {
        setPending(true);
        setError(false);
        const response = await getData(userOptions, startDate, endDate);
        setData(response);
        loadedCallback();
        setPending(false);
      } catch (err) {
        setPending(false);
        loadedCallback();
        setError(true);
      }
    }
    fetchData();
  }, [userOptions, startDate, endDate, setData, setPending, setError]);
  const failed = 'Failed to load';
  return (
    <>
      {isPending && !error && (
        <div
          style={{
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MoonLoader
            color="var(--ic-link-color)"
            css={css`
              align-self: center;
            `}
            loading
            size={50}
          />
        </div>
      )}
      {!isPending && !error && <TaskContainer data={data} />}
      {error && <h1>{failed}</h1>}
    </>
  );
}

ContentLoader.defaultProps = {
  loadedCallback: () => {},
};

ContentLoader.propTypes = {
  endDate: PropTypes.instanceOf(Date).isRequired,
  loadedCallback: PropTypes.func,
  startDate: PropTypes.instanceOf(Date).isRequired,
  userOptions: PropTypes.shape({
    period: PropTypes.string,
    startDate: PropTypes.number,
    startHour: PropTypes.number,
    startMinutes: PropTypes.number,
    sidebar: PropTypes.bool,
    user_courses: PropTypes.bool,
  }).isRequired,
};

export default React.memo(ContentLoader, compareProps);
