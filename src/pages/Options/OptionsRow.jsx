import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 5px;
  height: 30px;
`;

export default function OptionsRow({ content, contentList, keyList }) {
  return (
    <Row>
      {content}
      {contentList.map((contentItem, i) => {
        return <React.Fragment key={keyList[i]}>{contentItem}</React.Fragment>;
      })}
    </Row>
  );
}

OptionsRow.defaultProps = {
  content: <div />,
  contentList: [<div key="0" />],
  keyList: ['0'],
};

OptionsRow.propTypes = {
  content: PropTypes.element,
  contentList: PropTypes.arrayOf(PropTypes.element),
  keyList: PropTypes.arrayOf(PropTypes.string),
};
