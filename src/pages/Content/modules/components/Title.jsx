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
  margin: 0px 0px 2px 5px;
  display: inline-block;
  width: 0;
  height: 0;
  border-top: 4px solid transparent;
  border-left: 7px solid
    ${(props) =>
      props.clickable ? 'rgba(0, 0, 0, 45%)' : 'rgba(0, 0, 0, 20%)'};
  border-bottom: 4px solid transparent;
  background: transparent;
  &:hover {
    cursor: ${(props) => (props.clickable ? 'pointer' : 'auto')};
    border-left: 7px solid
      ${(props) =>
        props.clickable ? 'rgba(0, 0, 0, 75%)' : 'rgba(0, 0, 0, 20%)'};
  }
`;

const PrevButton = styled.div`
  margin: 0px 5px 2px 0px;
  display: inline-block;
  width: 0;
  height: 0;
  border-top: 4px solid transparent;
  border-right: 7px solid
    ${(props) =>
      props.clickable ? 'rgba(0, 0, 0, 45%)' : 'rgba(0, 0, 0, 20%)'};
  border-bottom: 4px solid transparent;
  background: transparent;
  &:hover {
    cursor: ${(props) => (props.clickable ? 'pointer' : 'auto')};
    border-right: 7px solid
      ${(props) =>
        props.clickable ? 'rgba(0, 0, 0, 75%)' : 'rgba(0, 0, 0, 20%)'};
  }
`;

const LeftFloat = styled.div`
  float: left;
`;

const RightFloat = styled.div`
  float: right;
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
  return (
    <TitleDiv>
      <LeftFloat>{tasks}</LeftFloat>
      <RightFloat>
        <PrevButton clickable={clickable} onClick={prevClick} />
        {`${start} to ${end}`}
        <NextButton clickable={clickable} onClick={nextClick} />
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
