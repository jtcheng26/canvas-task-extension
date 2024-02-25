import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  overflow: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 4000;
  background-color: rgba(0, 0, 0, 0.5);
`;

type Props = { children: React.ReactNode; onClick: () => void };

export default function Modal({ children, onClick }: Props) {
  return <ModalOverlay onClick={onClick}>{children}</ModalOverlay>;
}
