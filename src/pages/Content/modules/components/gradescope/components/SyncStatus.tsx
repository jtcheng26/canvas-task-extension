import React from 'react';
import styled from 'styled-components';
import { GRADESCOPE_THEME_COLOR } from '../constants';

type DivProps = {
  synced: boolean;
};

const SyncedDiv = styled.div<DivProps>`
  color: ${(p) => (p.synced ? GRADESCOPE_THEME_COLOR : '#878787')};
  font-weight: 400;
  padding: 10px;
  line-height: normal;
  &:hover {
    cursor: pointer;
  }
  display: flex;
  align-items: center;
  > * + * {
    margin-left: 8px;
  }
`;

const SyncedIcon = (
  <svg
    fill={GRADESCOPE_THEME_COLOR}
    height="20px"
    viewBox="0 0 1920 1920"
    width="20px"
  >
    <path
      d="M960 0c529.28 0 960 430.613 960 960s-430.72 960-960 960S0 1489.387 0 960c0-239.04 88.64-465.92 244.48-640H53.333V106.667H640v586.666H426.667v-254.08C291.733 577.387 213.333 762.987 213.333 960c0 411.627 334.934 746.667 746.667 746.667s746.667-335.04 746.667-746.667S1371.733 213.333 960 213.333Zm297.93 690.261 150.827 150.934-486.826 486.826-304-304.106 150.826-150.827 153.174 153.28 336-336.107Z"
      fillRule="evenodd"
    />
  </svg>
);

const NotSyncedIcon = (
  <svg fill="#878787" height="20px" viewBox="0 0 1920 1920" width="20px">
    <path
      d="M960 0c529.28 0 960 430.613 960 960s-430.72 960-960 960S0 1489.387 0 960c0-239.04 88.64-465.92 244.48-640H53.333V106.667H640v586.666H426.667v-254.08C291.733 577.387 213.333 762.987 213.333 960c0 411.627 334.934 746.667 746.667 746.667s746.667-335.04 746.667-746.667S1371.733 213.333 960 213.333Zm191.253 671.253L1302.08 822.08l-191.253 191.253 191.253 191.254-150.827 150.826L960 1164.16l-191.253 191.253-150.827-150.826 191.253-191.254L617.92 822.08l150.827-150.827L960 862.507l191.253-191.254Z"
      fillRule="evenodd"
    />
  </svg>
);

type Props = {
  onClick: () => void;
  synced: boolean;
};

export default function SyncStatus({ synced, onClick }: Props) {
  const text = synced
    ? 'Synced with Tasks for Canvas'
    : 'Not Synced with Tasks for Canvas';
  const icon = synced ? SyncedIcon : NotSyncedIcon;
  return (
    <SyncedDiv onClick={onClick} synced={synced}>
      {icon} <span>{text}</span>
    </SyncedDiv>
  );
}
