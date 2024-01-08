import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import Header from './header';
import ContentLoader from './content-loader';
import getPeriod from '../utils/getPeriod';
import { useOptionsStore } from '../hooks/useOptions';
import { OptionsContext } from '../contexts/contexts';
import { Options } from '../types';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

interface AppProps {
  options: Options;
  MIN_LOAD_TIME?: number; // for testing only
}

export default function App({
  options,
  MIN_LOAD_TIME = 350,
}: AppProps): JSX.Element {
  const [delta, setDelta] = useState(0);
  const [clickableState, setClickableState] = useState({
    clickable: false,
    firstLoad: true,
  });
  const optionsStore = useOptionsStore(options, () =>
    setClickableState({ clickable: false, firstLoad: false })
  );
  const { start, end } = useMemo(() => {
    setClickableState({ clickable: false, firstLoad: false });
    return getPeriod(
      optionsStore.state.period,
      optionsStore.state.start_date,
      optionsStore.state.start_hour,
      optionsStore.state.start_minutes,
      delta,
      optionsStore.state.rolling_period
    );
  }, [optionsStore.state, delta]);

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
    setClickableState({ clickable: true, firstLoad: false });
  }
  function onPrevClick() {
    setClickableState({ clickable: false, firstLoad: false });
    incrementDelta(-1);
  }
  function onNextClick() {
    setClickableState({ clickable: false, firstLoad: false });
    incrementDelta(1);
  }
  // options will always be available to children
  return (
    <AppContainer id="tfc-wall-sina">
      <OptionsContext.Provider value={optionsStore}>
        <Header
          clickable={clickableState.clickable}
          dark={options.dark_mode}
          onNextClick={onNextClick}
          onPrevClick={onPrevClick}
          weekEnd={end}
          weekStart={start}
        />
        <ContentLoader
          MIN_LOAD_TIME={MIN_LOAD_TIME}
          clickable={clickableState.clickable}
          endDate={end}
          firstLoad={clickableState.firstLoad}
          loadedCallback={loadedCallback}
          options={optionsStore.state}
          startDate={start}
        />
      </OptionsContext.Provider>
    </AppContainer>
  );
}
