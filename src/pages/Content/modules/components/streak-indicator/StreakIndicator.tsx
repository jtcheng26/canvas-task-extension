import React from 'react';
import styled from 'styled-components';
import { ColorProps } from '../task-form/components/DatePick';

const Wrapper = styled.div`
  margin-top: 10px;
  position: relative;
  margin-left: auto;

  &:hover {
    cursor: pointer;

    .tfc-tooltip {
      visibility: visible;
      opacity: 1;
    }
    .tfc-streak {
      opacity: 0.7;
    }
  }
`;

const StreakWrapper = styled.div.attrs({ className: 'tfc-streak' })`
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: opacity 0.3s;
`;

const StreakText = styled.div<ColorProps>`
  margin-left: 4px;
  background-color: ${(props) => props.color || '#F2994A'};
  color: white;
  padding: 0px 10px;
  line-height: 22px;
  height: 22px;
  font-weight: bold;
  border-radius: 100px;
  font-size: 12px;
`;

const Tooltip = styled.div.attrs({ className: 'tfc-tooltip' })`
  visibility: hidden;
  transition: visibility 0s, opacity 0.3s;
  opacity: 0;
  position: absolute;
  top: 27px;
  background-color: #303b44;
  right: 0px;
  left: -40px;
  border-radius: 10px;
  padding: 10px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  text-align: center;
  z-index: 1000;
  box-shadow: 0 4px 7px rgba(0, 0, 0, 0.3);
`;

type Props = {
  streak?: number;
  color?: string;
};

export default function StreakIndicator({
  color = '#FF6F00',
  streak = 0,
}: Props): JSX.Element {
  const primary = color;
  const secondary = '#FDD231';
  const streakLabel = streak + ' Streak';
  const tooltipLabel =
    'Complete tasks before their due date to increase your streak!';
  return (
    <Wrapper>
      <StreakWrapper>
        <svg
          fill="none"
          height="22"
          viewBox="0 0 15 20"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect fill={secondary} height="9" width="7" x="4" y="10" />
          <path
            clipRule="evenodd"
            d="M4.6875 0C5.19583 5.99079 0 8.05328 0 13.3299C0 16.914 2.5575 19.9732 7.5 19.9999C12.4425 20.0265 15 16.3215 15 12.5366C15 9.08577 13.2817 5.83162 10.04 3.80831C10.81 5.98079 9.785 7.96494 8.78917 8.64827C8.8475 5.86746 7.85167 1.74082 4.6875 0ZM8.61333 10.8333C11.7425 14.1574 9.82083 18.3332 7.3075 18.3332C5.77833 18.3332 4.99167 17.279 5 16.1857C5.01583 14.1582 7.28083 14.1566 8.61333 10.8333V10.8333Z"
            fill={primary}
            fillRule="evenodd"
          />
        </svg>
        {/* <svg
        fill="none"
        height="19"
        viewBox="0 0 14 18"
        width="15"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clipRule="evenodd"
          d="M8.3 0.045986C8.50301 0.109828 8.68035 0.236767 8.80625 0.408342C8.93214 0.579916 9.00002 0.787179 9 0.999986V5.99999H13C13.1829 5.9999 13.3624 6.05 13.5188 6.14481C13.6752 6.23962 13.8026 6.37553 13.8872 6.53773C13.9717 6.69993 14.0102 6.88222 13.9983 7.06475C13.9865 7.24729 13.9248 7.42307 13.82 7.57299L6.82 17.573C6.69817 17.7475 6.52383 17.8786 6.32234 17.9472C6.12085 18.0159 5.90273 18.0184 5.6997 17.9545C5.49667 17.8905 5.31934 17.7635 5.19349 17.5918C5.06765 17.4202 4.99987 17.2128 5 17V12H1C0.817084 12.0001 0.637647 11.95 0.48122 11.8552C0.324793 11.7603 0.197368 11.6244 0.112812 11.4622C0.0282567 11.3 -0.0101895 11.1178 0.00165733 10.9352C0.0135042 10.7527 0.0751903 10.5769 0.180003 10.427L7.18 0.426986C7.30201 0.252773 7.47639 0.121998 7.6778 0.0536622C7.87922 -0.0146742 8.09717 -0.0170128 8.3 0.0469861V0.045986Z"
          fill={primary}
          fillRule="evenodd"
        />
      </svg> */}

        <StreakText color={primary}>{streakLabel}</StreakText>
      </StreakWrapper>
      <Tooltip>{tooltipLabel}</Tooltip>
    </Wrapper>
  );
}
