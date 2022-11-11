import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import Header from './header';
import ContentLoader from './content-loader';
import getPeriod from '../utils/getPeriod';
import useOptions from '../hooks/useOptions';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
`;


// App - Tasks for Canvas
export default function App(): JSX.Element {
  const [delta, setDelta] = useState(0);
  const [clickable, setClickable] = useState(false);
  const { data: options } = useOptions();
  const { start, end } = useMemo(() => {
    if (options) {
      return getPeriod(
        options.period,
        options.start_date,
        options.start_hour,
        options.start_minutes,
        delta,
        options.rolling_period
      );
    }

    return {
      start: new Date(),
      end: new Date(),
    };
  }, [options, delta]);

  /*
    when prev/next buttons clicked
  */
  function incrementDelta(d: number) {
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
  return options ? (
    <AppContainer>
      <Header
        clickable={clickable}
        onNextClick={onNextClick}
        onPrevClick={onPrevClick}
        weekEnd={end}
        weekStart={start}
      />
      <ContentLoader
        endDate={end}
        loadedCallback={loadedCallback}
        options={options}
        startDate={start}
      />
    </AppContainer>
  ) : (
    <div />
  );
}
