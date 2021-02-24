import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const TitleDiv = styled.div`
  border-bottom: 1px solid #c7cdd1;
  height: 30px;
  font-weight: bold;
  display: inline-block;
`;

const NextButton = styled.div`
  width: 0;
  height: 0;
  border-top: 4px solid transparent;
  border-left: 7px solid
    ${(props) =>
      props.clickable ? 'rgba(0, 0, 0, 45%)' : 'rgba(0, 0, 0, 20%)'};
  border-bottom: 4px solid transparent;
  background: transparent;
`;

const PrevButton = styled.div`
  width: 0;
  height: 0;
  border-top: 4px solid transparent;
  border-right: 7px solid
    ${(props) =>
      props.clickable ? 'rgba(0, 0, 0, 45%)' : 'rgba(0, 0, 0, 20%)'};
  border-bottom: 4px solid transparent;
  background: transparent;
`;

const ButtonContainerLeft = styled.div`
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

const ButtonContainerRight = styled.div`
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

/*
  Renders the title of the app, bounds for current time period, and prev/next buttons
*/

export default function Title({
  weekStart,
  weekEnd,
  clickable,
  onPrevClick,
  onNextClick,
}) {
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

Title.defaultProps = {
  clickable: false,
  onNextClick: () => {},
  onPrevClick: () => {},
};

Title.propTypes = {
  clickable: PropTypes.bool,
  onNextClick: PropTypes.func,
  onPrevClick: PropTypes.func,
  weekEnd: PropTypes.instanceOf(Date).isRequired,
  weekStart: PropTypes.instanceOf(Date).isRequired,
};
