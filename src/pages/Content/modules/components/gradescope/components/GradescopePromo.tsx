/* eslint-disable react/jsx-no-literals */
import React from 'react';
import GradescopeButton from './GradescopeButton';
import styled from 'styled-components';
import { ButtonGroup } from './CoursePopup';
import { CANVAS_LOGO_ICON } from '../constants';

const PromoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #cdcdcd;
  border-radius: 2px;
  > * + * {
    margin-top: 10px;
  }
  margin-bottom: 20px;
  line-height: normal;
`;

const FineText = styled.span`
  font-size: 12px;
  color: #878787;
  margin-top: 30px;
`;

const HeaderText = styled.h2`
  > * + * {
    margin-left: 7px;
  }

  display: flex;
  align-items: center;
  flex-direction: row;
`;

type Props = {
  onSubmit: () => void;
  onExit: () => void;
};

export default function GradescopePromo({ onSubmit, onExit }: Props) {
  const headerText = 'Sync Gradescope with Tasks for Canvas';

  const bodyText = (
    <>
      Click <strong>“Sync with Tasks for Canvas”</strong> to automatically add
      this course’s Gradescope assignments to Tasks for Canvas.{' '}
      <strong>This must be done separately for each course</strong> you want to
      sync. Assignments will be updated whenever you visit Gradescope (to submit
      an assignment, for example).
    </>
  );

  const fineText =
    'This is a feature from the Tasks for Canvas browser extension. Select Disable to opt out for this course. You can disable this feature entirely in the extension settings.';
  return (
    <PromoWrapper>
      <HeaderText>
        <span>{headerText} </span>
        {CANVAS_LOGO_ICON}
      </HeaderText>
      <span>{bodyText}</span>
      <FineText>{fineText}</FineText>
      <ButtonGroup left>
        <GradescopeButton
          label="Sync with Tasks for Canvas"
          mode="primary"
          onClick={onSubmit}
        />{' '}
        <GradescopeButton label="Disable" mode="secondary" onClick={onExit} />
      </ButtonGroup>
    </PromoWrapper>
  );
}
