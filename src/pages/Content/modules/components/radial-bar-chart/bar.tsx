import React, { useState, MouseEvent } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';

const Group = styled.g`
  &:hover {
    filter: opacity(0.6);
    cursor: pointer;
  }
`;

const BgCircle = styled.circle`
  fill: none;
`;

const ColorCircle = styled.circle`
  transform-origin: center center;
  transform: rotate(-90deg);
  fill: none;

  transition: stroke-dashoffset 1s ease-in-out;
`;

interface Props {
  progress: number;
  color: string;
  center: number;
  radius: number;
  width: number;
  id: number;
  onClick?: (id: number, e: MouseEvent) => void;
  onMouseEnter?: (id: number, e: MouseEvent) => void;
  onMouseLeave?: (id: number, e: MouseEvent) => void;
}

export default function RadialChartBar({
  progress,
  color,
  center,
  radius,
  width,
  id,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: Props): JSX.Element {
  const circumference = 2 * Math.PI * radius;
  const [strokeDashoffset, setOffset] = useState(circumference);
  useEffect(() => {
    setOffset((1 - progress) * circumference);
  });

  function handleClick(e: MouseEvent) {
    if (onClick) onClick(id, e);
  }

  function handleMouseEnter(e: MouseEvent) {
    if (onMouseEnter) onMouseEnter(id, e);
  }

  function handleMouseLeave(e: MouseEvent) {
    if (onMouseLeave) onMouseLeave(id, e);
  }
  return (
    <Group
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <BgCircle
        cx={center}
        cy={center}
        r={radius}
        stroke="#f2f2f2"
        strokeWidth={width}
      />
      <ColorCircle
        cx={center}
        cy={center}
        r={radius}
        stroke={color}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeWidth={width}
      />
    </Group>
  );
}
