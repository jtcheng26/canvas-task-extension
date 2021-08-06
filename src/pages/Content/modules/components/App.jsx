import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Title from './Title';
import ContentLoader from './ContentLoader';

/*
  functions to get the previous and next occurence of a specific day of the week
*/

function getWeekStart(startDate) {
  const d = new Date();
  d.setDate(d.getDate() - ((d.getDay() - startDate + 7) % 7));
  d.setHours(0, 0, 0);
  return d;
}
function getWeekEnd(startDate) {
  const d = new Date();
  if (d.getDay() != startDate) {
    d.setDate(d.getDate() + ((startDate + 7 - d.getDay()) % 7));
  } else {
    d.setDate(d.getDate() + 7);
  }
  d.setHours(0, 0, 0);
  return d;
}
/*
  functions to get the start and end of the current month
*/
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
/*
  functions to get the start and end of the current day
*/
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

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function App({ userOptions }) {
  const [delta, setDelta] = useState(0);
  const [clickable, setClickable] = useState(true);
  let prevPeriodStart;
  let nextPeriodStart;
  /*
    set time period based on user-selected options and set delta based on current period
  */
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
    prevPeriodStart = getWeekStart(userOptions.startDate);
    nextPeriodStart = getWeekEnd(userOptions.startDate);
    prevPeriodStart.setDate(prevPeriodStart.getDate() + 7 * delta);
    nextPeriodStart.setDate(nextPeriodStart.getDate() + 7 * delta);
  }
  /*
    localize dates
  */
  const prevPeriodStartLocal = new Date(
    prevPeriodStart.getTime() + prevPeriodStart.getTimezoneOffset() * 60 * 1000
  );
  const nextPeriodStartLocal = new Date(
    nextPeriodStart.getTime() + nextPeriodStart.getTimezoneOffset() * 60 * 1000
  );
  /*
    when prev/next buttons clicked
  */
  function incrementDelta(d) {
    setDelta(delta + d);
  }
  /*
    only allow prev/next buttons to be clicked once content is loaded
  */
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
    <AppContainer>
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
        options={userOptions}
      />
    </AppContainer>
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
