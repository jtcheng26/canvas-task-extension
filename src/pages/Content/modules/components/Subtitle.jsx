import React from 'react';
import styled from 'styled-components';

const SubtitleDiv = styled.div`
  border-bottom: 1px solid #c7cdd1;
  height: 25px;
`;

export default function Subtitle() {
  const unfinished = 'Unfinished';
  return (
    <SubtitleDiv>
      <div style={{ float: 'left' }}>{unfinished}</div>
    </SubtitleDiv>
  );
}
