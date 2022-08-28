import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import styled from 'styled-components';
import useCourses from '../../hooks/useCourses';
import { FinalAssignment } from '../../types';
import CourseDropdown from '../course-dropdown';
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
  top: 200px;
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
  const [selectedCourseId, setSelectedCourseId] = useState(-1);

  const titleLabel = 'Title';
  const dateLabel = 'Due Date';
  const courseLabel = 'Course (optional)';

  function setSelected(date?: Date) {
    setSelectedDate(date);
  }
  return (
    <FormContainer visible={visible}>
      <Form>
        <FormItem>
          <FormTitle>{titleLabel}</FormTitle>
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
      </Form>
    </FormContainer>
  );
}
