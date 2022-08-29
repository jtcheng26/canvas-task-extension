import React from 'react';
import styled from 'styled-components';

const HeadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 5px;
  color: #6c757c;
  font-size: small;
`;

interface HeadingGroupProps {
  heading: string;
  children?: React.ReactNode;
}
export default function HeadingGroup({
  heading,
  children,
}: HeadingGroupProps): JSX.Element {
  const dueText = 'due';
  const noDueLabel = new Set(['Overdue', 'Graded', 'Ungraded']);
  return (
    <HeadingContainer key={heading}>
      <span>
        {!noDueLabel.has(heading) ? dueText : ''} <strong>{heading}</strong>
      </span>
      {children}
    </HeadingContainer>
  );
}
