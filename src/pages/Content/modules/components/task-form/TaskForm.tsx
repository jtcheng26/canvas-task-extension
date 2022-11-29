import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { AssignmentDefaults, THEME_COLOR } from '../../constants';
import useCourseColors from '../../hooks/useCourseColors';
import useCourseNames from '../../hooks/useCourseNames';
import useCoursePositions from '../../hooks/useCoursePositions';
import useCourses from '../../hooks/useCourses';
import { CheckIcon } from '../../icons';
import { AssignmentType, FinalAssignment } from '../../types';
import createCustomTask from '../../utils/createCustomTask';
import isDemo from '../../utils/isDemo';
import CourseDropdown from '../course-dropdown';
import Button from './components/Button';
import DatePick from './components/DatePick';
import TextInput from './components/TextInput';
import TimePick from './components/TimePick';

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
  width: 100%;
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

const ErrorMessage = styled.div`
  color: #ec412d;
  padding: 5px 0px;
`;

type Props = {
  close: () => void;
  onSubmit?: (assignment: FinalAssignment) => void;
  selectedCourse?: number;
  visible?: boolean;
};

export default function TaskForm({
  close,
  onSubmit,
  selectedCourse,
  visible = false,
}: Props): JSX.Element {
  const [title, setTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedTime, setSelectedTime] = useState(1439);
  const { data: courses } = useCourses();
  const { data: courseMap } = useCourseNames();
  const { data: colors } = useCourseColors();
  const { data: positions } = useCoursePositions();

  const coursesWithoutCustom = useMemo(() => {
    if (courses) {
      return courses.filter((c) => c.id > 0);
    }
    return [];
  }, [courses]);

  const titleLabel = 'Title';
  const dateLabel = 'Due Date';
  const courseLabel = 'Course (optional)';
  const [errorMessage, setErrorMessage] = useState('');

  function setSelected(date?: Date) {
    setSelectedDate(date);
  }

  // const coursePage = onCoursePage();
  const [selectedCourseId, setSelectedCourseId] = useState(
    selectedCourse || -1
  );

  async function submit() {
    setErrorMessage('');
    const assignment: FinalAssignment = {
      ...AssignmentDefaults,
    } as FinalAssignment;
    assignment.name = title;
    selectedDate?.setHours(selectedTime / 60);
    selectedDate?.setMinutes(selectedTime % 60);
    selectedDate?.setSeconds(0);
    assignment.due_at = selectedDate?.toISOString() || new Date().toISOString();
    assignment.course_id =
      selectedCourseId === -1 ? AssignmentDefaults.course_id : selectedCourseId;
    assignment.course_name =
      courseMap && selectedCourseId in courseMap
        ? courseMap[selectedCourseId]
        : 'Custom Task';
    assignment.color =
      colors && selectedCourseId in colors
        ? colors[selectedCourseId]
        : THEME_COLOR;
    assignment.position =
      positions && selectedCourseId in positions
        ? positions[selectedCourseId]
        : AssignmentDefaults.position;
    assignment.type = AssignmentType.NOTE;
    assignment.id = Math.floor(1000000 * Math.random());

    const res = await createCustomTask(
      title,
      assignment.due_at,
      assignment.course_id
    );
    if (!res && !isDemo()) {
      setErrorMessage('An error occurred. Make sure you have cookies enabled.');
    } else {
      assignment.id = res && !!res.id ? res.id : assignment.id;
      assignment.plannable_id = assignment.id; // for marking completing right after creating
      if (onSubmit) onSubmit(assignment);
      close();
    }
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
        <FormItem>
          <TimePick selected={selectedTime} setSelected={setSelectedTime} />
        </FormItem>
        <FormItem>
          <FormTitle>{courseLabel}</FormTitle>
          <CourseDropdown
            courses={coursesWithoutCustom}
            defaultOption="None"
            instructureStyle
            onCoursePage={selectedCourse !== 0 && !!selectedCourse}
            selectedCourseId={selectedCourseId}
            setCourse={setSelectedCourseId}
          />
        </FormItem>
        <FormItem>
          <Button
            color={THEME_COLOR}
            disabled={!title}
            label="Save"
            onClick={submit}
          />
        </FormItem>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </Form>
    </FormContainer>
  );
}
