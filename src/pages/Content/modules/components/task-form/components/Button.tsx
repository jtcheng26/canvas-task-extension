import React from 'react';
import styled from 'styled-components';

type StyledButtonProps = {
  color: string;
  disabled?: boolean;
};

const StyledButton = styled.button<StyledButtonProps>`
  background-color: ${(props) => props.color};
  outline: none;
  &:hover {
    background-color: ${(props) => props.color}aa;
  }

  font-size: 16px;
  font-weight: 500;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;

  transition: background-color 0.5s;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
`;

type Props = {
  label: string;
  onClick: () => void;
  color: string;
  disabled?: boolean;
};

export default function Button({
  color,
  disabled,
  label,
  onClick,
}: Props): JSX.Element {
  return (
    <StyledButton
      color={disabled ? 'rgba(180, 180, 180)' : color}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {label}
    </StyledButton>
  );
}
