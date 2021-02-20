import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const SubtitleDiv = styled.div`
  border-bottom: 1px solid #c7cdd1;
  height: 25px;
`;

/*
  Renders a subtitle within the app
*/

export default function Subtitle({ text }) {
  return (
    <SubtitleDiv>
      <div style={{ float: 'left' }}>{text}</div>
    </SubtitleDiv>
  );
}

Subtitle.defaultProps = {
  text: '',
};

Subtitle.propTypes = {
  text: PropTypes.string,
};
