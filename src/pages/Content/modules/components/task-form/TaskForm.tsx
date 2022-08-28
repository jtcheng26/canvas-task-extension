import React, { useState } from 'react';
import styled from 'styled-components';
import { AssignmentDefaults } from '../../constants';
import useCourseColors from '../../hooks/useCourseColors';
import useCourseNames from '../../hooks/useCourseNames';
import useCoursePositions from '../../hooks/useCoursePositions';
import useCourses from '../../hooks/useCourses';
import { CheckIcon } from '../../icons';
import { AssignmentType, FinalAssignment } from '../../types';
import createCustomTask from '../../utils/createCustomTask';
import CourseDropdown from '../course-dropdown';
import Button from './components/Button';
import DatePick from './components/DatePick';
import TextInput from './components/TextInput';

type FormContainerProps = {
  visible?: boolean;
};

const FormContainer = styled.div<FormContainerProps>`
  display: ${(props) => (props.visible ? 'flex' : 'none')};
  position: absolute;
  z-index: 1000;
  width: 100%;
  right: 0;
  left: 0;
  top: 100px;
  justify-content: center;
  align-items: center;
`;

const Form = styled.div`
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  display: flex;
  width: 80%;
  padding: 10px;
  flex-direction: column;
`;

const FormTitle = styled.div`
  font-weight: 700;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
`;

const FormItem = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
`;

type Props = {
  close: () => void;
  onSubmit?: (assignment: FinalAssignment) => void;
  visible?: boolean;
};

export default function TaskForm({
  close,
  onSubmit,
  visible = false,
}: Props): JSX.Element {
  const [title, setTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const { data: courses } = useCourses();
  const { data: courseMap } = useCourseNames();
  const { data: colors } = useCourseColors();
  const { data: positions } = useCoursePositions();
  const [selectedCourseId, setSelectedCourseId] = useState(-1);

  const titleLabel = 'Title';
  const dateLabel = 'Due Date';
  const courseLabel = 'Course (optional)';

  function setSelected(date?: Date) {
    setSelectedDate(date);
  }

  function submit() {
    const assignment: FinalAssignment = AssignmentDefaults as FinalAssignment;
    assignment.name = title;
    selectedDate?.setHours(23, 59, 59);
    assignment.due_at = selectedDate?.toISOString() || new Date().toISOString();
    assignment.course_id =
      selectedCourseId === -1 ? AssignmentDefaults.course_id : selectedCourseId;
    assignment.course_name =
      courseMap && selectedCourseId >= 0
        ? courseMap[selectedCourseId]
        : 'Custom Task';
    assignment.color =
      colors && selectedCourseId >= 0
        ? colors[selectedCourseId]
        : AssignmentDefaults.color;
    assignment.position =
      positions && positions[selectedCourseId]
        ? positions[selectedCourseId]
        : AssignmentDefaults.position;
    assignment.type = AssignmentType.NOTE;
    if (onSubmit) onSubmit(assignment);
    createCustomTask(
      title,
      assignment.due_at.split('T')[0],
      assignment.course_id
    );
    close();
  }
  return (
    <FormContainer visible={visible}>
      <Form>
        <FormItem>
          <FormTitle>
            {titleLabel}
            <CheckIcon checkStyle="X" onClick={close} />
          </FormTitle>
          <TextInput onChange={setTitle} value={title} />
        </FormItem>
        <FormItem>
          <FormTitle>{dateLabel}</FormTitle>
          <DatePick selected={selectedDate} setSelected={setSelected} />
        </FormItem>
        {courses && (
          <FormItem>
            <FormTitle>{courseLabel}</FormTitle>
            <CourseDropdown
              courses={courses}
              defaultOption="None"
              instructureStyle
              onCoursePage={false}
              selectedCourseId={selectedCourseId}
              setCourse={setSelectedCourseId}
            />
          </FormItem>
        )}
        <FormItem>
          <Button
            color="#ec412d"
            disabled={!title}
            label="Save"
            onClick={submit}
          />
        </FormItem>
      </Form>
    </FormContainer>
  );
}
