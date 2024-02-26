import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import CourseDropdown from '../../course-dropdown';
import { GRADESCOPE_THEME_COLOR } from '../constants';
import GradescopeButton from './GradescopeButton';
import { compareTwoStrings } from 'string-similarity';

const PopupDialog = styled.dialog`
  display: flex;
  width: 400px;
  padding: 20px 30px;
  flex-direction: column;
  > * + * {
    margin-top: 20px;
  }
  font-size: 14px;
  border-radius: 2px;
  line-height: normal;
  margin: 50px auto;
`;

type ButtonGroupProps = {
  left?: boolean;
};

export const ButtonGroup = styled.div<ButtonGroupProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${(p) => (!p.left ? 'justify-content: flex-end;' : '')}
  > * + * {
    margin-left: 15px;
  }
`;

type Props = {
  courseToName: Record<string, string>;
  onCancel: () => void;
  onSubmit: (id: string) => void;
  synced: boolean;
  courseName: string;
};

export default function CoursePopup({
  courseToName,
  onSubmit,
  onCancel,
  synced,
  courseName,
}: Props) {
  const sim: Record<string, number> = useMemo(() => {
    return Object.values(courseToName).reduce(
      (sum, n) => ({
        ...sum,
        [n]: compareTwoStrings(n, courseName),
      }),
      {}
    );
  }, [courseToName, courseName]);
  console.log(sim);
  const choices = Object.keys(courseToName)
    .map((course) => ({
      id: course,
      name: courseToName[course],
      color: GRADESCOPE_THEME_COLOR,
    }))
    .sort((a, b) => {
      return sim[b.name] - sim[a.name];
    });
  const initial = choices[0].id;
  const [selectedCourse, setSelectedCourse] = useState(initial);
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
