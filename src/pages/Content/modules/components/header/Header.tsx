import React from 'react';
import styled from 'styled-components';
import { SettingsIcon } from '../../icons';
import { Direction } from '../../types';
import { DarkProps } from '../../types/props';
import ArrowButton from '../arrow-button/ArrowButton';

const TitleDiv = styled.div<DarkProps>`
  border-bottom: 1px solid
    ${(props) =>
      props.dark
        ? 'var(--tfc-dark-mode-text-secondary)'
        : 'rgb(199, 205, 209)'};
  color: ${(props) =>
    props.dark ? 'var(--tfc-dark-mode-text-primary)' : 'inherit'};
  min-height: 30px;
  font-size: 16px;
  font-weight: bold;
  display: inline-block;
`;

const ButtonContainer = styled.div`
  margin: 0px 2px;
`;

const LeftFloat = styled.div<DarkProps>`
  float: left;
  display: flex;
  align-items: center;

  .tasks-extension-settings {
    fill: ${(props) =>
      props.dark
        ? 'var(--tfc-dark-mode-text-secondary)'
        : 'var(--ic-brand-font-color-dark)'};
    &:hover {
      fill: rgb(125, 134, 141);
    }
  }

  a {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const RightFloat = styled.div`
  float: right;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export interface HeaderProps {
  dark?: boolean;
  weekStart: Date;
  weekEnd: Date;
  clickable: boolean;
  onPrevClick: () => void;
  onNextClick: () => void;
}

/*
  Renders the title of the app, bounds for current time period, and prev/next buttons
*/
export default function Header({
  dark,
  weekStart,
  weekEnd,
  clickable = false,
  onPrevClick,
  onNextClick,
}: HeaderProps): JSX.Element {
  const start = weekStart.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    end = weekEnd.toLocaleString('en-US', { month: 'short', day: 'numeric' }),
    tasks = 'Tasks';
  function prevClick() {
    if (clickable) {
      onPrevClick();
    }
  }
  function nextClick() {
    if (clickable) {
      onNextClick();
    }
  }
  return (
    <TitleDiv dark={dark}>
      <LeftFloat dark={dark}>
        <span style={{ marginRight: '4px' }}>{tasks}</span>
        <a
          href={chrome.runtime.getURL('options.html')}
          rel="noreferrer"
          target="_blank"
        >
          {SettingsIcon}
        </a>
      </LeftFloat>
      <RightFloat>
        <ButtonContainer>
          <ArrowButton
            dark={dark}
            direction={Direction.LEFT}
            disabled={!clickable}
            onClick={prevClick}
          />
        </ButtonContainer>
        {`${start} to ${end}`}
        <ButtonContainer>
          <ArrowButton
            dark={dark}
            direction={Direction.RIGHT}
            disabled={!clickable}
            onClick={nextClick}
          />
        </ButtonContainer>
      </RightFloat>
    </TitleDiv>
  );
}
