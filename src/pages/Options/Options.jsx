import React, { useState } from 'react';
import styled from 'styled-components';
import TimePicker from 'react-time-picker';
import DayButton from './DayButton';

const OptionsDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  padding: 5px;
`;

const Label = styled.div`
  padding-top: 5px;
  padding-right: 10px;
  font-family: sans-serif;
  font-size: 15px;
`;

const Title = styled.div`
  font-size: 30px;
`;

export default function Options() {
  const [day, setDay] = useState(1);
  const [period, setPeriod] = useState(1);
  const periods = ['Day', 'Week', 'Month'];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const title = 'Canvas Tasks Options';
  const prompt0 = 'Choose a time period: ';
  const prompt1 = 'Choose a start day for the week:';
  const prompt2 = 'Choose a start time for the week:';
  function handleChange(value) {
    chrome.storage.sync.set(
      { startHour: parseInt(value.substring(0, 2)) },
      function () {}
    );
    chrome.storage.sync.set(
      { startMinutes: parseInt(value.substring(3, 5)) },
      function () {}
    );
    console.log(value);
  }
  function handleDayClick(index) {
    chrome.storage.sync.set({ startDate: index }, function () {});
    setDay(index);
  }
  function handlePeriodClick(index) {
    chrome.storage.sync.set({ period: periods[index] });
    setPeriod(index);
  }
  return (
    <OptionsDiv>
      <Row>
        <Title>{title}</Title>
      </Row>
      <Row>
        <Label>{prompt0}</Label>
        {periods.map((p, i) => {
          return (
            <DayButton
              handleClick={handlePeriodClick}
              id={i}
              key={p}
              selected={period == i}
            >
              {p}
            </DayButton>
          );
        })}
      </Row>
      <Row>
        <Label>{prompt1}</Label>
        {days.map((d, i) => {
          return (
            <DayButton
              handleClick={handleDayClick}
              id={i + 1}
              key={d}
              selected={day - 1 == i}
            >
              {d}
            </DayButton>
          );
        })}
      </Row>
      <Row>
        <Label>{prompt2}</Label>
        <TimePicker disableClock onChange={handleChange} />
      </Row>
    </OptionsDiv>
  );
}
