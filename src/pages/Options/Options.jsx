import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TimePicker from 'react-time-picker';
import DayButton from './DayButton';
import './Options.css';
import OptionsRow from './OptionsRow';
import Switch from 'react-switch';

const Label = styled.div`
  padding-top: 5px;
  padding-right: 10px;
  font-size: 15px;
  color: ${(props) => (props.disabled ? '#B5B5B5' : 'black')};
`;

const CenterContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
`;

const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
  float: left;
`;

const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  float: right;
`;

export default function Options() {
  const [day, setDay] = useState(-1);
  const [period, setPeriod] = useState(-1);
  const [hour, setHour] = useState(-1);
  const [minutes, setMinutes] = useState(-1);
  const [sidebar, setSidebar] = useState(true);
  const periods = ['Day', 'Week', 'Month'];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const prompt0 = 'Time period shown';
  const prompt1 = 'Start day for period';
  const prompt2 = 'Start time for period';
  const prompt3 = 'Hide default To Do sidebar';
  function handleChange(value) {
    chrome.storage.sync.set(
      { startHour: parseInt(value.substring(0, 2)) },
      function () {}
    );
    chrome.storage.sync.set(
      { startMinutes: parseInt(value.substring(3, 5)) },
      function () {}
    );
  }
  function handleDayClick(index) {
    chrome.storage.sync.set({ startDate: index });
    setDay(index);
  }
  function handlePeriodClick(index) {
    chrome.storage.sync.set({ period: periods[index] });
    setPeriod(index);
  }
  function toggleSidebar() {
    chrome.storage.sync.set({ sidebar: !sidebar });
    setSidebar(!sidebar);
  }
  useEffect(() => {
    chrome.storage.sync.get(
      ['startDate', 'period', 'startHour', 'startMinutes', 'sidebar'],
      function (result) {
        setDay(result.startDate);
        setPeriod(periods.indexOf(result.period));
        setHour(result.startHour);
        setMinutes(result.startMinutes);
        setSidebar(result.sidebar);
      }
    );
  }, [setPeriod, setDay, setHour, setMinutes, setSidebar]);
  return (
    <CenterContainer>
      <LeftSide>
        <OptionsRow content={<Label>{prompt0}</Label>} />
        <OptionsRow
          content={<Label disabled={period !== 1}>{prompt1}</Label>}
        />
        <OptionsRow content={<Label>{prompt2}</Label>} />
        <OptionsRow content={<Label>{prompt3}</Label>} />
      </LeftSide>
      <RightSide>
        <OptionsRow
          contentList={periods.map((p, i) => {
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
          keyList={periods.map((p) => {
            return p;
          })}
        />
        <OptionsRow
          contentList={days.map((d, i) => {
            return (
              <DayButton
                disabled={period !== 1}
                handleClick={handleDayClick}
                id={i + 1}
                key={d}
                selected={day - 1 == i}
              >
                {d}
              </DayButton>
            );
          })}
          keyList={days.map((d) => {
            return d;
          })}
        />
        <OptionsRow
          content={
            <TimePicker
              disableClock
              onChange={handleChange}
              value={
                hour >= 0 && minutes >= 0
                  ? new Date(0, 0, 0, hour, minutes)
                  : null
              }
            />
          }
        />
        <OptionsRow
          content={
            <Switch
              checked={!sidebar}
              onChange={toggleSidebar}
              onColor="#EE5533"
            />
          }
        />
      </RightSide>
    </CenterContainer>
  );
}
