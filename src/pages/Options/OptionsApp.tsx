import React from 'react';
import styled from 'styled-components';
import './Options.css';
import OptionsRow from './OptionsRow';
import Options from './Options';

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 5%);
`;

const OptionsDiv = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  font-family: Lato;
  border-radius: 5px;
`;

const Note = styled.div`
  padding-top: 5px;
  font-size: 12px;
  color: rgba(0, 0, 0, 50%);
`;

const Title = styled.div`
  font-size: 30px;
  padding: 10px 10px 10px 0px;
`;

export default function OptionsApp(): JSX.Element {
  const title = 'Canvas Tasks Options';
  const notice = 'Reload Canvas to see changes.';
  return (
    <FormContainer>
      <OptionsDiv>
        <OptionsRow content={<Title>{title}</Title>} />
        <Options />
        <OptionsRow content={<Note>{notice}</Note>} />
      </OptionsDiv>
    </FormContainer>
  );
}
