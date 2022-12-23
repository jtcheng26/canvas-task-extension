import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import ArrowButton from '../../arrow-button/ArrowButton';
import { Direction } from '../../../types';
import { THEME_COLOR } from '../../../constants';
import { ColorProps } from './DatePick';

const Input = styled.input<ColorProps>`
  border: 1px solid rgb(199, 205, 299);
  height: 38px;
  padding: 0px 10px;
  border-radius: 4px;
  font-size: 16px;
  outline-color: ${(props) => props.color || THEME_COLOR};
  display: flex;
  justify-content: space-between;
`;

const Select = styled.div<ColorProps>`
  border: 1px solid rgb(199, 205, 299);
  height: 38px;
  padding: 0px 10px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    outline-color: ${(props) => props.color || THEME_COLOR};
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
  color?: string;
  onChange?: (value: string) => void;
  onClick?: () => void;
  onFocus?: () => void;
  onUnfocus?: () => void;
  select?: boolean;
  value: string;
  menuVisible?: boolean;
};

export default function TextInput({
  menuVisible,
  color,
  onChange,
  onClick,
  onFocus,
  onUnfocus,
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
      color={color}
      contentEditable={!!onChange}
      onBlur={onUnfocus}
      onChange={handleChange}
      onClick={onClick}
      onFocus={onFocus}
      value={value}
    />
  ) : (
    <Select color={color} onClick={handleClick}>
      {value}{' '}
      <ArrowButton
        direction={menuVisible ? Direction.UP : Direction.DOWN}
        hoverIndependent={false}
        hovering={false}
      />
    </Select>
  );
}
