import React, { useState } from 'react';
import styled from 'styled-components';
import Header from './header';
import ContentLoader from './content-loader';
import { Options } from '../types';
import getPeriod from '../utils/getPeriod';
import { QueryClient, QueryClientProvider } from 'react-query';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

interface AppProps {
  options: Options;
}

const queryClient = new QueryClient();

export default function App({ options }: AppProps): JSX.Element {
  const [delta, setDelta] = useState(0);
  const [clickable, setClickable] = useState(false);
  const { start, end } = getPeriod(
    options.period,
    options.start_date,
    options.start_hour,
    options.start_minutes,
    delta,
    options.rolling_period
  );

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
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
