import React from 'react';
import styled from 'styled-components';

const TitleDiv = styled.div`
  border-bottom: 1px solid #c7cdd1;
  height: 30px;
  font-weight: bold;
  display: inline-block;
`;

interface ButtonProps {
  clickable: boolean;
}
const NextButton = styled.div<ButtonProps>`
  width: 0;
  height: 0;
  border-top: 4px solid transparent;
  border-left: 7px solid
    ${(props) =>
      props.clickable ? 'rgba(0, 0, 0, 45%)' : 'rgba(0, 0, 0, 20%)'};
  border-bottom: 4px solid transparent;
  background: transparent;
`;

const PrevButton = styled.div<ButtonProps>`
  width: 0;
  height: 0;
  border-top: 4px solid transparent;
  border-right: 7px solid
    ${(props) =>
      props.clickable ? 'rgba(0, 0, 0, 45%)' : 'rgba(0, 0, 0, 20%)'};
  border-bottom: 4px solid transparent;
  background: transparent;
`;

const ButtonContainerLeft = styled.div<ButtonProps>`
  padding: 5px;
  border-radius: 100%;
  display: inline-block;
  margin: 0px 2px 0px 2px;
  background: white;
  &:hover {
    cursor: ${(props) => (props.clickable ? 'pointer' : 'auto')};
    background: ${(props) =>
      props.clickable ? 'rgba(0, 0, 0, 10%)' : 'white'};
    div {
      border-right: 7px solid
        ${(props) =>
          props.clickable ? 'rgba(0, 0, 0, 75%)' : 'rgba(0, 0, 0, 20%)'};
    }
  }
`;

const ButtonContainerRight = styled.div<ButtonProps>`
  padding: 5px;
  border-radius: 100%;
  display: inline-block;
  margin: 0px 2px 0px 2px;
  background: white;
  &:hover {
    cursor: ${(props) => (props.clickable ? 'pointer' : 'auto')};
    background: ${(props) =>
      props.clickable ? 'rgba(0, 0, 0, 10%)' : 'white'};
    div {
      border-left: 7px solid
        ${(props) =>
          props.clickable ? 'rgba(0, 0, 0, 75%)' : 'rgba(0, 0, 0, 20%)'};
    }
  }
`;

const LeftFloat = styled.div`
  float: left;
`;

const RightFloat = styled.div`
  float: right;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

interface TitleProps {
  weekStart: Date;
  weekEnd: Date;
  clickable: boolean;
  onPrevClick: () => void;
  onNextClick: () => void;
}

/*
  Renders the title of the app, bounds for current time period, and prev/next buttons
*/
export default function Title({
  weekStart,
  weekEnd,
  clickable = false,
  onPrevClick,
  onNextClick,
}: TitleProps) {
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
  const ButtonLeft = <PrevButton clickable={clickable} />;
  const ButtonRight = <NextButton clickable={clickable} onClick={nextClick} />;
  return (
    <TitleDiv>
      <LeftFloat>{tasks}</LeftFloat>
      <RightFloat>
        <ButtonContainerLeft clickable={clickable} onClick={prevClick}>
          {ButtonLeft}
        </ButtonContainerLeft>
        {`${start} to ${end}`}
        <ButtonContainerRight clickable={clickable} onClick={nextClick}>
          {ButtonRight}
        </ButtonContainerRight>
      </RightFloat>
    </TitleDiv>
  );
}
