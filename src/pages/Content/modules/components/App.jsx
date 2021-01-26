import React from 'react';
import Title from './Title';
import MoonLoader from 'react-spinners/MoonLoader';
import TaskContainer from './TaskContainer';
import { css } from '@emotion/core';
import { dataFetcher } from '../api/APIcalls';
import { useAsync } from 'react-async';

export default function App() {
  const delta = 0;
  function getPrevMonday() {
    const d = new Date();
    d.setDate(d.getDate() - ((d.getDay() - 1 + 7) % 7));
    d.setHours(0, 0, 0);
    return d;
  }
  function getNextMonday() {
    const d = new Date();
    if (d.getDay() != 1) {
      d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7));
    } else {
      d.setDate(d.getDate() + 7);
    }
    d.setHours(0, 0, 0);
    return d;
  }
  const prevMonday = getPrevMonday();
  const nextMonday = getNextMonday();
  prevMonday.setDate(prevMonday.getDate() + 7 * delta);
  nextMonday.setDate(nextMonday.getDate() + 7 * delta);
  const prevMondayLocal = new Date(
    prevMonday.getTime() + prevMonday.getTimezoneOffset() * 60 * 1000
  );
  const nextMondayLocal = new Date(
    nextMonday.getTime() + nextMonday.getTimezoneOffset() * 60 * 1000
  );
  const style = {
      display: 'flex',
      flexDirection: 'column',
    },
    { data, error, isPending } = useAsync({
      promiseFn: dataFetcher.getRelevantAssignments,
      startDate: prevMondayLocal,
      endDate: nextMondayLocal,
    }),
    failed = 'Failed to load';
  return (
    <div style={style}>
      <Title weekEnd={nextMonday} weekStart={prevMonday} />
      {isPending && (
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
    </div>
  );
}
