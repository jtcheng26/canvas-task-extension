import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Title from './Title';
import ContentLoader from './ContentLoader';

export default function App({ userOptions }) {
  const [delta, setDelta] = useState(0); // 0: initial call, 1/2: updates
  const [clickable, setClickable] = useState(true);
  function getWeekStart() {
    const d = new Date();
    d.setDate(d.getDate() - ((d.getDay() - userOptions.startDate + 7) % 7));
    d.setHours(0, 0, 0);
    return d;
  }
  function getWeekEnd() {
    const d = new Date();
    if (d.getDay() != userOptions.startDate) {
      d.setDate(d.getDate() + ((userOptions.startDate + 7 - d.getDay()) % 7));
    } else {
      d.setDate(d.getDate() + 7);
    }
    d.setHours(0, 0, 0);
    return d;
  }
  function getMonthStart() {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0);
    return d;
  }
  function getMonthEnd() {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    d.setHours(0, 0, 0);
    return d;
  }
  function getDayStart() {
    const d = new Date();
    d.setHours(0, 0, 0);
    return d;
  }
  function getDayEnd() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0);
    return d;
  }
  let prevPeriodStart;
  let nextPeriodStart;
  if (userOptions.period === 'Month') {
    prevPeriodStart = getMonthStart();
    nextPeriodStart = getMonthEnd();
    prevPeriodStart.setMonth(prevPeriodStart.getMonth() + delta);
    nextPeriodStart.setMonth(nextPeriodStart.getMonth() + delta);
  } else if (userOptions.period === 'Day') {
    prevPeriodStart = getDayStart();
    nextPeriodStart = getDayEnd();
    prevPeriodStart.setDate(prevPeriodStart.getDate() + delta);
    nextPeriodStart.setDate(nextPeriodStart.getDate() + delta);
  } else if (userOptions.period === 'Week') {
    prevPeriodStart = getWeekStart();
    nextPeriodStart = getWeekEnd();
    prevPeriodStart.setDate(prevPeriodStart.getDate() + 7 * delta);
    nextPeriodStart.setDate(nextPeriodStart.getDate() + 7 * delta);
  }
  const prevPeriodStartLocal = new Date(
    prevPeriodStart.getTime() + prevPeriodStart.getTimezoneOffset() * 60 * 1000
  );
  const nextPeriodStartLocal = new Date(
    nextPeriodStart.getTime() + nextPeriodStart.getTimezoneOffset() * 60 * 1000
  );
  const style = {
    display: 'flex',
    flexDirection: 'column',
  };
  function incrementDelta(d) {
    setDelta(delta + d);
  }
  function loadedCallback() {
    setClickable(true);
  }
  function onPrevClick() {
    setClickable(false);
    incrementDelta(-1);
  }
  function onNextClick() {
    setClickable(false);
    incrementDelta(1);
  }
  return (
    <div style={style}>
      <Title
        clickable={clickable}
        onNextClick={onNextClick}
        onPrevClick={onPrevClick}
        weekEnd={nextPeriodStart}
        weekStart={prevPeriodStart}
      />
      <ContentLoader
        endDate={nextPeriodStartLocal}
        loadedCallback={loadedCallback}
        startDate={prevPeriodStartLocal}
        userOptions={userOptions}
      />
    </div>
  );
}

App.propTypes = {
  userOptions: PropTypes.shape({
    period: PropTypes.string,
    startDate: PropTypes.number,
    startHour: PropTypes.number,
    startMinutes: PropTypes.number,
  }).isRequired,
};
