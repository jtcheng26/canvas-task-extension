import React from 'react';
import styled from 'styled-components';

type CheckboxProps = {
  checked: boolean;
};

const CheckboxWrapper = styled.div<CheckboxProps>`
  font-weight: bold;
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding: 0px 16px;
  background-color: ${(props) => (props.checked ? '#E4EDFD' : '#efefef')};
  color: ${(props) => (props.checked ? '#4989F4' : '#626E7B')};
  border-radius: 100px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  height: 52px;
  div {
    margin-right: 12px;
    border-radius: 100px;
    width: 1.5rem;
    height: 1.5rem;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  &:hover {
    background-color: #e4edfd;
    color: #4989f4;
    cursor: pointer;
    opacity: 0.7;
  }
  transition: all 0.2s ease-in-out;
`;

type Props = {
  text: string;
  checked: boolean;
  onClick: (value: boolean) => void;
};

export default function Checkbox({
  text,
  checked,
  onClick,
}: Props): JSX.Element {
  function handleClick() {
    onClick(!checked);
  }
  return (
    <CheckboxWrapper checked={checked} onClick={handleClick}>
      <div>{checked ? '✔' : ''}</div>
      {text}
    </CheckboxWrapper>
  );
}
