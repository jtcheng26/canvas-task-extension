import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const TitleDiv = styled.div`
  border-bottom: 1px solid #c7cdd1;
  height: 30px;
  font-weight: bold;
  display: inline-block;
`;

const NextButton = styled.button`
  border: 2px solid rgba(0, 0, 0, 40%);
  border-width: 2px 2px 0px 0px;
  transform: rotate(45deg);
  width: 7px;
  height: 7px;
  padding: 2px;
  background: transparent;
  margin: 0px 2px 2px 0px;
  &:hover {
    border-color: rgba(0, 0, 0, 75%);
  }
`;

const PrevButton = styled.button`
  border: 2px solid rgba(0, 0, 0, 40%);
  border-width: 2px 0px 0px 2px;
  transform: rotate(-45deg);
  width: 7px;
  height: 7px;
  padding: 2px;
  margin: 0px 0px 2px 2px;
  background: transparent;
  &:hover {
    border-color: rgba(0, 0, 0, 75%);
  }
`;
const ButtonContainer = styled.div`
  display: inline-block;
  margin: 0px 3px;
  float: right;
`;

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
  return (
    <TitleDiv>
      <div style={{ float: 'left' }}>{tasks}</div>
      <ButtonContainer>
        <NextButton disabled={!clickable} onClick={onNextClick} type="button" />
      </ButtonContainer>
      <div style={{ float: 'right' }}>{`${start} to ${end}`}</div>
      <ButtonContainer>
        <PrevButton disabled={!clickable} onClick={onPrevClick} type="button" />
      </ButtonContainer>
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
