import React from 'react';
import styled from 'styled-components';
import { GRADESCOPE_THEME_COLOR } from '../constants';

type Props = {
  label: string;
  mode: 'primary' | 'secondary';
  onClick: () => void;
};

const PrimaryButton = styled.button`
  background-color: ${GRADESCOPE_THEME_COLOR};
  border-radius: 5px;
  color: white;
  font-weight: 600;
  outline: none;
  transition: opacity 100ms ease-in-out;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
  padding: 0px 20px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SecondaryButton = styled.button`
  border-radius: 5px;
  font-weight: 600;
  border: 1px solid #cdcdcd;
  outline: none;
  transition: background-color 100ms ease-in-out;
  &:hover {
    cursor: pointer;
    background-color: #e1e1e1;
  }
  padding: 0px 20px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function GradescopeButton({ label, mode, onClick }: Props) {
  if (mode === 'primary')
    return (
      <PrimaryButton onClick={onClick} type="button">
        {label}
      </PrimaryButton>
    );
  return (
    <SecondaryButton onClick={onClick} type="button">
      {label}
    </SecondaryButton>
  );
}
