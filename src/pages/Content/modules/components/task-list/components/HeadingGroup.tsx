import React from 'react';
import styled from 'styled-components';
import { AnimatedProps, TransitionState } from '../../task-card/TaskCard';

const HeadingContainer = styled.div.attrs((props: AnimatedProps) => ({
  style: {
    height: props.opacity ? 24 * props.opacity : 0,
    opacity: props.opacity ? props.opacity * props.opacity : 0,
  },
}))<AnimatedProps>`
  width: 100%;
  padding-bottom: 1px;
  color: #6c757c;
  font-size: small;
  vertical-align: bottom;

  display: flex;
  flex-direction: row;
`;

const TextDiv = styled.span`
  align-self: flex-end;
`;

interface HeadingGroupProps {
  heading: string;
  transitionState: TransitionState;
}
export default function HeadingGroup({
  heading,
  transitionState,
}: HeadingGroupProps): JSX.Element {
  const dueText = 'due';
  const noDueLabel = new Set([
    'Overdue',
    'Graded',
    'Ungraded',
    'Needs Grading',
  ]);
  return (
    <HeadingContainer
      height={transitionState ? transitionState.height : 5}
      key={heading}
      opacity={transitionState ? transitionState.opacity : 1}
    >
      <TextDiv>
        {!noDueLabel.has(heading) ? dueText : ''} <strong>{heading}</strong>
      </TextDiv>
    </HeadingContainer>
  );
}
