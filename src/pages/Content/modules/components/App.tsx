import React, { useState } from 'react';
import styled from 'styled-components';
import Title from './Title';
import ContentLoader from './ContentLoader';
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
  const [clickable, setClickable] = useState(true);
  const { start, end } = getPeriod(options.period, options.startDate, delta);
  /*
    localize dates
  */
  const startLocal = new Date(
    start.getTime() + start.getTimezoneOffset() * 60 * 1000
  );
  const endLocal = new Date(
    end.getTime() + end.getTimezoneOffset() * 60 * 1000
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
        <Title
          clickable={clickable}
          onNextClick={onNextClick}
          onPrevClick={onPrevClick}
          weekEnd={end}
          weekStart={start}
        />
        <ContentLoader
          endDate={endLocal}
          loadedCallback={loadedCallback}
          options={options}
          startDate={startLocal}
        />
      </AppContainer>
    </QueryClientProvider>
  );
}
