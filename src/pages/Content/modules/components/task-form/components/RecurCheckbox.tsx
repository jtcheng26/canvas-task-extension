import React from 'react';
import styled from 'styled-components';
import CourseDropdown from '../../course-dropdown';
import { DropdownChoice } from '../../course-dropdown/CourseDropdown';

type CheckProps = {
  checked?: boolean;
  color: string;
  dark?: boolean;
};

const Checkbox = styled.div<CheckProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  border-radius: 5px;
  padding: 5px;
  background-color: ${(props) =>
    props.checked
      ? props.color
      : props.dark
      ? 'var(--tfc-dark-mode-bg-secondary)'
      : '#dddddd'};
  transition: all 0.15s;

  &:hover {
    cursor: pointer;
    opacity: 60%;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const WarningText = styled.div`
  margin-top: 5px;
  font-size: 12px;
  opacity: 0.7;
`;

type Props = {
  color: string;
  dark?: boolean;
  recurrences: number;
  setRecurrences: (value: number) => void;
};

export default function RecurCheckbox({
  color,
  recurrences,
  setRecurrences,
  dark = false,
}: Props): JSX.Element {
  function toggleCheck() {
    if (recurrences > 1) setRecurrences(1);
    else setRecurrences(2);
  }
  function chooseRecurrences(id: string) {
    const p = parseInt(id);
    if (p) setRecurrences(p);
  }
  const repeatWeeklyText = 'Repeat Weekly';
  const numberOfWeeksText = 'Repeat for ';
  const repeatWarningText =
    'Note that repeating tasks can only be deleted individually.';
  const RECUR_MAX = 10;
  const recurOptions: DropdownChoice[] = [];
  for (let i = 2; i <= RECUR_MAX; i++) {
    recurOptions.push({
      id: i + '',
      name: i + ' Weeks',
      color: dark ? 'var(--tfc-dark-mode-text-primary)' : '#2d3b45',
    });
  }

  return (
    <div>
      <Row>
        <span style={{ fontWeight: 700 }}>{repeatWeeklyText}</span>
        <Checkbox
          checked={recurrences > 1}
          color={color}
          dark={dark}
          onClick={toggleCheck}
        >
          {recurrences > 1 && (
            <svg
              height="18"
              style={{
                fill: 'white',
                filter: 'drop-shadow( 2px 2px 2px rgba(0, 0, 0, .4))',
              }}
              viewBox="0 0 24 24"
              width="18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
            </svg>
          )}
        </Checkbox>
      </Row>
      {recurrences > 1 && (
        <>
          <div style={{ height: '10px' }} />
          <Row>
            {numberOfWeeksText}
            <CourseDropdown
              choices={recurOptions}
              defaultColor={color}
              instructureStyle
              maxHeight={150}
              noDefault
              onCoursePage={false}
              selectedId={recurrences + ''}
              setChoice={chooseRecurrences}
              zIndex={25}
            />
          </Row>
          <WarningText>{repeatWarningText}</WarningText>
        </>
      )}
    </div>
  );
}
