import React from 'react';
import styled from 'styled-components';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 5px;
  height: 30px;
`;

interface OptionsRowProps {
  content?: React.ReactNode;
  contentList?: React.ReactNode[];
  keyList?: string[];
}
export default function OptionsRow({
  content = <></>,
  contentList = [],
  keyList = [],
}: OptionsRowProps) {
  return (
    <Row>
      {content}
      {contentList.map((contentItem, i) => {
        return <React.Fragment key={keyList[i]}>{contentItem}</React.Fragment>;
      })}
    </Row>
  );
}
