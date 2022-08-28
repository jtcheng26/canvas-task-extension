import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import styled from 'styled-components';
import TextInput from './TextInput';

const DatePickerContainer = styled.div`
  .rdp {
    margin: 10px 0px;
    --rdp-cell-size: 30px;
    --rdp-accent-color: #ec412d;
    --rdp-background-color: #ec412d33;
    --rdp-accent-color-dark: #ec412d;
    --rdp-background-color-dark: #180270;
  }

  position: relative;
`;

type Props = {
  selected?: Date;
  setSelected: (date?: Date) => void;
};

export default function DatePick({
  selected,
  setSelected,
}: Props): JSX.Element {
  const [pickerVisible, setPickerVisible] = useState(false);
  function onSelect(date?: Date) {
    setPickerVisible(false);
    setSelected(date);
  }
  function showPicker() {
    setPickerVisible(true);
  }
  return (
    <DatePickerContainer>
      <TextInput
        onClick={showPicker}
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
