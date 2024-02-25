import React, { useState } from 'react';
import styled from 'styled-components';
import CourseDropdown from '../../course-dropdown';
import { GRADESCOPE_THEME_COLOR } from '../constants';
import GradescopeButton from './GradescopeButton';

const PopupDialog = styled.dialog`
  display: flex;
  width: 400px;
  padding: 15px 30px;
  flex-direction: column;
  > * + * {
    margin-top: 15px;
  }
  font-size: 14px;
  border-radius: 5px;
  line-height: normal;
  margin: 50px auto;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  > * + * {
    margin-left: 15px;
  }
`;

type Props = {
  courseToName: Record<string, string>;
  onCancel: () => void;
  onSubmit: (id: string) => void;
  synced: boolean;
};

export default function CoursePopup({
  courseToName,
  onSubmit,
  onCancel,
  synced,
}: Props) {
  const initial = Object.keys(courseToName)[0];
  const [selectedCourse, setSelectedCourse] = useState(initial);
  const choices = Object.keys(courseToName).map((course) => ({
    id: course,
    name: courseToName[course],
    color: GRADESCOPE_THEME_COLOR,
  }));
  function handleClick(e: React.MouseEvent<HTMLDialogElement, MouseEvent>) {
    e.stopPropagation();
  }
  function handleSubmit() {
    onSubmit(selectedCourse);
  }
  const headerText = synced ? 'Unsync Course' : 'Link to Canvas Course';
  const descText = synced
    ? 'Gradescope assignments for this course will be removed from Tasks for Canvas. They will return if you choose to sync again later.'
    : 'Gradescope tasks for this course will fall under your selected Canvas course.';
  return (
    <PopupDialog onClick={handleClick}>
      <h1>{headerText}</h1>
      <span>{descText}</span>
      {!synced && (
        <CourseDropdown
          choices={choices}
          defaultColor={GRADESCOPE_THEME_COLOR}
          instructureStyle
          noDefault
          onCoursePage={false}
          selectedId={selectedCourse}
          setChoice={setSelectedCourse}
        />
      )}

      <ButtonGroup>
        <GradescopeButton label="Cancel" mode="secondary" onClick={onCancel} />
        <GradescopeButton
          label="Confirm"
          mode="primary"
          onClick={handleSubmit}
        />
      </ButtonGroup>
    </PopupDialog>
  );
}
