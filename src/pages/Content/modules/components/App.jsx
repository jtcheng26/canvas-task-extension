import React, { useState } from 'react';
import Title from './Title';
import ContentLoader from './ContentLoader';

export default function App() {
  const [delta, setDelta] = useState(0); // 0: initial call, 1/2: updates
  const [clickable, setClickable] = useState(true);
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
        weekEnd={nextMonday}
        weekStart={prevMonday}
      />
      <ContentLoader
        endDate={nextMondayLocal}
        loadedCallback={loadedCallback}
        startDate={prevMondayLocal}
      />
    </div>
  );
}
