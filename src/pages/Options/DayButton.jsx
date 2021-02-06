import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledButton = styled.div`
  margin: 2px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 0px;
  background: ${(props) => (props.selected ? '#AAAAFF' : '#EFEFEF')};
  &:hover {
    background: ${(props) => (props.selected ? '#AAAAFF' : '#CCCCCC')};
  }
`;

export default function DayButton({ selected, id, handleClick, children }) {
  function onClick() {
    handleClick(id);
  }
  return (
    <StyledButton onClick={onClick} selected={selected}>
      {children}
    </StyledButton>
  );
}

DayButton.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  handleClick: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
};