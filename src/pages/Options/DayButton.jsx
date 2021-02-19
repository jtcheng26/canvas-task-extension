import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledButton = styled.div`
  font-family: Lato;
  font-weight: bold;
  min-width: 40px;
  min-height: 17px;
  margin: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 8px;
  border-radius: 2px;
  color: ${(props) => (props.disabled ? '#555555' : 'black')};
  background: ${(props) => {
    if (props.disabled) return '#E5E5E5';
    else if (props.selected) return '#EE5533';
    else return '#FDFDFD';
  }};
  &:hover {
    background: ${(props) => {
      if (props.disabled) return '#E5E5E5';
      else if (props.selected) return '#EE5533';
      else return '#F2F2F2';
    }};
  }
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3);
  cursor: ${(props) => (props.disabled ? 'auto' : 'pointer')};
`;

export default function DayButton({
  selected,
  id,
  handleClick,
  children,
  disabled,
}) {
  function onClick() {
    handleClick(id);
  }
  return (
    <StyledButton disabled={disabled} onClick={onClick} selected={selected}>
      {children}
    </StyledButton>
  );
}

DayButton.defaultProps = {
  disabled: false,
};

DayButton.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  disabled: PropTypes.bool,
  handleClick: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
};
