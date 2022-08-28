import React, { ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import ArrowButton from '../../arrow-button/ArrowButton';
import { Direction } from '../../../types';

const Input = styled.input`
  border: 1px solid rgb(199, 205, 299);
  height: 38px;
  padding: 0px 10px;
  border-radius: 4px;
  font-size: 16px;
  outline-color: #ec412d;
`;

const Select = styled.div`
  border: 1px solid rgb(199, 205, 299);
  height: 38px;
  padding: 0px 10px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    outline-color: #ec412d;
    outline-width: 2px;
    outline-style: solid;
    outline-offset: -1px;
  }
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

type Props = {
  onChange?: (value: string) => void;
  onClick?: () => void;
  select?: boolean;
  value: string;
  menuVisible?: boolean;
};

export default function TextInput({
  menuVisible,
  onChange,
  onClick,
  select,
  value,
}: Props): JSX.Element {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (onChange) onChange(e.target?.value);
  }
  function handleClick() {
    if (onClick) onClick();
  }
  return !select ? (
    <Input
      contentEditable={!!onChange}
      onChange={handleChange}
      onClick={onClick}
      value={value}
    />
  ) : (
    <Select onClick={handleClick}>
      {value}{' '}
      <ArrowButton
        direction={menuVisible ? Direction.UP : Direction.DOWN}
        hoverIndependent={false}
        hovering={false}
      />
    </Select>
  );
}
