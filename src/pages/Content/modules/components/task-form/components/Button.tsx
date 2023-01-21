import React from 'react';
import styled from 'styled-components';

type StyledButtonProps = {
  color: string;
  disabled?: boolean;
};

const StyledButton = styled.button<StyledButtonProps>`
  background-color: ${(props) => props.color};
  outline: none;
  opacity: 1;
  &:hover {
    opacity: ${(props) => (props.disabled ? '1' : '0.7')};
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
  dark?: boolean;
  disabled?: boolean;
};

export default function Button({
  color,
  dark,
  disabled,
  label,
  onClick,
}: Props): JSX.Element {
  return (
    <StyledButton
      color={
        disabled
          ? !dark
            ? 'rgba(180, 180, 180)'
            : 'var(--tfc-dark-mode-bg-secondary)'
          : color
      }
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {label}
    </StyledButton>
  );
}
