import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import styled from 'styled-components';
import { THEME_COLOR, THEME_COLOR_LIGHT } from '../../../constants';
import TextInput from './TextInput';

export type ColorProps = {
  color?: string;
};

const DatePickerContainer = styled.div<ColorProps>`
  .rdp {
    margin: 10px 0px;
    --rdp-cell-size: 30px;
    --rdp-accent-color: ${(props) => props.color || THEME_COLOR};
    --rdp-background-color: ${THEME_COLOR_LIGHT};
    --rdp-accent-color-dark: ${(props) => props.color || THEME_COLOR};
    --rdp-background-color-dark: #180270;
  }

  position: relative;
`;

type Props = {
  color?: string;
  selected?: Date;
  setSelected: (date?: Date) => void;
};

export default function DatePick({
  color,
  selected,
  setSelected,
}: Props): JSX.Element {
  const [pickerVisible, setPickerVisible] = useState(false);
  function onSelect(date?: Date) {
    setPickerVisible(false);
    setSelected(date);
  }
  function togglePicker() {
    setPickerVisible(!pickerVisible);
  }
  return (
    <DatePickerContainer color={color}>
      <TextInput
        color={color}
        menuVisible={pickerVisible}
        onClick={togglePicker}
        select
        value={selected ? selected.toLocaleDateString() : ''}
      />
      {pickerVisible && (
        <DayPicker
          mode="single"
          onSelect={onSelect}
          selected={selected}
          styles={{
            caption: {
              fontSize: 14,
            },
            day: {
              fontSize: 14,
            },
          }}
        />
      )}
    </DatePickerContainer>
  );
}
