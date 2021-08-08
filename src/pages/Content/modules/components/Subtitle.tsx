import React from 'react';
import styled from 'styled-components';

const SubtitleDiv = styled.div`
  border-bottom: 1px solid #c7cdd1;
  height: 25px;
`;

interface SubtitleProps {
  text: string;
}

/*
  Renders a subtitle within the app
*/
export default function Subtitle({ text }: SubtitleProps): JSX.Element {
  return (
    <SubtitleDiv>
      <div style={{ float: 'left' }}>{text}</div>
    </SubtitleDiv>
  );
}
