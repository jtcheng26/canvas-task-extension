import React from 'react';
import styled from 'styled-components';

const ModeSelectorWrapper = styled.div`
  font-weight: bold;
  background-color: #efefef;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 6px;
  border-radius: 100px;
  font-size: 0.875rem;
  line-height: 1.25rem;

  span {
    flex-grow: 1;
    padding-left: 12px;
  }

  .mode-unselected {
    color: #626e7b;
    padding: 10px 20px;
    transition: all 0.2s ease-in-out;
    &:hover {
      background-color: #626e7b50;
      cursor: pointer;
    }
    border-radius: 100px;
  }

  .mode-selected {
    color: white;
    background-color: #626e7b;
    padding: 10px 20px;
    border-radius: 100px;
  }
`;

const ModeChoices = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-right: 6px;

  > * + * {
    margin-left: 0.5rem;
  }
`;

export type Mode = {
  name: string;
  id: string;
};

type Props = {
  title: string;
  modes: Mode[];
  selected: string;
  onSelect: (id: string) => void;
};

export default function ModeSelector({
  title,
  modes,
  selected,
  onSelect,
}: Props): JSX.Element {
  function onClickFunc(id: string) {
    return () => onSelect(id);
  }
  return (
    <ModeSelectorWrapper>
      <span className="text-sm">{title}</span>
      <ModeChoices>
        {modes.map((mode) => (
          <div
            className={
              selected === mode.id ? 'mode-selected' : 'mode-unselected'
            }
            key={mode.id}
            onClick={onClickFunc(mode.id)}
          >
            {mode.name}
          </div>
        ))}
      </ModeChoices>
    </ModeSelectorWrapper>
  );
}
