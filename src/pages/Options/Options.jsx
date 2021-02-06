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
  chrome.storage.sync.get(null, function (result) {
    if (!result.startDate) {
      chrome.storage.sync.set({ startDate: 1 }, function () {});
    }
    if (!result.startHour) {
      chrome.storage.sync.set({ startHour: 15 }, function () {});
    }
    if (!result.startMinutes) {
      chrome.storage.sync.set({ startMinutes: 0 }, function () {});
    }
  });
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
  const [day, setDay] = useState(1);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const title = 'Canvas Tasks Options';
  const prompt1 = 'Choose a start day for the week:';
  const prompt2 = 'Choose a start time for the week:';
  return (
    <OptionsDiv>
      <Row>
        <Title>{title}</Title>
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
